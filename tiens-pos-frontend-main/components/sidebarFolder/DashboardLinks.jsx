import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TbLayoutDashboard } from "react-icons/tb";
import "../../assets/styles/sidebar.css"

function DashboardLinks({ name, link, Icon }) {
	const location = useLocation();


	return (
		<>
			<Link
				to={link}
				className={
					location.pathname === link
						? `  rounded-md p-2 cursor-pointer  ${link === "/dashboard" ? "-mt-4" : ""}`
						: ` p-2 cursor-pointer ${link === "/dashboard" ? "-mt-4" : ""}`
				}
			>
				<center>
					{/* <div className="text-white bg-primary p-2 -mt-2 rounded w-14"> */}
					<div className={
						location.pathname === link
							? "text-white bg-primary p-2 -mt-2 rounded mx-2" : "text-white "
					}>
						<Icon
							className="text-center"
						/>
						<p className="text-xs text-center text-white">{name}</p>

					</div>
				</center>

			</Link>
		</>
	);
}

export default DashboardLinks;
