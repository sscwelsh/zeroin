import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import React, {useState, useEffect } from 'react';
import moment from 'moment';

export default function Filter(props){
    const [filterObject, setFilterObject] = useState(props.filter);

    const onFilterOptionChangeHandler = (event) => {
        filterObject.fieldOption = event.current.value;
        filterObject.query = buildQuery();
        setFilterObject({...filterObject});
    }
    const onFilterFieldChangeHandler = (event) => {
        let filterFieldValue = event.current.value;
        const column = props.cols.find((col) => {
            return col.field === filterFieldValue;
        });
        if(filterObject.fieldType !== column.type){
            filterObject.fieldValue = "";
        }
        filterObject.fieldType = column.type;
        filterObject.field = column.field;
        filterObject.query = buildQuery();
        setFilterObject({...filterObject});
    }
    const onFilterValueChangeHandler = (event) => {
        filterObject.fieldValue = event.current.value;
        filterObject.query = buildQuery();
        setFilterObject({...filterObject});
    }

    const buildQuery = () => {
        const isEmptyStatement = filterObject.fieldOption === "IS NULL" || filterObject.filterOption === "IS NOT NULL";
        const isLikeStatement = filterObject.filterOption.includes("LIKE");
        const isStringOrDateType = filterObject.fieldType === "date" || filterObject.fieldType === "string";
        const value = isEmptyStatement ? filterObject.fieldOption : (isLikeStatement ? filterObject.fieldOption.replaceAll("[[s]]",filterObject.fieldValue) : `${filterObject.fieldOption} ${(isStringOrDateType ? "'" + filterObject.fieldValue +"'" : filterObject.fieldValue)}`);
        const query = `(${filterObject.field} ${value})`;
        return query;
    }
    
    const generateFilterOptions = () => {
        if(filterObject.fieldType === "date"){
            return (
                <FormControl fullWidth>
                    <InputLabel id="date-operator-select-label">Operator</InputLabel>
                    <Select
                        labelId="date-operator-select-label"
                        id="date-operator-select"
                        value={filterObject.fieldOption}
                        label="Operator"
                        onChange={onFilterOptionChangeHandler}
                    >
                        <MenuItem value={"="}>is</MenuItem>
                        <MenuItem value={"<>"}>is not</MenuItem>
                        <MenuItem value={">"}>is after</MenuItem>
                        <MenuItem value={">="}>is on or after</MenuItem>
                        <MenuItem value={"<"}>is before</MenuItem>
                        <MenuItem value={"<="}>is on or before</MenuItem>
                        <MenuItem value={"IS NULL"}>is empty</MenuItem>
                        <MenuItem value={"IS NOT NULL"}>is not empty</MenuItem>
                    </Select>
                </FormControl>
            )
        }
        if(filterObject.fieldType === "string"){
            return (
                <FormControl fullWidth>
                    <InputLabel id={`string-operator-select-label-${props.id}`}>Operator</InputLabel>
                    <Select
                        labelId={`string-operator-select-label-${props.id}`}
                        id={`number-operator-select-${props.id}`}
                        value={filterObject.fieldOption}
                        label="Operator"
                        onChange={onFilterOptionChangeHandler}
                    >
                        <MenuItem value={"="}>is</MenuItem>
                        <MenuItem value={"<>"}>is not</MenuItem>
                        <MenuItem value={"LIKE '%[[s]]%'"}>contains</MenuItem>                   
                        <MenuItem value={"NOT LIKE '%[[s]]%'"}>does not contain</MenuItem>
                        <MenuItem value={"LIKE '[[s]]%'"}>starts with</MenuItem>
                        <MenuItem value={"LIKE '%[[s]]'"}>ends with</MenuItem>
                        <MenuItem value={"IS NULL"}>is empty</MenuItem>
                        <MenuItem value={"IS NOT NULL"}>is not empty</MenuItem>
                    </Select>
                </FormControl>
            )
        }
        if(filterObject.fieldType === "number"){
            return (
                <FormControl fullWidth>
                    <InputLabel id={`number-operator-select-label-${props.id}`}>Operator</InputLabel>
                    <Select
                        labelId={`number-operator-select-label-${props.id}`}
                        id={`number-operator-select-${props.id}`}
                        value={filterObject.fieldOption}
                        label="Operator"
                        onChange={onFilterOptionChangeHandler}
                    >
                        <MenuItem value={"="}>is</MenuItem>
                        <MenuItem value={"<>"}>is not</MenuItem>
                        <MenuItem value={">"}>is greater</MenuItem>
                        <MenuItem value={">="}>is greater or equal</MenuItem>
                        <MenuItem value={"<"}>is less</MenuItem>
                        <MenuItem value={"<="}>is less or equal</MenuItem>
                        <MenuItem value={"IS NULL"}>is empty</MenuItem>
                        <MenuItem value={"IS NOT NULL"}>is not empty</MenuItem>
                    </Select>
                </FormControl>
            )
        }
        
    }
    return (
        <div className='Filter'>
            {
                <FormControl fullWidth>
                    <InputLabel id={`field-select-label-${props.id}`}>Field</InputLabel>
                    <Select
                        labelId={`field-select-label-${props.id}`}
                        id={`field-select-${props.id}`}
                        value={filterObject.field}
                        label="Field"
                        onChange={onFilterFieldChangeHandler}
                    >
                        {
                            props.cols.map((col,i)=>{
                                return (<MenuItem key={i} value={col.field}>{`${col.headerName} (${col.type})`}</MenuItem>)
                            })
                        }
                    </Select>
                </FormControl>
            }
           {
            generateFilterOptions()
           }
           {() => {
                if(filterObject.fieldOption === "IS NULL" || filterObject.fieldOption === "IS NOT NULL"){
                    return null;
                }
                if(filterObject.fieldType === "string"){
                    return (
                        <TextField
                            id={`field-value-input-${props.id}`}
                            label="Value"
                            variant="outlined"
                            value={filterObject.fieldValue}
                            onChange={onFilterValueChangeHandler}
                      />
                    )
                }
                if(filterObject.fieldType === "number"){
                    return (
                        <TextField
                            id={`field-value-input-${props.id}`}
                            label="Value"
                            type="number"
                            value={filterObject.fieldValue}
                            onChange={onFilterValueChangeHandler}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )
                }
                if(filterObject.fieldType === "date"){
                    return (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DesktopDatePicker
                                label="Value"
                                inputFormat="MM/DD/YYYY"
                                value={ !!filterObject.fieldValue ? moment(filterObject.fieldValue).format("MM/DD/YYYY") : ""}
                                onChange={onFilterValueChangeHandler}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>                        
                    )
                }
                return null;
           }}
        </div>
    );
}               
