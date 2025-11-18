import React, { useState, useEffect } from "react";
import InputField from "../components/InputField";
import Button2 from "../components/Button2";
import { BsSearch } from "react-icons/bs";
import UserTable from "../components/user/UserTable";
import Button from "../components/Button";
import ButtonSecondary from "../components/ButtonSecondary";
import axiosInstance from "../axios-instance";
import ButtonLoader from "../components/ButtonLoader";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Select from "react-select";

const Users = () => {
  const [staff, setStaff] = useState([]);
  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [posting, setPosting] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [roles, setRoles] = useState([]);

  // Fetch staff on mount and after user creation
  const fetchStaff = async () => {
    try {
      const res = await axiosInstance.get("/staff");
      if (res.data && res.data.status) {
        setStaff(res.data.payload || []);
      }
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      setStaff([]);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Modal handlers
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  // Post new user
  const postUser = async () => {
    if (firstName.trim() && lastName.trim() && email.trim()) {
      try {
        setPosting(true);
        const formData = {
          firstName: firstName.trim(),
          middleName: middleName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          location: location.trim(),
          roles: roles?.map((role) => role.value),
        };
        const res = await axiosInstance.post("/staff", formData);
        const { status, payload } = res.data;

        if (status) {
          await fetchStaff(); // refresh staff list

          // Reset form
          setFirstName("");
          setMiddleName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setLocation("");
          setRoles([]);

          closeModal();

          withReactContent(Swal).fire({
            icon: "success",
            showConfirmButton: false,
            timer: 700,
          });
        } else {
          withReactContent(Swal).fire({
            icon: "error",
            text: payload || "Failed to add user",
            showConfirmButton: true,
          });
        }
      } catch (error) {
        console.error(error);
        withReactContent(Swal).fire({
          icon: "error",
          text: "Network error, please try again.",
          showConfirmButton: true,
        });
      } finally {
        setPosting(false);
      }
    } else {
      withReactContent(Swal).fire({
        icon: "warning",
        text: "First Name, Last Name and Email are required.",
        showConfirmButton: true,
      });
    }
  };

  // Filter staff by search term
  const filteredStaff = staff.filter((user) => {
    const fullName = `${user.first_name} ${user.middle_name ?? ""} ${user.last_name}`.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    return (
      fullName.includes(lowerSearch) ||
      (user.email && user.email.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <div className="w-full bg-white rounded-md shadow pr-5">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-secondary font-semibold text-2xl mt-5 ml-3">User</h1>

        <div className="w-4/12">
          <InputField
            type="text"
            placeholder="Search For Users, email"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<BsSearch className="w-3 -ml-7 mt-3 cursor-pointer" />}
          />
        </div>

        <div className="mt-5 cursor-pointer" onClick={openModal}>
          <Button2 value={"Add User"} />
        </div>
      </div>

      {modal && (
        <div className="z-50 bg-black/50 h-full w-full top-0 right-0 left-0 absolute flex">
          <div className="w-3/12" onClick={closeModal} />

          <div className="w-6/12">
            <div className="rounded-lg bg-white mt-[10vh]">
              <div className="flex text-xl justify-between font-semibold text-primary p-2 bg-gray1">
                <p>Add User</p>
                <p onClick={closeModal} className="cursor-pointer">
                  X
                </p>
              </div>

              <div className="flex flex-wrap">
                <div className="w-1/2 p-2">
                  <InputField
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    label="First Name"
                    placeholder="Enter First Name"
                  />
                  <InputField
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    label="Middle Name"
                    placeholder="Enter Middle Name"
                  />
                </div>

                <div className="w-1/2 p-2">
                  <InputField
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    label="Last Name"
                    placeholder="Last Name"
                  />
                  <InputField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    placeholder="Enter Email"
                  />
                </div>

                <div className="w-full p-2">
                  <p className="text-sm text-gray5">Select Roles</p>
                  <Select
                    options={[
                      { value: "admin", label: "Admin" },
                      { value: "stock", label: "Stock" },
                      { value: "reports", label: "Reports" },
                      { value: "sales", label: "Sales" },
                    ]}
                    placeholder="Select Role"
                    isMulti
                    onChange={(e) => setRoles(e)}
                    value={roles}
                  />
                </div>
              </div>

              <div className="flex justify-between p-2 bg-gray1">
                <div onClick={closeModal}>
                  <ButtonSecondary value={"Close"} />
                </div>
                <div className="w-32">
                  {posting ? (
                    <ButtonLoader />
                  ) : (
                    <div onClick={postUser}>
                      <Button value={"Add User"} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-1/4" onClick={closeModal} />
          </div>

          <div className="w-3/12" onClick={closeModal} />
        </div>
      )}

      <UserTable staff={filteredStaff} />
    </div>
  );
};

export default Users;
