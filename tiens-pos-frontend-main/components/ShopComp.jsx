import { useEffect, useState } from "react";
import Button from "./Button";
import ButtonLoader from "./ButtonLoader";
import InputField from "./InputField";
import axiosInstance from "../axios-instance";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";
import Select from "react-select";

const ShopComp = () => {
  const [modal, setModal] = useState(false);
  const showModal = () => setModal(true);
  const closeModal = () => {
    resetForm();
    setModal(false);
  };

  const [shops, setShops] = useState([]);
  const [salesUsers, setSalesUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [serialNumber, setSerialNumber] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, SetContact] = useState("");
  const [posting, setPosting] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [shopId, setShopId] = useState("");

  const fetchShops = async () => {
    try {
      const res = await axiosInstance.get("/shops");
      if (res.data.status) {
        setShops(res.data.payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSalesUsers = async () => {
    try {
      const res = await axiosInstance.get("/staff");
      if (res.data.status) {
        const sales = res.data.payload.filter((user) =>
          user.roles.includes("sales")
        );
        setSalesUsers(sales);
      }
    } catch (error) {
      console.log("Error fetching sales users", error);
    }
  };

  useEffect(() => {
    fetchShops();
    fetchSalesUsers();
  }, []);

  const postShop = async () => {
    try {
      if (serialNumber && name && location && contact && selectedUser) {
        setPosting(true);
        const formData = {
          serialNumber,
          name,
          location,
          contact,
          userId: selectedUser.value, // send user ID
        };

        console.log("Posting shop data:", formData);
        
        const res = await axiosInstance.post("/shops", formData);
        if (res.data.status) {
          fetchShops();
          resetForm();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPosting(false);
    }
  };

  const updateShop = async () => {
    try {
      if (serialNumber && name && location && contact && selectedUser) {
        setPosting(true);
        const formData = {
          shopId,
          serialNumber,
          name,
          location,
          contact,
          userId: selectedUser.value,
        };
        const res = await axiosInstance.put("/shops", formData);
        if (res.data.status) {
          fetchShops();
          resetForm();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPosting(false);
    }
  };

  const resetForm = () => {
    setSerialNumber("");
    setName("");
    setLocation("");
    SetContact("");
    setSelectedUser(null);
    setEdit(false);
    setShopId("");
  };

  const deleteshop = (shop) => {
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
          const response = await axiosInstance.delete(`/shops/${shop.id}`);
          if (response.data.status) {
            fetchShops();
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "The shop has been deleted.",
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

  const editShop = (shop) => {
    setShopId(shop.id);
    setEdit(true);
    setModal(true);
    setSerialNumber(shop.serialNumber || "");
    setName(shop.name);
    setLocation(shop.location);
    SetContact(shop.contact);

    // Set full user object (label & value) for Select
    if (shop.user) {
      setSelectedUser({
        value: shop.user.id,
        label: shop.user.first_name,
      });
    } else {
      setSelectedUser(null);
    }
  };

  return (
    <div className="w-full p-5 bg-white">
      <p className="title">Shops</p>
      <div className="flex gap-2 flex-wrap">
        <InputField
          placeholder="Serial Number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />
        <InputField
          placeholder="Shop Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          placeholder="Shop Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <InputField
          placeholder="Shop Contacts"
          value={contact}
          onChange={(e) => SetContact(e.target.value)}
        />
        <div className="w-1/4">
          <p className="text-sm text-gray5 mb-3">Assign Sales User</p>
          <Select
            options={salesUsers.map((user) => ({
              value: user.id,
              label: user.first_name,
            }))}
            onChange={setSelectedUser}
            value={selectedUser}
            placeholder="Select Sales User"
          />
        </div>
        <div className="mt-7 flex gap-2">
          {posting ? (
            <ButtonLoader />
          ) : isEdit ? (
            <>
              <div onClick={updateShop}>
                <Button value={"Update"} />
              </div>
              <div onClick={resetForm}>
                <Button value={"Cancel"} />
              </div>
            </>
          ) : (
            <div onClick={postShop}>
              <Button value={"Save"} />
            </div>
          )}
        </div>
      </div>

      {/* Display Shops Table */}
      <div className="grid text-sm font-bold grid-cols-6 border-b mt-4 cursor-pointer">
        <div className="p-2">Serial No.</div>
        <div className="p-2">Name</div>
        <div className="p-2">Location</div>
        <div className="p-2">Contact</div>
        <div className="p-2">User</div>
        <div className="p-2">Actions</div>
      </div>
      {shops.map((shop, i) => (
        <div
          key={i}
          className="grid text-sm text-gray5 grid-cols-6 border-b border-gray2 hover:bg-gray1 cursor-pointer"
        >
          <div className="p-2">{shop.serialNumber || "N/A"}</div>
          <div className="p-2">{shop.name}</div>
          <div className="p-2">{shop.location}</div>
          <div className="p-2">{shop.contact}</div>
          <div className="p-2">{shop.user?.first_name || "N/A"}</div>
          <div className="p-2 flex gap-2">
            <BsPencilSquare
              onClick={() => editShop(shop)}
              className="text-yellow"
            />
            <BsTrash onClick={() => deleteshop(shop)} className="text-red" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopComp;
