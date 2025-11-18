import React, { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaBriefcase } from "react-icons/fa";
import "../../assets/styles/login.css";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import axiosInstance from "../../axios-instance";
import ButtonLoader from "../../components/ButtonLoader";
import { Link } from "react-router-dom";

const Email = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
	});

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const [posting, setPosting] = useState(false);
	const [errorMessage, setError] = useState("");
	const requestPasswordReset = async () => {
		try {
			setPosting(true);
			const response = await axiosInstance.post(
				"/auth/reset-password-request",
				formData
			);
			const { data } = response;
			const { status, payload } = data;
			if (status) {
				const { token } = payload;
				setPosting(false);
				if (token) {
					navigate("/code");
				}
			} else {
				setError(payload);
				setPosting(false);
			}
		} catch (error) {
			console.log(error);
			setPosting(false);
		}
		setPosting(false);
	};

	return (
		<div className="flex overflow-hidden h-screen justify-center w-full bg-gray2">
			

			<div className="w-5/12 p-2 flex justify-center items-center">
				<div className="bg-white rounded-md shadow-lg p-10 w-[500px]">
					<div className="flex justify-center">
						<FaBriefcase className="text-primary text-3xl mt-2" />
						<h1 className="font-bold text-4xl mt-1 text-primary ml-2">
							School SoftOffice
						</h1>
					</div>
					<p className="text-center text-primary mt-2">Enter Email</p>
					<p className="text-center text-red text-sm mt-2">{errorMessage}</p>
					<InputField
						type="email"
						placeholder="Enter Your email"
						label="Email"
						name="email"
						icon={<MdAlternateEmail className="w-10 mt-3" />}
						onChange={onChange}
					/>
					<div className="flex justify-between my-2">
						<div></div>
						<div>
							<Link to="/" className="text-secondary">
								Back to login
							</Link>
						</div>
					</div>
					{posting ? (
						<div>
							<ButtonLoader />
						</div>
					) : (
						<div onClick={requestPasswordReset}>
							<Button value={"Reset Password"} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Email;
