// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { MdLockOutline, MdAlternateEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { FaBriefcase, FaBullseye, FaEye, FaEyeSlash } from "react-icons/fa";
import "../assets/styles/login.css";
import Button from "../components/Button";
import InputField from "../components/InputField";
import axiosInstance from "../axios-instance";
import ButtonLoader from "../components/ButtonLoader";
import { useFeedback } from "../hooks/feedback";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [loginError, setLoginError] = useState("");
  const [isLoging, setIsLoging] = useState(false);
  const [token, setToken] = useState("");
  const { toggleFeedback } = useFeedback();
  const [activating, setActivating] = useState(false);
  const [inputType, setInputType] = useState("password");

  const changeToText = () => {
    setInputType("text");
  };
  const changeToPassword = () => {
    setInputType("password");
  };
  const expireDate = false;

  const handleLogin = async () => {
    setIsLoging(true);
    try {
      setIsLoging(true);
      const response = await axiosInstance.post("/auth/login", formData);
      const { data } = response;
      const { status, payload } = data;
      const { token, user } = payload;
      if (status) {
        localStorage.setItem("schoolSoftToken", token);
        localStorage.setItem("schoolSoftUser", JSON.stringify(user));
        setIsLoging(false);
        navigate("/dashboard");
      } else {
        setIsLoging(false);
        setLoginError(payload);
        console.log("error", payload);
      }
    } catch (error) {
      console.log(error);
      setIsLoging(false);
    }
  };

  return (
    <>
      <div className="flex overflow-hidden h-screen w-full">
        <div className="w-7/12">
          <img
            src="bac.jpg"
            className="h-full w-full m-3 object-cover rounded-xl"
          />
        </div>

        <div className="w-5/12 p-2 flex justify-center items-center">
          <div className="bg-white p-10 w-[400px]">
            <div className="flex gap-2">
              <img src="logo.ico" className="w-12" />
              <p className="text-3xl font-bold">Tiens Uganda</p>
            </div>

            <p className="text-red m-2 text-center">{loginError}</p>
            <InputField
              type="email"
              placeholder="Enter Your email"
              label="Email"
              name="email"
              icon={<MdAlternateEmail className="w-10 mt-3" />}
              onChange={onChange}
            />
            <InputField
              type={inputType}
              placeholder="Enter Your password"
              label="Password"
              name="password"
              icon={
                <>
                  {inputType === "password" ? (
                    <FaEye onClick={changeToText} className="w-10 mt-3" />
                  ) : (
                    <FaEyeSlash
                      onClick={changeToPassword}
                      className="w-10 mt-3"
                    />
                  )}
                </>
              }
              onChange={onChange}
            />
            <div className="flex justify-between my-2">
              <div className="flex">
                <input type="radio" />
                <p className="text-gray5 text-sm">Recustomers Me</p>
              </div>
              <div>
                <Link to="/email">
                  <p className="text-secondary font-semibold text-sm">
                    Forgot Password?
                  </p>
                </Link>
              </div>
            </div>
            <div>
              {isLoging ? (
                <ButtonLoader />
              ) : (
                <div onClick={handleLogin}>
                  {" "}
                  <Button value={"Login"} />{" "}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
