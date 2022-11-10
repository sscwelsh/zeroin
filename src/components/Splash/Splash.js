import React, { useState } from "react";
import "./Splash.css";
import logo from "../../assets/splash.png";
import Button from "@mui/material/Button";

function Splash(props) {
	const [isOpened, setIsOpened] = useState(true);

	const toggle = () => {
		setIsOpened(!isOpened);
	};

	return (
		<div className={`Splash Is${isOpened ? "Opened" : "Closed"}`}>
			<div className="InnerWrapper">
				<div className="InnerContainer">
					<span className="ImageCenter"></span>
					<img src={logo} alt="logo"></img>
					{props.children}
					<div className="SplashFooter">
						<Button variant="outlined" onClick={toggle}>
							Close
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Splash;
