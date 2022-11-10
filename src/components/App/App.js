import "./App.css";
import HorizontalTray from "../HorizontalTray/HorizontalTray";
import VerticalTray from "../VerticalTray/VerticalTray";
import MapHolder from "../MapHolder/MapHolder";
import Splash from "../Splash/Splash";
import AttributeTableContainer from "../AttributeTableContainer/AttributeTableContainer";
import LayerList from "../LayerList/LayerList";
import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { signIn, getLayersByWebMapId } from "../../lib/api/WebMapApi";

function App() {
	const [verticalTrayAnchor] = useState("Left");
	const [verticalTrayOpen, setVerticalTrayOpen] = useState(true);
	const [verticalTrayWidth] = useState(450);
	const [horizontalTrayAnchor] = useState("Bottom");
	const [horizontalTrayOpen, setHorizontalTrayOpen] = useState(false);
	const [horizonTalTrayHeight, setHorizonTalTrayHeight] = useState(500);
	const [logoUrl] = useState("https://erdman.com");
	const [portalUrl] = useState("https://zeroin.erdmananalytics.com/portal");
	const [appId] = useState("x1uql1g9XWD9mq4D");
	const [webMapId] = useState("3ece684cfdc6498393e6f8bf705cebe3");
	const [webMapData, setWebMapData] = useState({
		webMap: null,
		webMapLayers: null,
		portalItem: null,
		tags: null,
		extent: null,
		filters: null,
		attributeTableLayers: null
	});
	const [zoomTo,setZoomTo] = useState(null)
	const handleExtentChange = (extent) => {
		webMapData.extent = extent;
		setWebMapData({...webMapData});
	};
	const handleUpdateLayersForAttributeTable = (attributeTableLayers) => {
		setWebMapData({...webMapData})
	}

	useEffect(() => {
		signIn(appId, portalUrl);
		getLayersByWebMapId(portalUrl, webMapId).then((res) => {
			setWebMapData(res);
		});
	}, [appId, portalUrl, webMapId]);

	return (
		<div className="App">
			<Splash></Splash>
			<MapHolder
				verticalTrayAnchor={verticalTrayAnchor}
				verticalTrayWidth={verticalTrayWidth}
				verticalTrayIsOpened={verticalTrayOpen}
				horizontalTrayAnchor={horizontalTrayAnchor}
				horizonTalTrayHeight={horizonTalTrayHeight}
				horizontalTrayOpen={horizontalTrayOpen}
				attributeTableLayers={webMapData.attributeTableLayers}
				logo={logo}
				logoUrl={logoUrl}
				webMap={webMapData.webMap}
				extent={webMapData.extent}
				onExtentChange={handleExtentChange}
				zoomTo={zoomTo}
			></MapHolder>
			<HorizontalTray
				anchor={horizontalTrayAnchor}
				isOpened={horizontalTrayOpen}
				onOpen={setHorizontalTrayOpen}
				verticalTrayAnchor={verticalTrayAnchor}
				verticalTrayIsOpened={verticalTrayOpen}
				verticalTrayWidth={verticalTrayWidth}
				horizonTalTrayHeight={horizonTalTrayHeight}
				onResize={setHorizonTalTrayHeight}
			>
				<AttributeTableContainer
					attributeTableLayers={webMapData.attributeTableLayers}
					webMap={webMapData.webMap}
					extent={webMapData.extent}
				></AttributeTableContainer>
			</HorizontalTray>
			<VerticalTray
				anchor={verticalTrayAnchor}
				isOpened={verticalTrayOpen}
				onOpen={setVerticalTrayOpen}
				verticalTrayWidth={verticalTrayWidth}
			>
				<LayerList
					data={webMapData}
					onZoomTo={setZoomTo}
					onLayerAdd={handleUpdateLayersForAttributeTable}
				></LayerList>
			</VerticalTray>
		</div>
	);
}

export default App;
