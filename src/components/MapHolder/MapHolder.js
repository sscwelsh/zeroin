import React, { useEffect, useRef, useState } from "react";
import "./MapHolder.css";
import MapView from "@arcgis/core/views/MapView";
import Home from "@arcgis/core/widgets/Home";
import Search from "@arcgis/core/widgets/Search";
import Locate from "@arcgis/core/widgets/Locate";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import Box from '@mui/material/Box';
import Legend from "@arcgis/core/widgets/Legend";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import DraggableWidget from "../DraggableWidget/DraggableWidget";
import Swipe from "@arcgis/core/widgets/Swipe";
import InsightsIcon from '@mui/icons-material/Insights';
import PrintIcon from '@mui/icons-material/Print';
import DevicesFoldIcon from '@mui/icons-material/DevicesFold';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import BorderOuterIcon from '@mui/icons-material/BorderOuter';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Measurement from "@arcgis/core/widgets/Measurement";
import Button from '@mui/material/Button';
import StraightenIcon from '@mui/icons-material/Straighten';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Print from "@arcgis/core/widgets/Print";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { CheckBox, HorizontalRule } from "@mui/icons-material";

function MapHolder(props) {
	const mapDiv = useRef(null);
	const [viewObj, setViewObj] = useState(null);
	const [measureWidget, setMeasureWidget] = useState(null);
	const [activeMeasureTool, setActiveMeasureTool] = useState(null);
	
	
	const [widgetLauncherState, setWidgetLauncherState] = useState([])
	const toggleOpen = (id) => {
		updateWidgetLauncherState(id);
	}
	const toggleBaseMapGallery = () => {
		updateWidgetLauncherState("BaseMapGallery");		
	}
	const toggleLegend = () => {
		updateWidgetLauncherState("Legend");
	}
	const toggleSelect = () => {
		updateWidgetLauncherState("Select");
	}
	const toggleErdmanInsight = () =>{
		updateWidgetLauncherState("ErdmanInsight");
	}
	const toggleFilter = () =>{
		updateWidgetLauncherState("Filter");
	}
	const toggleMeasure = () =>{
		updateWidgetLauncherState("Measure");
	}
	const togglePrint = () =>{
		updateWidgetLauncherState("Print");
	}
	const toggleSwipe = () =>{
		updateWidgetLauncherState("Swipe");
	}
	const updateWidgetLauncherState = (id) =>{
		if(widgetLauncherState.indexOf(id) >= 0){
			widgetLauncherState.splice(widgetLauncherState.indexOf(id), 1); 
		}else{
			widgetLauncherState.push(id)
		}
		setWidgetLauncherState([...widgetLauncherState]);
	}
	const onAreaClickHandler = () =>{
		measureWidget.activeTool = "area";
		setActiveMeasureTool("Area");
	}
	const onDistanceClickHandler = () =>{
		measureWidget.activeTool = viewObj?.type?.toUpperCase() === "2D" ? "distance" : "direct-line";
		setActiveMeasureTool("Distance");
	}
	const onClearClickHandler = () =>{
		measureWidget.clear();
		setActiveMeasureTool(null);
	}

	const handleToggle = (layerId) => {

	}

	const onSelectClickHandler = () => {
		props?.webMap?.add(new GraphicsLayer())
	}

	
	useEffect(() => {
		if (mapDiv.current && props.webMap && props.extent) {			
			const view = new MapView({
				container: "map",
				map: props.webMap,
				extent: props.extent,
			});
			setViewObj(view);
			reactiveUtils.when(() => view.stationary === true, () =>{
				if(view.extent){
					props.onExtentChange(view.extent);
				}
			});
			const home = new Home({
				view: view,
			});
			const search = new Search({
				view: view,
				container:
					document.getElementsByClassName("SearchContainer")[0],
			});
			const locate = new Locate({
				view: view,
				graphic: new Graphic({
					symbol: { type: "simple-marker" },
				}),
			});
			const scale = new ScaleBar({
				view: view,
				style: "ruler",
			});
			const coords = new CoordinateConversion({
				view: view,
			});
			const baseMapGallery = new BasemapGallery({
				view: view,
				container: document.getElementById("BaseMapGallery"),
			})	
			const legend = new Legend({
				view: view,
				container: document.getElementById("Legend"),
			})
			setMeasureWidget(new Measurement({
				view: view,
				container: document.getElementById("Measure"),
			}))

			const print = new Print({
				view: view,
				container: document.getElementById("Print"),
			})
			const swipe = new Swipe({
				view: view,
			})
			coords.visibleElements = {
				settingsButton: false,
				captureButton: true,
				expandButton: false,
			};
			view.ui.move(["zoom"], "top-right");
			view.ui.add([home, locate], "top-right");
			view.ui.add([scale, coords], "bottom-left");
			view.ui.add(search);
			view.ui.add("WidgetBar")
			// view.ui.add("BaseMapGalleryWidgetContainer");
			// view.ui.add("WidgetBar");
			
		}
	}, [props.webMap]);

	useEffect(() => {
		if (mapDiv.current && props.webMap){
			let layer = props.webMap.findLayerById(props.zoomTo)
			viewObj.extent = layer?.fullExtent;
		}		
	},[props.zoomTo])

	
	
	let mapRect = document.getElementById("map")?.getBoundingClientRect();
	let bounds = {};
	if(mapRect){
		bounds = {top: mapRect.top, bottom: mapRect.bottom, left: mapRect.left, right: mapRect.right};
	}

	const leftOpenBottomOpen = {
		inset: `0px 0px ${props.horizonTalTrayHeight}px ${props.verticalTrayWidth}px`,
	};
	const boundsLeftOpenBottomOpen = {
		right: bounds.right - (props.verticalTrayWidth * 2),
		top: bounds.top + (props.horizonTalTrayHeight * 2),
		...bounds
	}

	const leftOpenBottomClosed = {
		inset: `0px 0px 0px ${props.verticalTrayWidth}px`,
	};
	const boundsLeftOpenBottomClosed = {
		right: bounds.right - (props.verticalTrayWidth * 2),
		...bounds
	}

	const leftOpenTopOpen = {
		inset: `${props.horizonTalTrayHeight}px 0px 0px ${props.verticalTrayWidth}px`,
	};
	const boundsLeftOpenTopOpen = {
		right: bounds.right - (props.verticalTrayWidth * 2),
		bottom: bounds.bottom - (props.horizonTalTrayHeight * 2),
		...bounds
	}

	const leftOpenTopClosed = {
		inset: `0px 0px 0px ${props.verticalTrayWidth}px`,
	};
	const boundsLeftOpenTopClosed = {
		right: bounds.right - (props.verticalTrayWidth * 2),
		...bounds
	}

	const leftClosedBottomOpen = {
		inset: `0px 0px ${props.horizonTalTrayHeight}px 0px`,
	};
	const boundsLeftClosedBottomOpen = {
		top: bounds.top + (props.horizonTalTrayHeight * 2),
		...bounds
	}

	const leftClosedBottomClosed = {
		inset: `0px 0px 0px 0px`,
	};
	const boundsLeftClosedBottomClosed = {
		...bounds
	}

	const leftClosedTopOpen = {
		inset: `${props.horizonTalTrayHeight}px 0x 0px 0px`,
	};
	const boundsLeftClosedTopOpen = {
		bottom: bounds.bottom - (props.horizonTalTrayHeight * 2),
		...bounds
	}

	const leftClosedTopClosed = {
		inset: `0px 0px 0px 0px`,
	};
	const boundsLeftClosedTopClosed = {
		...bounds
	}

	const rightOpenBottomOpen = {
		inset: `0px ${props.verticalTrayWidth}px ${props.horizonTalTrayHeight}px 0px`,
	};
	const boundsRightOpenBottomOpen = {
		left: bounds.left + (props.verticalTrayWidth * 2),
		top: bounds.top + (props.horizonTalTrayHeight * 2),
		...bounds
	}

	const rightOpenBottomClosed = {
		inset: `0px ${props.verticalTrayWidth}px 0px 0px`,
	};
	const boundsRightOpenBottomClosed = {
		left: bounds.left + (props.verticalTrayWidth * 2),
		...bounds
	}

	const rightOpenTopOpen = {
		inset: `${props.horizonTalTrayHeight}px ${props.verticalTrayWidth}px 0px 0px`,
	};
	const boundsRightOpenTopOpen = {
		left: bounds.left + (props.verticalTrayWidth * 2),
		bottom: bounds.bottom - (props.horizonTalTrayHeight * 2),
		...bounds
	}

	const rightOpenTopClosed = {
		inset: `0px ${props.verticalTrayWidth}px 0px 0px`,
	};
	const boundsRightOpenTopClosed = {
		left: bounds.left + (props.verticalTrayWidth * 2),
		...bounds
	}

	const rightClosedBottomOpen = {
		inset: `0px 0px ${props.horizonTalTrayHeight}px 0px`,
	};
	const boundsRightClosedBottomOpen = {
		top: bounds.top + (props.horizonTalTrayHeight * 2),
		...bounds
	}
	
	const rightClosedBottomClosed = {
		inset: `0px 0px 0px 0px`,
	};
	const boundsRightClosedBottomClosed = {
		...bounds
	}
	
	const rightClosedTopOpen = {
		inset: `${props.horizonTalTrayHeight}px 0px 0px 0px`,
	};
	const boundsRightClosedTopOpen = {
		bottom: bounds.bottom - (props.horizonTalTrayHeight * 2),
		...bounds
	}	

	const rightClosedTopClosed = {
		inset: `0px 0px 0px 0px`,
	};
	const boundsRightClosedTopClosed = {
		...bounds
	}

	const generateList = () => {
		if(props && props.attributeTableLayers && Object.getOwnPropertyNames(props.attributeTableLayers)?.length > 1){      
		  return (
			<List>
				{
			  Object.getOwnPropertyNames(props.attributeTableLayers).map((layerId, index) => {
				if(layerId === "length"){
				  return null;
				} 
				const labelId = `checkbox-list-label-${layerId}`;
				return (
					<ListItem key={layerId} disablePadding
					>
						<ListItemButton role={undefined} onClick={handleToggle(layerId)} dense>
						<ListItemIcon>
							<CheckBox
							edge="start"
							// checked={checked.indexOf(layerId) !== -1}
							checked={true}
							tabIndex={-1}
							/>
						</ListItemIcon>
						<ListItemText id={labelId} primary={props.attributeTableLayers[layerId].title} />
						</ListItemButton>
					</ListItem>
				)
			  })
			}
			</List>
		  )
			
		}else {
		  return null;
		}
	  }

	let style;
	let leftOffset = 0;
	if (props.verticalTrayAnchor === "Left") {
		if (props.verticalTrayIsOpened) {
			if (props.horizontalTrayAnchor === "Top") {
				style = props.horizontalTrayOpen ? leftOpenTopOpen : leftOpenTopClosed;
				bounds = props.horizontalTrayOpen ? boundsLeftOpenTopOpen : boundsLeftOpenTopClosed;
			} else {
				style = props.horizontalTrayOpen ? leftOpenBottomOpen : leftOpenBottomClosed;
				bounds = props.horizontalTrayOpen ? boundsLeftOpenBottomOpen : boundsLeftOpenBottomClosed;
			}
			leftOffset = props.verticalTrayWidth;
		} else {
			if (props.horizontalTrayAnchor === "Top") {
				style = props.horizontalTrayOpen ? leftClosedTopOpen : leftClosedTopClosed;
				bounds = props.horizontalTrayOpen ? boundsLeftClosedTopOpen : boundsLeftClosedTopClosed;
			} else {
				style = props.horizontalTrayOpen ? leftClosedBottomOpen : leftClosedBottomClosed;
				bounds = props.horizontalTrayOpen ? boundsLeftClosedBottomOpen : boundsLeftClosedBottomClosed;
			}
		}
	} else {
		if (props.verticalTrayIsOpened) {
			if (props.horizontalTrayAnchor === "Top") {
				style = props.horizontalTrayOpen ? rightOpenTopOpen : rightOpenTopClosed;
				bounds = props.horizontalTrayOpen ? boundsRightOpenTopOpen : boundsRightOpenTopClosed;
			} else {
				style = props.horizontalTrayOpen ? rightOpenBottomOpen : rightOpenBottomClosed;
				bounds = props.horizontalTrayOpen ? boundsRightOpenBottomOpen : boundsRightOpenBottomClosed;
			}
		} else {
			if (props.horizontalTrayAnchor === "Top") {
				style = props.horizontalTrayOpen ? rightClosedTopOpen : rightClosedTopClosed;
				bounds = props.horizontalTrayOpen ? boundsRightClosedTopOpen : boundsRightClosedTopClosed;
			} else {
				style = props.horizontalTrayOpen ? rightClosedBottomOpen : rightClosedBottomClosed;
				bounds = props.horizontalTrayOpen ? boundsRightClosedBottomOpen : boundsRightClosedBottomClosed;
			}
		}
	}

	return (
		<div className="MapContainer">
			<div id="map" ref={mapDiv} style={style} className="MapHolder">
				<div className="HeaderIcon">
					<div className="Logo">
						<a href={props.logoUrl} target="_blank" rel="noreferrer">
							<img
								src={props.logo}
								alt="logo"
								className="LogoImage"
							></img>
						</a>
					</div>
				</div>
			</div>
			<div className="SearchContainer"></div>
			<DraggableWidget 
				id="BaseMapGallery"
				bounds={bounds}
				widgetLauncherState={widgetLauncherState}
				toggleOpen={toggleOpen}
				isOpen={(widgetLauncherState.indexOf("BaseMapGallery") > -1)}
				icon={<AppRegistrationIcon></AppRegistrationIcon>}
				leftOffset={leftOffset}
				title="Basemap Gallery">
			</DraggableWidget>
			<DraggableWidget 
				id="Legend"
				bounds={bounds}
				widgetLauncherState={widgetLauncherState}
				toggleOpen={toggleOpen}
				isOpen={(widgetLauncherState.indexOf("Legend") > -1)}
				icon={<LegendToggleIcon></LegendToggleIcon>}
				leftOffset={leftOffset}
				title="Legend">
			</DraggableWidget>
			<DraggableWidget 
				id="ErdmanInsight"
				bounds={bounds}
				widgetLauncherState={widgetLauncherState}
				toggleOpen={toggleOpen}
				isOpen={(widgetLauncherState.indexOf("ErdmanInsight") > -1)}
				icon={<InsightsIcon></InsightsIcon>}
				leftOffset={leftOffset}
				title="Erdman Insight">
			</DraggableWidget>
			<DraggableWidget 
				id="Select"
				bounds={bounds}
				widgetLauncherState={widgetLauncherState}
				toggleOpen={toggleOpen}
				isOpen={(widgetLauncherState.indexOf("Select") > -1)}
				icon={<BorderOuterIcon></BorderOuterIcon>}
				leftOffset={leftOffset}
				title="Select">
				{
					<Box>
						<Box>
							<Button onClick={onSelectClickHandler} variant="outlined" startIcon={<BorderOuterIcon />}>
								Select
							</Button>
						</Box>
						<HorizontalRule></HorizontalRule>
						{
							generateList()
						}
					</Box>
				}
			</DraggableWidget>
			<DraggableWidget 
				id="Filter"
				bounds={bounds}
				widgetLauncherState={widgetLauncherState}
				toggleOpen={toggleOpen}
				isOpen={(widgetLauncherState.indexOf("Filter") > -1)}
				icon={<FilterAltIcon></FilterAltIcon>}
				leftOffset={leftOffset}
				title="Filter">
			</DraggableWidget>
			<DraggableWidget 
				id="Measure"
				bounds={bounds}
				widgetLauncherState={widgetLauncherState}
				toggleOpen={toggleOpen}
				isOpen={(widgetLauncherState.indexOf("Measure") > -1)}
				icon={<SquareFootIcon></SquareFootIcon>}
				leftOffset={leftOffset}
				title="Measure">
				<div className="MeasureBox">
					<ButtonGroup variant="outlined" aria-label="outlined button group">
						<Tooltip title="Distance" placement="top"><Button onClick={onDistanceClickHandler} className={activeMeasureTool === "Distance" ? "active" : ""}><StraightenIcon></StraightenIcon></Button></Tooltip>
						<Tooltip title="Area" placement="top"><Button onClick={onAreaClickHandler} className={activeMeasureTool === "Area" ? "active" : ""}><SquareFootIcon></SquareFootIcon></Button></Tooltip>
						<Tooltip title="Clear" placement="top"><Button onClick={onClearClickHandler}><DeleteForeverIcon></DeleteForeverIcon></Button></Tooltip>
					</ButtonGroup>
				</div>
			</DraggableWidget>
			<DraggableWidget 
				id="Print"
				bounds={bounds}
				widgetLauncherState={widgetLauncherState}
				toggleOpen={toggleOpen}
				isOpen={(widgetLauncherState.indexOf("Print") > -1)}
				icon={<PrintIcon></PrintIcon>}
				leftOffset={leftOffset}
				title="Print">
			</DraggableWidget>
			<DraggableWidget 
				id="Swipe"
				bounds={bounds}
				widgetLauncherState={widgetLauncherState}
				toggleOpen={toggleOpen}
				isOpen={(widgetLauncherState.indexOf("Swipe") > -1)}
				icon={<DevicesFoldIcon></DevicesFoldIcon>}
				leftOffset={leftOffset}
				title="Swipe">
			</DraggableWidget>
			<Box id="WidgetBar" className="WidgetBar">
				<Tooltip title="Basemap Gallery" placement="top">
					<IconButton className="WidgetBarIcon" onClick={toggleBaseMapGallery}>
						<AppRegistrationIcon></AppRegistrationIcon>
					</IconButton>
				</Tooltip>
				<Tooltip title="Legend" placement="top">
					<IconButton className="WidgetBarIcon" onClick={toggleLegend}>
						<LegendToggleIcon></LegendToggleIcon>
					</IconButton>
				</Tooltip>
				<Tooltip title="Erdman Insights" placement="top">
					<IconButton className="WidgetBarIcon" onClick={toggleErdmanInsight}>
						<InsightsIcon></InsightsIcon>
					</IconButton>
				</Tooltip>
				<Tooltip title="Select" placement="top">
					<IconButton className="WidgetBarIcon" onClick={toggleSelect}>
						<BorderOuterIcon></BorderOuterIcon>
					</IconButton>
				</Tooltip>
				<Tooltip title="Filter" placement="top">
					<IconButton className="WidgetBarIcon" onClick={toggleFilter}>
						<FilterAltIcon></FilterAltIcon>
					</IconButton>
				</Tooltip>
				<Tooltip title="Measure" placement="top">
					<IconButton className="WidgetBarIcon" onClick={toggleMeasure}>
						<SquareFootIcon></SquareFootIcon>
					</IconButton>
				</Tooltip>
				<Tooltip title="Print" placement="top">
					<IconButton className="WidgetBarIcon" onClick={togglePrint}>
						<PrintIcon></PrintIcon>
					</IconButton>
				</Tooltip>
				<Tooltip title="Swipe" placement="top">
					<IconButton className="WidgetBarIcon" onClick={toggleSwipe}>
						<DevicesFoldIcon></DevicesFoldIcon>
					</IconButton>
				</Tooltip>
			</Box>
		</div>
	);
}

export default MapHolder;
