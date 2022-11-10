import React, { useState, useEffect, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "./HorizontalTray.css";

function HorizontalTray(props) {
	const toggle = () => {
		props.onOpen(!props.isOpened);
	};
	const drawerRef = useRef(null);
	const [isResizing, setIsResizing] = useState(false);

	const startResizing = useCallback((mouseDownEvent) => {
		setIsResizing(true);
	}, []);

	const stopResizing = useCallback(() => {
		setIsResizing(false);
	}, []);

	const resize = useCallback(
		(mouseMoveEvent) => {
			if (isResizing) {
				if (props.anchor === "Top") {
					props.onResize(mouseMoveEvent.clientY);
				} else {
					props.onResize(
						drawerRef.current.getBoundingClientRect().bottom -
							mouseMoveEvent.clientY
					);
				}
			}
		},
		[isResizing]
	);

	useEffect(() => {
		window.addEventListener("mousemove", resize);
		window.addEventListener("mouseup", stopResizing);
		return () => {
			window.removeEventListener("mousemove", resize);
			window.removeEventListener("mouseup", stopResizing);
		};
	}, [resize, stopResizing]);
	let icon;

	if (
		(props.anchor === "Top" && !props.isOpened) ||
		(props.anchor === "Bottom" && props.isOpened)
	) {
		icon = <KeyboardArrowDownIcon></KeyboardArrowDownIcon>;
	} else {
		icon = <KeyboardArrowUpIcon></KeyboardArrowUpIcon>;
	}
	const leftOpen = {
		left: `${props.verticalTrayWidth}px`,
		height: `${props.horizonTalTrayHeight}px`,
	};
	const leftClosed = {
		left: "0",
		height: `${props.horizonTalTrayHeight}px`,
	};
	const rightOpen = {
		right: `${props.verticalTrayWidth}px`,
		height: `${props.horizonTalTrayHeight}px`,
	};
	const rightClosed = {
		right: "0",
		height: `${props.horizonTalTrayHeight}px`,
	};

	let style;
	if (props.verticalTrayIsOpened) {
		if (props.verticalTrayAnchor === "Left") {
			style = leftOpen;
		} else {
			style = rightOpen;
		}
	} else {
		if (props.verticalTrayAnchor === "Left") {
			style = leftClosed;
		} else {
			style = rightClosed;
		}
	}

	return (
		<div
			ref={drawerRef}
			onMouseDown={(e) => e.preventDefault()}
			className={`HorizontalTray Panel Anchor${
				props.anchor
			} VerticalAnchor${props.verticalTrayAnchor} Is${
				props.isOpened ? "Opened" : "Closed"
			} IsVerticalTray${
				props.verticalTrayIsOpened ? "Opened" : "Closed"
			}`}
			style={style}
		>
			<div className="Container">
				<div className="WidgetFrame">{props.children}</div>
			</div>
			<Box className="Toggle">
				<div onClick={toggle}>{icon}</div>
			</Box>
			<div className="DragHandle" onMouseDown={startResizing}>
				<span>---</span>
			</div>
		</div>
	);
}

export default HorizontalTray;
