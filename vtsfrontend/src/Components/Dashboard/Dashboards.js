import {React,useState} from 'react';
import { Box, Toolbar, Typography } from "@mui/material";
import sizeConfigs from "./config/sizeconfig";
// import Sidebar from "../common/Sidebar";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import OverallCarts from './Pages/OverallCarts';
import Installation from './Pages/Manages/Installation/Installation';
import Deinstallation from './Pages/Deinstall/Deinstallation';
import Reinstall from './Pages/Reinstallation/Reinstall';
import Report from './Pages/Reports/Report';
import DealerRrpt from "./Pages/DealerReport/DealerRrpt";
import DealerEnrty from "./Pages/DealerReport/DealerEnrty";
import MealersEntry from "./Pages/Mealers/MealersEntry";
import MasterReports from "./Pages/MastryReport/MasterReports";
import '../Dashboard/Pages/Manages/Installation/install.css';
import OtrEntry from './Pages/OTR/OtrEntry';
import OtrExpireDetails from './Pages/OTR/OtrExpireDetails';

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <Box sx={{ display: "flex" ,}}>
      <Topbar handleDrawerToggle={handleDrawerToggle}/>
      <Box
        component="nav"
        sx={{
          width: {xs:0,sm:0,md:sizeConfigs.sidebar.width,lg:sizeConfigs.sidebar.width,xl:sizeConfigs.sidebar.width},
          flexShrink: 0
        }}
      >
        <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}/>
      </Box>
      <Box
        component="main"
        className="hide-scrollbar"
        sx={{
          flexGrow: 1,
          p: 0.02,
          width:{lg: `calc(100% - ${sizeConfigs.sidebar.width})`,sm:'100%',xs:'100%',md:`calc(100% - ${sizeConfigs.sidebar.width})`,xl:`calc(100% - ${sizeConfigs.sidebar.width})`},
          // sm:`calc(100% - ${drawerWidth}px)`
          maxHeight: "100vh",
          backgroundColor: 'light-blue',
          overflowY:'scroll'

        }}
      >
        <Toolbar />
        <Routes>
           <Route path='/over' element={<OverallCarts/>}/>
           <Route path='/install' element={<Installation/>}/>
           <Route path='/deinstall' element={<Deinstallation/>}/>
           <Route path='/reinstall' element={<Reinstall/>}/>
           <Route path='/report' element={<Report/>}/>
             <Route path='/dealerReport' element={<DealerRrpt/>}/>
             <Route path='/dealerentry' element={<DealerEnrty/>}/>
             <Route path='/mealersentry' element={<MealersEntry/>}/>
             <Route path='/masterReport' element={<MasterReports/>}/>
             <Route path='/otr' element={<OtrEntry/>}/>
             <Route path='/otrexpiredetails' element={<OtrExpireDetails/>}/>
             <Route path='*' element={<Navigate to={'/over'}/>} />
        </Routes>
      </Box>
    </Box>
  );
};

export default MainLayout;
