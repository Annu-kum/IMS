import React, { useState } from 'react';
import {  Drawer, List, Stack, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import colorConfigs from "./config/colorconfig"; 
import sizeConfigs from "./config/sizeconfig";
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import RecyclingIcon from '@mui/icons-material/Recycling';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WindowIcon from '@mui/icons-material/Window';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import Box from "@mui/material/Box";
import { useNavigate } from 'react-router-dom';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import StreetviewIcon from '@mui/icons-material/Streetview';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddchartRoundedIcon from '@mui/icons-material/AddchartRounded';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useAuth } from '../account/AuthContext';

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {auth} = useAuth();

  const handleClick = () => {
    setOpen(!open);
  };

 const handleexpireClick = () => {
    setOpened(!opened);
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={mobileOpen}
      onClose={handleDrawerToggle}
      sx={{
        width: sizeConfigs.sidebar.width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sizeConfigs.sidebar.width,
          boxSizing: "border-box",
          borderRight: "0px",
          backgroundColor: colorConfigs.sidebar.bg,
          color: colorConfigs.sidebar.color,
        }
      }}
    >
           <List disablePadding>
        <Toolbar sx={{ marginBottom: "10px" }}>
          <Stack sx={{ width: "100%" }} direction="row" justifyContent="center">
            <Typography fontWeight="600">IMS</Typography>
          </Stack>
        </Toolbar>

        {auth.isSuperuser && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/over')} sx={{ "&:hover": { backgroundColor: colorConfigs.sidebar.hoverBg } }}>
                <WindowIcon />
                <Box style={{ padding: '12px' }}>Overview</Box>
              </ListItemButton>
            </ListItem>

            <Divider />

            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText style={{ fontFamily: 'sans-serif' }}>Manage</ListItemText>
              </ListItemButton>
            </ListItem>
          </>
        )}

        {/* Shown to both admin and non-admin */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/install')}>
            <InstallDesktopIcon />
            <Box style={{ padding: '10px' }}>Installation</Box>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/deinstall')}>
            <RemoveCircleOutlineIcon />
            <Box style={{ padding: '10px' }}>Deactivation</Box>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/reinstall')}>
            <RecyclingIcon />
            <Box style={{ padding: '10px' }}>Reactivation</Box>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/report')}>
            <SummarizeIcon />
            <Box style={{ padding: '10px' }}>Report</Box>
          </ListItemButton>
        </ListItem>

        {auth.isSuperuser && (
          <>
            <ListItemButton onClick={handleexpireClick}>
      <ExpandCircleDownIcon />
              <Box style={{ padding: '10px' }}>OTR</Box>
              {opened ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={opened} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
              <ListItemButton onClick={() => navigate('/otr')}>
                <PostAddIcon />
                <Box style={{ padding: '10px' }}>OTR Entry</Box>
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/otrexpiredetails')}>
               <StreetviewIcon/>
                <Box style={{ padding: '10px' }}>OTR Expire Details</Box>
              </ListItemButton>
              </List>
            </Collapse>
            <ListItemButton onClick={handleClick}>
              <PersonIcon />
              <Box style={{ padding: '10px' }}>Dealer</Box>
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton onClick={() => navigate('/dealerentry')}>
                  <DriveFileRenameOutlineIcon />
                  <Box style={{ padding: '10px' }}>Dealer Entry</Box>
                </ListItemButton>
                <ListItemButton onClick={() => navigate('/dealerReport')}>
                  <AssessmentIcon />
                  <Box style={{ padding: '5px' }}>Dealer Wise Report</Box>
                </ListItemButton>
              </List>
            </Collapse>

            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/mealersentry')}>
                <PersonAddIcon />
                <Box style={{ padding: '10px' }}>Millers Entry</Box>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/masterReport')}>
                <AddchartRoundedIcon />
                <Box style={{ padding: '10px' }}>Master Report</Box>
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
