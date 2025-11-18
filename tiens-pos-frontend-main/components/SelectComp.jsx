import React, { useState } from "react";
import { BsChevronDown } from "react-icons/bs";

function SelectComp({ label, placeholder, options, setSelectedOptionObj }) {
	const [selectedOption, setSelectedOption] = useState("");
	const [selectedValue, setSelectedValue] = useState("");

	const selectOption = (option) => {
		setSelectedOption(option.type);
		setSelectedValue(option);
		setSelectedOptionObj(option);
	};

	const [show, setShow] = useState(false);

	const openShow = () => {
		setShow(true);
	};

	const closeShow = () => {
		setTimeout(() => {
			setShow(false);
		}, 200);
	};

	return (
		<>
			<div className="mt-5">
				<label className="text-gray4">{label}</label>
				<div className="w-full bg-gray1 rounded-md mt-2 flex justify-between">
					<input
						type="search"
						value={selectedOption}
						placeholder={placeholder}
						onFocus={openShow}
						onBlur={closeShow}
						className="bg-gray1 cursor-pointer rounded-md w-[250px] text-sm p-3"
					/>
					<BsChevronDown className=" mt-3 mr-3" onClick={openShow} />
				</div>
				{show ? (
					<div className="w-[250px] absolute bg-white z-30 shadow-md border border-gray2 h-32 overflow-y-auto rounded-md mt-2">
						{options.map((option) => {
							return (
								<div
									onClick={() => selectOption(option)}
									className="cursor-pointer hover:bg-gray1 p-2 text-gray5 text-sm"
								>
									{option.type}
								</div>
							);
						})}
					</div>
				) : null}
			</div>
		</>
	);
}

export default SelectComp;
