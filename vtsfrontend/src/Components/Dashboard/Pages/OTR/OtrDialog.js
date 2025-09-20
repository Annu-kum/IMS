import React, { useEffect, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import {Box} from '@mui/material';
import { Button } from '@mui/material';

const baseUrl = 'http://127.0.0.1:8000';
const ITEM_HEIGHT = 48;

export default function OtrDialog() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [getGPS, setGPS] = useState([]);
  const open = Boolean(anchorEl);
  const token = localStorage.getItem('Token');
 const headers = {
   'content-type': 'application/json',
   'Authorization': `Token ${token}`,
   'Accept': 'application/json',
 };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    axios.get(`${baseUrl}/otrentries/getotrdata`,{headers})
      .then((res) => {
        const data = res.data;
        console.log(data);
        setGPS(data)
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    
         <Box
              display="grid"
              gap="12px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
             
            >
      <Button
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
           height:'7vh',
            width:'110px',
            background:`linear-gradient(${'#1B1A55'},${'#9290C3'})`,
            
            color:'#fff' ,
            fontSize: "14px",
            fontWeight: "bold",
            gridColumn:'span 2'
           }}
      >
       GPS Number 
      </Button>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        
          style= {{
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
         
        }}
      >
        {getGPS.map((option) => (
          <MenuItem
          sx={{fontSize:'12px'}}
            key={option}
            onClick={() => {
              handleClose();
              // Add any additional click handling logic here
            }}
          >
            {option.GPS_IMEI_NO
            }
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
