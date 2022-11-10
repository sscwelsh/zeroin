import React, { useEffect, useState } from "react";
import LayerFolder from "./components/LayerFolder/LayerFolder";
import LayerItem from "./components/LayerItem/LayerItem";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import "./LayerList.css";

function LayerList(props) {
	const [layerStructure, setLayerStructure] = useState(null);	
	const [needRender, setNeedRender] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const open = Boolean(anchorEl);
	const handleMenuOpenClick = (event) =>{
		setAnchorEl(event.currentTarget);
	}
	const handleClose = () => {
		setAnchorEl(null);
	}

	const zoomToChange = (layerId) =>{
		props.onZoomTo(layerId);
	}
	// const turnOnAllLayers = () =>{
	// 	props.data.webMapLayers.forEach((layer) => {
	// 		let layerDef = props.data.webMap.findLayerById(layer.id);
	// 		layerDef.visible = true;
	// 		setLayerStructure(updateNodeByLayer(layer.id,layerStructure,"isVisible", true));
	// 	});
	// 	setNeedRender(!needRender);		
	// }
	const turnOffAllLayers = () =>{
		props.data.webMapLayers.forEach((layer) => {
			let layerDef = props.data.webMap.findLayerById(layer.id);
			layerDef.visible = false;
			setLayerStructure(updateNodeByLayer(layer.id,layerStructure,"isVisible", false));
		});
		setNeedRender(!needRender);
	}

	const expandAllLayers = () =>{
		props.data.webMapLayers.forEach((layer) => {
			setLayerStructure(updateNodeByLayer(layer.id,layerStructure,"isOpen", true));
		});
		setNeedRender(!needRender);
	}
	const collapseAllLayers = () =>{
		props.data.webMapLayers.forEach((layer) => {
			setLayerStructure(updateNodeByLayer(layer.id,layerStructure,"isOpen", false));
		});
		setNeedRender(!needRender);
	}
	const handleLayerVisibilityToggle = (layer, title) => {
		let layerDef = props.data.webMap.findLayerById(layer);
		layerDef.visible = !layerDef.visible;
		setLayerStructure(updateNodeByLayer(layer,layerStructure,"isVisible", layerDef.visible));
		if(layerDef.visible && layerDef.type === 'feature'){
			if(!props.data.attributeTableLayers[layer]){
				props.data.attributeTableLayers[layer] = {title: title, filters:[], selectable: true, filterByExtent: true};
			}
		}
		else{
			delete props.data.attributeTableLayers[layer];
		}
		props.onLayerAdd(props.data.attributeTableLayers);
		setNeedRender(!needRender);
	}
	const toggleFolderCollapse = (id, value) => {
		setLayerStructure(updateNodeById(id,layerStructure,"isOpen", value));
		setNeedRender(!needRender);
	}
	const layerOpacityChange = (layer, opacity) => {
		let layerDef = props.data.webMap.findLayerById(layer);
		layerDef.opacity = opacity;
		setLayerStructure(updateNodeByLayer(layer,layerStructure,"opacity", opacity));
		setNeedRender(!needRender);
	}
	const layerPopupToggle = (layer) => {
		let layerDef = props.data.webMap.findLayerById(layer);
		layerDef.popupEnabled = !layerDef.popupEnabled;
		setLayerStructure(updateNodeByLayer(layer,layerStructure,"popup", layerDef.popupEnabled));
		setNeedRender(!needRender);
	}
	const generateLayerStructure = () => {
		let result = [];
		let level = { result };
		let id = 1000;
		props.data.webMapLayers.forEach((layer, index) => {			
			layer.title.split(" - ").reduce((r, name, i, a) => {
				let layerOrdinalArray = name.split("|");
				let layerName =
				layerOrdinalArray.length > 1
					? layerOrdinalArray[1]
					: layerOrdinalArray[0];
				let layerOrdinal = layerOrdinalArray.length > 1
				? Number(layerOrdinalArray[0])
				: null;
				if (!r[layerName]) {
					r[layerName] = { result: [] };
					r.result.push({
						name: layerName,
						children: r[layerName].result,
						id: id,
						layer: layer.id,
						ordinal: layerOrdinal || id,
						isOpen: false,
						isVisible: layer.on,
						opacity: layer.opacity,
						popup: layer.popup,
						url: layer.url,
						type: layer.type
					});
					id++;
				}

				return r[layerName];
			}, level);
		});
		let root = {name: "root", children: result, level: 0};
		setLayerStructure(root);
	};

	const updateNodeById = (id, node, key, value) => {
    if (node.id === id) {
      node[key] = value
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach((c, i) => {
        node.children[i] = updateNodeById(id, c, key, value)
      })
    }
    return node;
  }

	const updateNodeByLayer = (layer, node, key, value) => {
    if (node.layer === layer) {
      node[key] = value
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach((c, i) => {
        node.children[i] = updateNodeByLayer(layer, c, key, value)
      })
    }
    return node;
  }


	const generateElementStructure = () => {
		if (layerStructure && layerStructure.children.length > 0) {
			layerStructure.children.sort((a,b) => {
				return a.ordinal - b.ordinal
			});
			return (
				<div className="RootList">
					{layerStructure.children.map((node, i) => {
						return genertateLayerFolderStrucure(node);
					})}
				</div>
			);
		}
		return null;
	};

	const genertateLayerFolderStrucure = (node) => {
		if (node.children.length === 0) {
			return (
				<LayerItem
					id={node.id}
					layer={node.layer}
					isVisible={node.isVisible}
					opacity={node.opacity}
					popup={node.popup}
					url={node.url}
					onLayerVisibilityToggle={handleLayerVisibilityToggle}
					onZoomTo={zoomToChange}
					onOpacityChange={layerOpacityChange}
					onPopToggle={layerPopupToggle}
					title={node.name}
					key={node.id}
					type={node.type}
				></LayerItem>
			);
		}
		node.children.sort((a,b) => {
			return a.ordinal - b.ordinal
		});
		return (
			<LayerFolder key={node.id} id={node.id} title={node.name} isOpen={node.isOpen} onToggle={toggleFolderCollapse}>
				{					
					node.children.map((child, i) => {
						return genertateLayerFolderStrucure(child);
					})
				}
			</LayerFolder>
		);
	};
		
	useEffect(() => {
		if (
			props.data &&
			props.data.webMapLayers &&
			props.data.webMapLayers.length > 0 &&
			layerStructure == null
		) {
			generateLayerStructure();
		}
	}, [props.data.webMapLayers]);

	return <div className="LayerList">
		<div className="LayerListMenu">
			<Button
					id="basic-button"
					aria-controls={open ? 'basic-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
					onClick={handleMenuOpenClick}
				>
				<PlaylistAddCheckIcon />
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				{/* <MenuItem onClick={turnOnAllLayers}>Turn All Layers On</MenuItem> */}
				<MenuItem onClick={turnOffAllLayers}>Turn All Layers Off</MenuItem>
				<Divider />
				<MenuItem onClick={expandAllLayers}>Expand All Layers</MenuItem>
				<MenuItem onClick={collapseAllLayers}>Collapse All Layers</MenuItem>
			</Menu>
		</div>
		{generateElementStructure()}
		</div>;
}

export default LayerList;
