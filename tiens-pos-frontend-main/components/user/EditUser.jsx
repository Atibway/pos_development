import React, { useEffect, useState } from "react";
import "../../assets/styles/main.css";
import InputField from "../InputField";
import Button from "../Button";
import ButtonSecondary from "../ButtonSecondary";
import axiosInstance from "../../axios-instance";
import ButtonLoader from "../ButtonLoader";
import Select from "react-select";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { getStaff } from "../../store/slices/store";

function EditUser({ userData, closeEditData }) {
  const dispatch = useDispatch();
  const [posting, setPosting] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState(userData.first_name || "");
  const [middleName, setMiddleName] = useState(userData.middle_name || "");
  const [lastName, setLastName] = useState(userData.last_name || "");
  const [email, setEmail] = useState(userData.email || "");
  const [phone, setPhone] = useState(userData.phone || "");
  const [location, setLocation] = useState(userData.location || "");
  const [roles, setRoles] = useState([]);

  // Optional isRemove (if needed by backend)
  const [isRemove, setIsRemove] = useState(false);

  useEffect(() => {
    if (userData.roles) {
      const rolesArray = userData.roles.map((role) => ({
        value: role,
        label: role.charAt(0).toUpperCase() + role.slice(1),
      }));
      setRoles(rolesArray);
    }
  }, [userData]);

  const updateUser = async () => {
    if (firstName.trim() && lastName.trim() && email.trim() && roles.length > 0) {
      try {
        setPosting(true);

        const userId = userData.id;

        // For debugging: confirm values are present
        console.log(
          firstName,
          lastName,
          email,
          middleName,
          userId,
          roles.map((r) => r.value),
          isRemove
        );

        const formData = {
          userId, // sending as userId explicitly
          firstName: firstName.trim(),
          middleName: middleName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          location: location.trim(),
          roles: roles.map((role) => role.value),
          isRemove,
        };

        const res = await axiosInstance.put("/staff", formData);
        const { status, payload } = res.data;

        if (status) {
          dispatch(getStaff());
          setPosting(false);
          closeEditData();
          Swal.fire({
            title: "Success",
            text: "User Updated Successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          setPosting(false);
          Swal.fire({
            title: "Error",
            text: payload,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        setPosting(false);
        Swal.fire({
          title: "Error",
          text: "Failed to update user. Please try again.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "Please fill all the required fields",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="flex absolute w-full h-full top-0 right-0 left-0 bg-black/50 z-50">
      <div className="w-3/12" onClick={closeEditData} />

      <div className="w-6/12">
        <div className="bg-white rounded-md mt-[3vh]">
          <div className="flex justify-between p-3 bg-gray1">
            <p className="text-primary font-semibold">Edit User</p>
            <p onClick={closeEditData} className="cursor-pointer">
              X
            </p>
          </div>

          <div className="flex flex-col gap-6 p-3">
            {/* First row: First Name & Middle Name */}
            <div className="flex gap-6 w-full min-w-[500px]">
              <InputField
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                label="First Name"
                placeholder="Enter First Name"
                required
                className="flex-grow"
              />
              <InputField
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                label="Middle Name"
                placeholder="Enter Middle Name"
                className="flex-grow"
              />
            </div>

            {/* Second row: Last Name & Email */}
            <div className="flex gap-6 w-full min-w-[500px]">
              <InputField
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                label="Last Name"
                placeholder="Enter Last Name"
                required
                className="flex-grow"
              />
              <InputField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                placeholder="Enter Email"
                required
                type="email"
                className="flex-grow"
              />
            </div>

            {/* Roles dropdown full width */}
            <div className="w-full p-2">
              <p className="text-sm text-gray5 mb-1">Select Roles *</p>
              <Select
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "stock", label: "Stock" },
                  { value: "reports", label: "Reports" },
                  { value: "sales", label: "Sales" },
                ]}
                placeholder="Select Role(s)"
                isMulti
                onChange={(selected) => setRoles(selected)}
                value={roles}
              />
            </div>
          </div>

          <div className="flex justify-between p-3 bg-gray1">
            <div onClick={closeEditData}>
              <ButtonSecondary value={"Close"} />
            </div>
            <div className="w-26">
              {posting ? (
                <ButtonLoader />
              ) : (
                <div onClick={updateUser}>
                  <Button value={"Update User"} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-3/12" onClick={closeEditData} />
    </div>
  );
}

export default EditUser;
