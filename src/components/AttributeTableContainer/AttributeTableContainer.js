import React, { useState,useEffect } from "react";
import "./AttributeTableContainer.css";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DataTableContainer from './components/DataTableContainer/DataTableContainer';
import Box from '@mui/material/Box';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureTable from "@arcgis/core/widgets/FeatureTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`layer-tabpanel-${index}`}
      aria-labelledby={`layer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


const a11yProps = (index) => {
  return {
    id: `layer-tab-${index}`,
    'aria-controls': `layer-tabpanel-${index}`,
  };
}

// const generateTabs = () =>{
//   if(props.data && props.data.attributeTableLayers){
//     Object.getOwnPropertyNames(props.data.attributeTableLayers).map((layerId) => {
//       let layerDef = props.data.webMap.findLayerById(layerId);
//       let title = props.data.attributeTableLayers[layerId].title;
//       const layer = new FeatureLayer({
//         url: layerDef.url,
//         title: title
//       });
//     })
//   }
// };

function AttributeTableContainer(props){
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTabIndex(newValue);
  };
  const [extent, setExtent] = useState(props.extent);

  const generateTabByTitleAndIndex = (title, index) => {
    return (<Tab key={index} label={title} {...a11yProps(index)} />);
  };
  const generateTabs = () => {
    if(props && props.attributeTableLayers && Object.getOwnPropertyNames(props.attributeTableLayers)?.length > 1){      
      return (
        <Tabs value={activeTabIndex} onChange={handleTabChange} aria-label="layer attribute tables">
        {
          Object.getOwnPropertyNames(props.attributeTableLayers).map((layerId, index) => {
            if(layerId === "length"){
              return null;
            } 
            return generateTabByTitleAndIndex(props.attributeTableLayers[layerId].title, index - 1)
          })
        }
        </Tabs>)
    }else {
      return null;
    }
  }
  const generateTabPanels = () => {
    if(props && props.attributeTableLayers && Object.getOwnPropertyNames(props.attributeTableLayers)?.length > 1){      
      return (
          Object.getOwnPropertyNames(props.attributeTableLayers).map((layerId, index) => {
            if(layerId === "length"){
              return null;
            } 
            return (<TabPanel key={index - 1} value={activeTabIndex} index={index - 1}>
              <DataTableContainer key={layerId} webMap={props.webMap} layerId={layerId} extent={extent} filters={props.attributeTableLayers[layerId].filters} filterByExtent={props.attributeTableLayers[layerId].filterByExtent} title={props.attributeTableLayers[layerId].title}></DataTableContainer>
            </TabPanel>)})
        );
    }else {
      return <Box><p>Please turn on a layer from the layer list</p></Box>;
    }
  }

  useEffect(() => {
    if(props && props.attributeTableLayers && Object.getOwnPropertyNames(props.attributeTableLayers)?.length > 1){  
      setActiveTabIndex(Object.getOwnPropertyNames(props.attributeTableLayers).length - 2);
    }else{
      setActiveTabIndex(0);
    }
    setExtent(props.extent)
  }, [props, props.extent]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {generateTabs()}
      </Box>
      {generateTabPanels()}
    </Box>
  );
}

export default AttributeTableContainer;
