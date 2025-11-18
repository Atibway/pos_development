import React, { useEffect, useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { BsPencilSquare, BsSearch, BsTrash } from "react-icons/bs";
import ButtonAlt from "./ButtonAlt";
import axiosInstance from "../axios-instance";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ButtonLoader from "./ButtonLoader";
import Loader from "./Loader";

const Category = () => {
  const [cat, setCat] = useState(false);
  const openCat = () => {
    setCat(true);
  };
  const closecat = () => {
    setCat(false);
  };

  const [ed, setEd] = useState(false);
  const openEd = () => {
    setEd(true);
  };
  const closeEd = () => {
    setEd(false);
  };

  const [category, setCategory] = useState("");

  const [posting, setPosting] = useState(false);

  const [ecategory, seteCategory] = useState("");

  const [updating, setUpdating] = useState(false);
  const [categoryId, setcategoryId] = useState("");
  const editCat = (cat) => {
    seteCategory(cat.type);
    setcategoryId(cat.id);
    setEd(true);
  };

  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      let res = await axiosInstance.get("/categories");
      if (res.status) {
        setLoading(false);
        setCategories(res.data.payload);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const postCategory = async () => {
    if (category) {
      try {
        setPosting(true);
        let res = await axiosInstance.post("/categories", { type: category });
        if (res.status) {
          setPosting(false);
          setCategory("");
          fetchCategories();
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            icon: "success",
            showConfirmButton: false,
            timer: 500,
          });
        } else {
          setPosting(false);
        }
      } catch (error) {
        console.log();
      } finally {
        setPosting(false);
      }
    }
  };

  const updateCategory = async () => {
    try {
      setUpdating(true);
      let formData = {
        type: ecategory,
        id: categoryId,
      };
      let res = await axiosInstance.put("/categories", formData);
      if (res.status) {
        setUpdating(false);
        setCategory("");
        fetchCategories();
        closeEd();
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          icon: "success",
          showConfirmButton: false,
          timer: 500,
        });
      } else {
        setUpdating(false);
      }
    } catch (error) {
      console.log();
    } finally {
      setUpdating(false);
    }
  };

  const deletecategory = (category) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
            let formData = {
                Category: category.type
            }
          const response = await axiosInstance.post(
            `/categories/${category.id}`, formData
          );
          const { data } = response;
          const { status } = data;
          if (status) {
            fetchCategories();
            Swal.fire({
              icon: "success",
              showConfirmButton: false,
              timer: 500,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <div>
      <div onClick={openCat}>
        <ButtonAlt value={"Stock Category"} />
      </div>

      {cat ? (
        <div className="z-50 absolute top-0 right-0 left-0 h-full w-full bg-black/50 flex">
          <div className="w-7/12" onClick={closecat}></div>
          <div className="w-5/12 bg-white p-3">
            <p className="text-secondary text-xl font-semibold">
              Stock Category
            </p>
            <div className="flex">
              <div className="w-[60%] ml-5">
                <InputField
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category Name"
                  placeholder="Category Name"
                />
              </div>
              <div className="w-[20%] ml-5 mt-14">
                {posting ? (
                  <ButtonLoader />
                ) : (
                  <div onClick={postCategory}>
                    <Button value={"Add"} />
                  </div>
                )}
              </div>
            </div>
            <div className="text-secondary relative bg-gray1 flex font-medium">
              {ed ? (
                <div className=" absolute z-50 w-full bg-white shadow border border-gray2 rounded-md">
                  <div className="flex justify-between p-3 bg-gray1 font-semibold text-primary">
                    <div>
                      <p>Edit Category</p>
                    </div>
                    <div>
                      <p onClick={closeEd}>X</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-[60%] ml-5">
                      <InputField
                        value={ecategory}
                        onChange={(e) => seteCategory(e.target.value)}
                        label="Category Name"
                        placeholder="Category Name"
                      />
                    </div>
                    <div className="ml-5 mt-14">
                      {updating ? (
                        <ButtonLoader />
                      ) : (
                        <div onClick={updateCategory}>
                          <Button value={"Update"} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="p-2 w-7/12">Category</div>
              <div className="p-2 w-5/12">Action</div>
            </div>
            {categories.map((cat) => {
              return (
                <div
                  key={cat.id}
                  className="text-gray5 border-b w-full border-gray1 hover:bg-gray1 cursor-pointer flex text-sm"
                >
                  <div className="p-2 w-7/12">{cat?.type}</div>
                  <div className="p-2 w-5/12 flex">
                    <BsTrash
                      onClick={() => deletecategory(cat)}
                      className="text-red"
                    />
                    <BsPencilSquare
                      onClick={() => editCat(cat)}
                      className="text-yellow ml-5"
                    />
                  </div>
                </div>
              );
            })}
            {loading ? (
              <div className="flex justify-center mt-[10vh]">
                <Loader />{" "}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default Category;
