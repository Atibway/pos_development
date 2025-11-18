import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios-instance";

const Navbar = () => {
	const navigate = useNavigate();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [log, setLog] = useState(false);
	const toggleLog = () => {
		setLog(!log);
	};
	
	const handleLogout = async () => {
		try {
			const response = await axiosInstance.get("/auth/logout");
			const { data } = response;
			const { status } = data;
			if (status) {
				localStorage.clear();
				navigate("/");
			}
		} catch (error) {
			console.log(error);
		}
	};



	useEffect(() => {
		const token = localStorage.getItem("schoolSoftToken");
		const loggedInUser = JSON.parse(localStorage.getItem("schoolSoftUser"));
		if (token === null || token === undefined) {
			return navigate("/");
		} else if (loggedInUser === null || loggedInUser === undefined) {
			return navigate("/");
		} else {
			const { first_name, last_name, email } = loggedInUser;
			setFirstName(first_name);
			setLastName(last_name);
			setEmail(email);
		}
	}, [navigate]);

	const [userLoggedOut, setUserLoggedOut] = useState(false);

	const idleTime = useRef(0);

	const resetIdleTime = () => {
		idleTime.current = 0;
	};

	useEffect(() => {
		let idleTimer;

		// Define the idle time threshold in milliseconds (e.g., 2 minutes)
		const idleTimeThreshold = 30 * 60 * 1000; // 2 minutes

		const onUserActivity = () => {
			resetIdleTime();
			clearTimeout(idleTimer);

			if (userLoggedOut) {
				setUserLoggedOut(false);
			}

			idleTimer = setTimeout(() => {
				// User has been idle for idleTimeThreshold milliseconds
				setUserLoggedOut(true);
			}, idleTimeThreshold);
		};

		// Attach event listeners to monitor user activity
		window.addEventListener("mousemove", onUserActivity);
		window.addEventListener("keydown", onUserActivity);

		// Cleanup event listeners when the component unmounts
		return () => {
			window.removeEventListener("mousemove", onUserActivity);
			window.removeEventListener("keydown", onUserActivity);
			clearTimeout(idleTimer);
		};
	}, [userLoggedOut]);

	useEffect(() => {
		// Implement the logout logic here when userLoggedOut is true
		if (userLoggedOut) {
			//logout by calling logout
			handleLogout();
		}
	}, [userLoggedOut]);


	return (
		<>

			<div className="p-2 h-16 bg-white border border-gray1 flex justify-between">
				<div>
					<img src="logo.ico" className="w-12"/>
				</div>
				<div className="flex">
					<div>
						<div>

						</div>
					</div>
					<div className="flex ml-10 mt-1 w-52" onClick={toggleLog}>
					<div className="pt-3 h-10 w-10 rounded-full bg-secondary cursor-pointer text-center text-white text-xs ml-2">
							{firstName[0]?.toUpperCase() + " " + lastName[0]?.toUpperCase()}
						</div>
						<div className="ml-2 relative cursor-pointer">
							<p className="font-bold">{firstName + " " + lastName}</p>
							<p className="text-xs -mt-1">{email}</p>
						</div>

						{log ? (
							<div
								className="absolute bg-white shadow-lg border border-gray2 p-3 mt-10 w-52 flex justify-center"
								onClick={handleLogout}
							>
								<span className="font-bold text-md text-primary cursor-pointer">
									Logout
								</span>
							</div>
						) : null}
						

					</div>


				</div>
			</div>

		</>
	);
};

export default Navbar;
