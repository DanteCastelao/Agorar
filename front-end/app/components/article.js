import React, { useEffect, useId } from "react";
import { motion } from "framer-motion";

function Article({ title, description, status }) {
	// Define styles based on the status
	const borderColors = {
		"En discusión": "#838383",
		Vigente: "#74ACDF",
		"No Vigente": "#DF7474",
		Modificada: "#838383",
		// Add more status-color mappings as needed
	};

	const textColors = {
		"En discusión": "#838383",
		Vigente: "#74ACDF",
		"No Vigente": "#DF7474",
		Modificada: "#838383",
		// Add more status-color mappings as needed
	};

	// Retrieve border color and text color based on the status
	const borderColor = borderColors[status] || "#DF7474";
	const textColor = textColors[status] || "#DF7474";

	// Calculate title font size based on description presence
	const titleClamp = description ? "3" : "5";

	const [modalOpen, setModalOpen] = React.useState(false);

	const layoutId = useId();

	return (
		<>
			<div
				className={`${
					modalOpen ? "fixed inset-0 bg-black bg-opacity-50 grid place-items-center" : ""
				}`}
				onClick={modalOpen && (() => setModalOpen(false))}
			>
				<motion.div
					className={`flex flex-col bg-white p-[1.4rem] gap-4 border-[2px] rounded-[5px] ${
						modalOpen ? "" : "cursor-pointer"
					}`}
					style={{ borderColor: borderColor, height: "30vh" }}
					onClick={(e) => {
						e.stopPropagation();
						setModalOpen(true);
					}}
					animate={{ width: modalOpen ? "min(42rem,80vw)" : "auto" }}
					layoutId={layoutId}
				>
					<span
						className={`font-bold text-[1.35rem] ${modalOpen ? "" : "line-clamp-2"}`}
						style={{ color: textColor }}
					>
						{title}
					</span>
					{description && (
						<span className="font-medium text-[#38485C] text-[0.95rem] overflow-hidden">
							<span className={`${modalOpen ? "" : "line-clamp-2 md:line-clamp-6"}`}>
								{description}
							</span>
						</span>
					)}
					{/* <span className="font-medium text-[#38485C] text-[0.95rem] underline">Leer más</span> */}
				</motion.div>
			</div>
		</>
	);
}

export default Article;
