import { useEffect, useState } from "react";
import Button from "./Button";
import ButtonLoader from "./ButtonLoader";
import InputField from "./InputField";
import axiosInstance from "../axios-instance";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";

const PackagesComp = () => {
  const [packages, setPackages] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [posting, setPosting] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [packageId, setPackageId] = useState("");

  const fetchPackages = async () => {
    try {
      const res = await axiosInstance.get("/packages");
      if (res.data.status) {
        setPackages(res.data.payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const postPackage = async () => {
    if (!name || !amount) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    try {
      setPosting(true);
      const formData = {
        name,
        amount: parseFloat(amount),
      };

      const res = await axiosInstance.post("/packages", formData);
      if (res.data.status) {
        fetchPackages();
        resetForm();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPosting(false);
    }
  };

  const updatePackage = async () => {
    if (!name || !amount) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    try {
      setPosting(true);
      const formData = {
        id: packageId,
        name,
        amount: parseFloat(amount),
      };

      const res = await axiosInstance.put("/packages", formData);
      if (res.data.status) {
        fetchPackages();
        resetForm();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPosting(false);
    }
  };

  const deletePackage = (pkg) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the package!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/packages/${pkg.id}`);
          if (response.data.status) {
            fetchPackages();
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "The package has been deleted.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editPackage = (pkg) => {
    setPackageId(pkg.id);
    setEdit(true);
    setName(pkg.name);
    setAmount(pkg.amount);
  };

  const resetForm = () => {
    setName("");
    setAmount("");
    setEdit(false);
    setPackageId("");
  };

  return (
    <div className="w-full p-5 bg-white">
      <p className="title">Packages</p>
      <div className="flex gap-2 flex-wrap">
        <InputField
          placeholder="Package Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="mt-7 flex gap-2">
          {posting ? (
            <ButtonLoader />
          ) : isEdit ? (
            <>
              <div onClick={updatePackage}>
                <Button value={"Update"} />
              </div>
              <div onClick={resetForm}>
                <Button value={"Cancel"} />
              </div>
            </>
          ) : (
            <div onClick={postPackage}>
              <Button value={"Save"} />
            </div>
          )}
        </div>
      </div>

      {/* Display Packages Table */}
      <div className="grid text-sm font-bold grid-cols-3 border-b mt-4 cursor-pointer">
        <div className="p-2">Name</div>
        <div className="p-2">Amount (UGX)</div>
        <div className="p-2">Actions</div>
      </div>
      {packages.map((pkg, i) => (
        <div
          key={i}
          className="grid text-sm text-gray5 grid-cols-3 border-b border-gray2 hover:bg-gray1 cursor-pointer"
        >
          <div className="p-2">{pkg.name}</div>
          <div className="p-2">{pkg.amount}</div>
          <div className="p-2 flex gap-2">
            <BsPencilSquare
              onClick={() => editPackage(pkg)}
              className="text-yellow"
            />
            <BsTrash onClick={() => deletePackage(pkg)} className="text-red" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackagesComp;
