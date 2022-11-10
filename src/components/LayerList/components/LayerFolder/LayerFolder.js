import React, { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "./LayerFolder.css";

function LayerFolder(props) {
	const [isOpened, setIsOpened] = useState(props.isOpen);
	const toggle = () => {
		props.onToggle(props.id, !isOpened);
		setIsOpened(!isOpened);
	};
	useEffect(() => {
		setIsOpened(props.isOpen);
	},[props]);
	return (
		<div className="LayerFolder">
			<div className="FolderHeader">
				<div onClick={toggle} className="FolderHeaderToggle">
					{isOpened ? (
						<KeyboardArrowUpIcon></KeyboardArrowUpIcon>
					) : (
						<KeyboardArrowDownIcon></KeyboardArrowDownIcon>
					)}
				</div>
				<div>{props.title}</div>
			</div>
			<div
				className={`LayerFolderIs${
					isOpened ? "Opened" : "Closed"
				} LayerFolderContents`}
			>
				{props.children}
			</div>
		</div>
	);
}

export default LayerFolder;
