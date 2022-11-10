import React from "react";
import "./VerticalTray.css";
import Box from "@mui/material/Box";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function VerticalTray(props) {
	const toggle = () => {
		props.onOpen(!props.isOpened);
	};
	let icon;

	if (
		(props.anchor === "Left" && !props.isOpened) ||
		(props.anchor === "Right" && props.isOpened)
	) {
		icon = <KeyboardArrowRightIcon></KeyboardArrowRightIcon>;
	} else {
		icon = <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>;
	}

	const leftAnchorStyle = {
		inset: `0px auto 0px -${props.verticalTrayWidth}px`,
		width: `${props.verticalTrayWidth}px`,
	};
	const rightAnchorStyle = {
		inset: `inset: 0px -${props.verticalTrayWidth}px 0px auto`,
		width: `${props.verticalTrayWidth}px`,
	};

	return (
		<div
			className={`VerticalTray Panel Anchor${props.anchor} Is${
				props.isOpened ? "Opened" : "Closed"
			}`}
			style={props.anchor === "Left" ? leftAnchorStyle : rightAnchorStyle}
		>
			<div className="Container">
				<div className="WidgetFrame">{props.children}</div>
			</div>
			<Box className="Toggle">
				<div onClick={toggle}>{icon}</div>
			</Box>
		</div>
	);
}

export default VerticalTray;
