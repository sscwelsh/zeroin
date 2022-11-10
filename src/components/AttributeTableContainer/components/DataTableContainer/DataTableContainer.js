import React, {useState, useEffect } from 'react';
import { DataGrid,GridToolbarContainer,GridToolbarColumnsButton,GridToolbarExport,GridColumnMenuProps, GridColumnMenuContainer, SortGridMenuItems} from '@mui/x-data-grid';
import Extent from '@arcgis/core/geometry/Extent';
import { Button, Box, TextField, Dialog, DialogTitle, DialogContent, Switch } from '@mui/material';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import Filter from '../Filter/Filter';


export const GridColMenu = React.forwardRef(function GridColMenu(props, ref){
  const {hideMenu, currentColumn } = props;
  return (
    <GridColumnMenuContainer ref={ref} {...props}>
      <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
    </GridColumnMenuContainer>
  );
})


export default function DataTableContainer(props) {
  const [gridMapping, setGridMapping] = useState({cols:[], rows:[], count:0});
  const [columnsModalOpen, setColumnsModalOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByExtent, setFilterByExtent] = useState(props.filterByExtent)
  const [filters, setFilters] = useState(props.filters)
  const [inProgressFilters, setInProgressFilters] = useState(props.filters)

  const handleColumnsModalClose = () => {
    setColumnsModalOpen(false);
  }
  const handleColumnsModalOpen = () => {
    setColumnsModalOpen(true);
  }
  const handleFiltersModalClose = () => {
    setFiltersModalOpen(false);
  }
  const handleFiltersModalOpen = () => {
    setFiltersModalOpen(true);
  }
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  }
  const handleColToggle = (event, key) => {
    let cols = columns.map((col) => {
      if(col.field === key){
        return {...col, hide:!col.hide};
      }
      return col;
    });
    setColumns([...cols]);
  }
  const handleFiltersChange 
  const handleColHideAll = () => {
    let cols = columns.map((col) => {
      return {...col, hide:true};
    });
    setColumns([...cols]);
  }
  const handleColShowAll = () => {
    let cols = columns.map((col) => {
      return {...col, hide:false};
    });
    setColumns([...cols]);
  }
  const handleAddFilterClick = () => {

  }
  const handleFilterByExtentClick = () => {
    setFilterByExtent(!filterByExtent);
  }
  const FilterByExtentButton = () => {
    let button = <Button onClick={handleFilterByExtentClick} size="small" startIcon={<SelectAllIcon />}>Extent Filter</Button>
    if(filterByExtent){
      button = <Button onClick={handleFilterByExtentClick} size="small" variant='contained' startIcon={<SelectAllIcon />}>Extent Filter</Button>
    }
    return button;
  }
  const CustomToolbar = () => {
    let exportButton = null;
    if(gridMapping.count <= 1000){
      exportButton = <GridToolbarExport />;
    }

    return (
      <GridToolbarContainer>
        <Button onClick={handleColumnsModalOpen} size="small" startIcon={<ViewColumnIcon />}>Columns</Button>
        <Button onClick={handleFiltersModalOpen} size="small" startIcon={<FilterListIcon />}>Filters</Button>
        {FilterByExtentButton()}
        {exportButton}
      </GridToolbarContainer>
    )
  }
  const generateGridMappings = () => {
    if(props && props.webMap && props.layerId && props.extent.extent){
      let layerDef = props.webMap.findLayerById(props.layerId);
      let gridMappingData = {rows:[], count:0};
      let cols = [];

      layerDef.when(()=>{
        cols = (layerDef.fields.map((field, index) => {     
          const numberTypes = ["small-integer","integer","single","double","long"];
          const dateTypes = ["date"] 
          if(index > 9){
            return {
              field: field.name,
              headerName: field.alias,
              sortable: true,
              hide: true,
              width: (field.alias.length * 12),
              type: numberTypes.some((type) => type === field.type) ? "number" : (dateTypes.some((type) => type === field.type) ? "date" : "string")
            }
          }
          return {
            field: field.name,
            headerName: field.alias,
            sortable: true,
            width: (field.alias.length * 12),
            type: numberTypes.some((type) => type === field.type) ? "number" : (dateTypes.some((type) => type === field.type) ? "date" : "string")
          };            
        }));
        setColumns([...cols]);
        let query = {
          outFields:["*"],
          where:"1=1"
        }
        if(filters && filters.length > 0){
          query.where = `(${filters.join(" AND ")})`;
        }
        if(filterByExtent){
          query.geometry = new Extent({
            xmin: props.extent.xmin,
            ymin: props.extent.ymin,
            xmax: props.extent.xmax,
            ymax: props.extent.ymax,
            spatialReference: {
              wkid: 102100,
            },
          });
        }
        layerDef.queryFeatures(query).then((results) => {
          const data = results.features.map((feature,index) => {
            feature.attributes["id"] = feature.attributes["objectid"];
            return Object.keys(feature.attributes).reduce((obj,key) => {
              obj[key] = feature.attributes[key];
              return obj;
            }, {})
          });
          gridMappingData.rows = data;
          layerDef.queryFeatureCount(query).then((countResult) => {
            gridMappingData.count = countResult;
            setGridMapping({...gridMappingData});
          })
        })
      })        
    }
  }
  const generateDataTable = () => {
    if(columns.length > 0 && gridMapping.rows.length > 0){
      return (<DataGrid
        rows={gridMapping.rows}
        columns={columns}
        rowCount={gridMapping.count}
        checkboxSelection
        components={{
          Toolbar: CustomToolbar,
          ColumnMenu: GridColMenu
        }}
      />);
    }
    else{
      return null
    }
  }

  useEffect(()=> {
    generateGridMappings();
  },[props.extent, filterByExtent])
  
  return (
    <div style={{ height: 400, width: '100%' }}>
      {generateDataTable()}
      <Dialog
        open={columnsModalOpen}
        onClose={handleColumnsModalClose}
        key={`${props.layerId}-columns-modal`}
      >
        <DialogTitle>
          <TextField value={searchTerm} onChange={handleSearchTermChange} autoFocus id="find-column" label="Find Column" variant="outlined" fullWidth={true}/>
        </DialogTitle>
        <DialogContent>
          {
            columns.filter((col) => {
              return searchTerm ? col.headerName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 : true;
            }).map((col) => {
              return (
                <Box>
                  <Switch key={col.field} checked={!col.hide} onChange={event => handleColToggle(event, col.field)}></Switch>
			            {col.headerName}
                </Box>
              )
            })
          }
          <Box sx ={{display: "flex", justifyContent: "space-between"}}>
            <Button onClick={handleColShowAll} size="small" >Show All</Button>
            <Button onClick={handleColHideAll} size="small" >Hide All</Button>
          </Box>
        </DialogContent>        
      </Dialog>
      <Dialog
        open={filtersModalOpen}
        onClose={handleFiltersModalClose}
        maxWidth={"md"}
        fullWidth={true}
        key={`${props.layerId}-filter-modal`}
      >
        <DialogTitle>
          <Button onClick={handleAddFilterClick} size="small" startIcon={<AddCircleIcon />}>Add Filter</Button>
        </DialogTitle>
        <DialogContent>
          {
            inProgressFilters.map((filter,i) => {
              <Filter id={i} cols={columns} filter={filter} />
            })
          }
        </DialogContent>        
      </Dialog>
    </div>
  );
}