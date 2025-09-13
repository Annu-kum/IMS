import React, { useState,useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import { useNavigate } from 'react-router-dom';
import colorConfigs from "./config/colorconfig";
import sizeConfigs from "./config/sizeconfig";
import ChangePassword from '../account/ChangePassword';
import axios from 'axios';


const baseUrl='http://127.0.0.1:8000'

const Topbar = ({ handleDrawerToggle }) => {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const[userData,setUserData]=useState([])
  const  [openDialog,setOpenDialog] = useState(false)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const token = localStorage.getItem('Token')
  const headers={
     'content-type': 'application/json',
     'Authorization': `Token ${token}`,
     'Accept': 'application/json',
  };


  useEffect(()=>{
       axios.get(`${baseUrl}/manage_users/all/`,{headers})
       .then((res)=>{
          setUserData(res.data)
       })
  },[])

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async (event) => {
    localStorage.removeItem('Token')
    navigate('/');
  };

  const dialogbox=()=>{
    setOpenDialog(true)
   }

  return (
    <>
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${sizeConfigs.sidebar.width})` },
        ml: { sm: sizeConfigs.sidebar.width },
        boxShadow: "unset",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
        alignItems:'flex-end'
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

          {userData && userData.results && userData.results.length > 0 && (
              <Typography
                color={'#1E201E'}
                fontWeight={'600'}
                style={{fontSize:'12px'}}
              >
                {userData.results[0].username.toUpperCase()}
                </Typography>
            )
          }

        {auth && (
          <div>
            <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={dialogbox}><PublishedWithChangesOutlinedIcon fontSize='small' /><span style={{ margin: 4 }}>Change Password</span></MenuItem>
              <MenuItem onClick={handleLogout}><LogoutIcon fontSize='small' /><span style={{ margin: 4 }}>Logout</span></MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
    <ChangePassword
      openDialog={openDialog}
      setOpenDialog={setOpenDialog}   
    />
    </>
  );
};

export default Topbar;
