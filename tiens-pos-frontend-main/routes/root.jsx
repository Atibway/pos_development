import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/navbar";

export default function Root() {
	return (
		<>
			<div id="detail">
				<div className="flex w-full h-screen overflow-hidden bg-gray2">
					<div className="w-[100px]">
						<Sidebar />
					</div>
					<div className="w-full">
						<Navbar />
						<div className="m-2">
							<Outlet />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
