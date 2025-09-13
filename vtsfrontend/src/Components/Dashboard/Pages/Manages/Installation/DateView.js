import { TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import Box from "@mui/material/Box";
import zIndex from "@mui/material/styles/zIndex";

export default function Dateview({getData}) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState("");
  
  getData(startDate,endDate)

  const CustomInput = ({ value, onChange, onClick }) => (
    <div className="date-picker-wrapper">
    
      <TextField
        type="text"
        value={value}
        onChange={onChange}
        onClick={onClick}
        className="date-picker-input"
        sx={{width:200}}
        InputProps={{
          endAdornment:(
            <InputAdornment position="end">
              <CalendarMonthIcon sx={{color:'#535C91'}}/>
            </InputAdornment>
          ),
          sx:{height:'2rem',border:'1px solid #535C91',}
        }}
      />
    </div>
  );

  const handleStartDateInputChange = (event) => {
    setStartDateInput(event.target.value);
    const inputDate = new Date(event.target.value);
    if (inputDate && !isNaN(inputDate)) {
      setStartDate(inputDate);
    } else {
      setStartDate(null);
    }
  };

  const handleEndDateInputChange = (event) => {
    setEndDateInput(event.target.value);
    const inputDate = new Date(event.target.value);
    if (inputDate && !isNaN(inputDate)) {
      setEndDate(inputDate);
    } else {
      setEndDate(null);
    }
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <Box sx={{m:1}}>
     <Typography sx={{fontSize:'12px'}}>From</Typography>  
        <DatePicker
          placeholderText="Select Start Date"
          dateFormat={"dd-MM-yyyy"}
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          customInput={<CustomInput value={startDateInput? startDateInput.toISOString().split('T')[0] : ''} onChange={handleStartDateInputChange} onClick={() => setStartDateInput("")} />} 
          width='12px'
        />
       </Box>
       <Box sx={{m:1}}>
       <Typography sx={{fontSize:'12px'}}>To</Typography>  
        <DatePicker
          placeholderText="Select End Date"
          dateFormat={"dd-MM-yyyy"}
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate} 
          customInput={<CustomInput value={endDateInput? endDateInput.toISOString().split('T')[0] : ''} onChange={handleEndDateInputChange} onClick={() => setEndDateInput("")} />}
        />
        </Box>
      </div>
    </div>
  );
}