import React, { useState } from "react";
import "../../assets/styles/main.css";
import { MdDeleteOutline } from "react-icons/md";
import { BsPencilSquare, BsEye } from "react-icons/bs";
import EditUser from "./EditUser";
import ShowUser from "./ShowUser";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axiosInstance from "../../axios-instance";
import Loader from "../Loader";
import { useDispatch } from "react-redux";
import { getStaff } from "../../store/slices/store";

function UserTable({ staff }) {
  const [editData, setEditData] = useState(false);
  const [showData, setShowData] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const dispatch = useDispatch();


  const closeEditData = () => setEditData(false);
  const closeShowData = () => setShowData(false);

  const openEditData = (user) => {
    setUserData(user);
    setEditData(true);
  };

  const openShowData = (user) => {
    setUserData(user);
    setShowData(true);
  };

  const deleteUser = (user) => {
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
          setLoadingDelete(true);
          const response = await axiosInstance.delete(`/staff/${user.id}`);
          if (response.data.status) {
            // Refresh staff list from Redux store
            dispatch(getStaff());
            withReactContent(Swal).fire({
              icon: "success",
              showConfirmButton: false,
              timer: 500,
            });
          }
        } catch (error) {
          console.error(error);
          withReactContent(Swal).fire({
            icon: "error",
            title: "Delete failed",
            text: "An error occurred while deleting user.",
          });
        } finally {
          setLoadingDelete(false);
        }
      }
    });
  };

  return (
    <>
      {/* Edit popup */}
      {editData && <EditUser closeEditData={closeEditData} userData={userData} />}

      {/* Show user popup */}
      {showData && <ShowUser closeShowData={closeShowData} userData={userData} />}

      <div className="h-[calc(100vh-165px)] overflow-y-auto">
        <table className="mt-4 w-[98%] table-auto ml-5">
          <thead style={{ backgroundColor: "#f9f9f9" }}>
            <tr>
              <th className="p-2 text-primary text-sm text-left">Full Name</th>
              <th className="p-2 text-primary text-sm text-left">Email</th>
              <th className="p-2 text-primary text-sm text-left">Roles</th>
              <th className="p-2 text-primary text-sm text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {staff && staff.length > 0 ? (
              staff.map((user) => (
                <tr
                  className="shadow-sm border-b border-gray1 cursor-pointer hover:shadow-md"
                  key={user.id}
                >
                  <td className="flex items-center">
                    <div className="rounded-full h-8 w-8 flex items-center justify-center text-sm font-semibold text-primary bg-primary3 mr-2">
                      {user.first_name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <p className="text-sm text-gray5">
                      {user.first_name} {user.middle_name ?? ""} {user.last_name}
                    </p>
                  </td>

                  <td className="text-xs p-3 text-gray5">{user.email}</td>

                  <td className="text-xs p-3 text-gray5">
                    {user.roles?.map((role, idx) => (
                      <span
                        key={idx}
                        className="bg-gray3 text-gray5 rounded-md px-2 py-1 mr-2"
                      >
                        {role}
                      </span>
                    ))}
                  </td>

                  <td className="text-xs p-3 w-28 text-gray5 flex justify-between">
                    <MdDeleteOutline
                      onClick={() => deleteUser(user)}
                      className={`text-red w-5 h-5 cursor-pointer ${
                        loadingDelete ? "opacity-50 pointer-events-none" : ""
                      }`}
                      title="Delete User"
                    />
                    <BsPencilSquare
                      onClick={() => openEditData(user)}
                      className="text-warning w-5 h-5 cursor-pointer"
                      title="Edit User"
                    />
                    <BsEye
                      onClick={() => openShowData(user)}
                      className="text-primary w-5 h-5 cursor-pointer"
                      title="View User"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-500 p-4"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loadingDelete && (
          <div className="flex justify-center items-center h-52">
            <Loader />
          </div>
        )}
      </div>
    </>
  );
}

export default UserTable;
