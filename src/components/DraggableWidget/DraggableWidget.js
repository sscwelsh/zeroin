import "./DraggableWidget.css";
import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import Box from '@mui/material/Box';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CloseIcon from '@mui/icons-material/Close';
import { ResizableBox  } from 'react-resizable';

function DraggableWidget(props) {
	const [isMinimized, setIsMinimized] = useState(false);
	const [isOpen, setIsOpen] = useState(props.isOpen);
	const [bounds, setBounds] = useState(props.bounds);
	const [size, setSize] = useState({width: 350, height: 480});
	useEffect(() => {
		setBounds({right: props.bounds.right - size.width, bottom: props.bounds.bottom - size.height, left: props.bounds.left, top: props.bounds.top})
	},[size, props.bounds])

	const toggleMinimized = () => {
		setIsMinimized(!isMinimized);
	}
	const toggleOpen = () => {
		let open = !isOpen
		setIsOpen(open);
		props.toggleOpen(props.id)
	}
	const onResize = (event, {element, size}) => {
		setSize({width: size.width, height: size.height});
	};
	// const onControlledDrag = (e, pos) => {
	// 	// let mapRect = document.getElementById("map")?.getBoundingClientRect();
	// 	// if(pos.x < mapRect.left){
	// 	// 	pos.x = mapRect.left
	// 	// }
	// 	// if(pos.x > mapRect.width - width){
	// 	// 	pos.x = mapRect.width - width
	// 	// }
	// 	// if(pos.y > mapRect.height - height){
	// 	// 	pos.y = mapRect.height - height;
	// 	// }
	// 	// if(pos.y < mapRect.top){
	// 	// 	pos.y = mapRect.top;
	// 	// }
	// 	// setPosition({...pos});
	// };

	// const onControlledDragStop = (e, pos) => {
	// 	onControlledDrag(e, pos);
	// };

	
	
	
	return (
		<Draggable handle=".WidgetTitleHeader" bounds={bounds} >
			<ResizableBox width={size.width} height={size.height} minConstraints={[350,480]} style={{display: (props.isOpen ? 'inline-block' : 'none'), position: 'absolute'}} onResize={onResize} >
				<Box id="BaseMapGalleryWidgetContainer" className="WidgetContainer" style={{height: (isMinimized? '30px': `${size.height}px`), width: (isMinimized? '30px': `${size.width}px`), borderRadius: (isMinimized ? '50%' : '10px'), display: (props.isOpen ? 'block' : 'none')}}>
					<Box className="WidgetTitle">
						<Box onClick={toggleMinimized} className="WidgetIcon">
							{props.icon}
							{/* <AppRegistrationIcon></AppRegistrationIcon> */}
						</Box>
						<h2 className="WidgetTitleHeader" style={{display: (isMinimized? 'none important': '')}}>
							{props.title}
							{/* Basemap Gallery */}
						</h2>
						<Box className="WidgetButtons" style={{display: (isMinimized? 'none !important': '')}}>
							<MinimizeIcon onClick={toggleMinimized}></MinimizeIcon>
							<CloseIcon onClick={toggleOpen}></CloseIcon>
						</Box>
					</Box>
					<Box className="WidgetContent" style={{display: (isMinimized? 'none !important': '')}}>
						<Box className="WidgetContentContainer Scrollable">
							<Box>
								{props.children}
							</Box>
							<Box id={props.id}>
							</Box> 
						</Box>
					</Box>
					
				</Box>
			</ResizableBox>			
		</Draggable>
	);
}

export default DraggableWidget;
