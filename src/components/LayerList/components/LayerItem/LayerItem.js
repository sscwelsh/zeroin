import React, { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import "./LayerItem.css";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import Slider from '@mui/material/Slider';
import Typography from "@mui/material/Typography";

function LayerItem(props) {
	const [isOn, setIsOn] = useState(props.isVisible);
	const [anchorEl, setAnchorEl] = useState(null);
	const [isToggleOpen, setIsToggleOpen] = useState(false);
	const [popupEnabled, setPopupEnabled] = useState(props.popup);
	const [opacityValue, setOpacityValue] = useState(props.opacity);
	const open = Boolean(anchorEl);
	const handleMenuOpenClick = (event) =>{
		setAnchorEl(event.currentTarget);
	}
	const handleClose = () => {
		setAnchorEl(null);
	}
	const toggle = () => {
		setIsOn(!isOn);
		props.onLayerVisibilityToggle(props.layer, props.title);
	}
	const toggleSlider = () => {
		setIsToggleOpen(!isToggleOpen);
	}
	const zoomTo = () =>{
		props.onZoomTo(props.layer);
	}

	const togglePopup = () =>{
		setPopupEnabled(!popupEnabled);
		props.onPopToggle(props.layer);
	}
	const handleSliderChangeMouseUp = (event, value) => {
		props.onOpacityChange(props.layer, Number(value) / 100);
  }

	const handleSliderChange = (event) => {
    setOpacityValue(event.target.value === '' ? 0 : Number(event.target.value) / 100);
  }

	const marks = [{
		value:0,
		label:"0%"
	},{
		value: 100,
		label: "100%"
	}];
	const valueText = (value) =>{
		return `${value}%`;
	}
	useEffect(() => {
		setIsOn(props.isVisible);
	}, [props]);

	return (
		<div className="LayerItem">
			<Switch checked={isOn} onChange={toggle}></Switch>
			{props.title}
			<div className="LayerItemMenu">
			<Button
					id="basic-button"
					aria-controls={open ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={handleMenuOpenClick}
				>
				<SettingsIcon />
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
					sx: {padding: '10px'}
				}}
				PaperProps={{sx: {width: '250px'}}}
			>
				<MenuItem onClick={zoomTo}>Zoom To</MenuItem>
				<MenuItem onClick={toggleSlider}><Typography gutterBottom>Transparency</Typography></MenuItem>
				{
					isToggleOpen ? <MenuItem><Slider key={props.id}
						aria-label="Transparency"
						value={Math.ceil(opacityValue * 100)}
						onChangeCommitted={handleSliderChangeMouseUp}
						onChange={handleSliderChange}
						getAriaValueText={valueText}
						valueLabelDisplay="auto"
						step={1}
						marks={marks}
						min={0}
						max={100}
					/></MenuItem> : null
				}
				<MenuItem onClick={togglePopup}>{ `${popupEnabled ? "Disable" : "Enable" } Popup` } </MenuItem>
				{props.type === 'feature' ? <MenuItem >Show Attribute Table</MenuItem> : null}
			</Menu>

			</div>
		</div>
	);
}

export default LayerItem;
