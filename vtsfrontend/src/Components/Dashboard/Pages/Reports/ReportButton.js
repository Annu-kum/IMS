import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import * as React from 'react';
import Box from '@mui/material/Box';
import {Typography} from '@mui/material';
import 'jspdf-autotable';
import '../Manages/Installation/install.css'
import Deactive_Report from './Deactive_Report';
import PropTypes from 'prop-types';
import InstallReport from './InstallReport';
import ReactiveReport from './ReactiveReport';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function ReportButton() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
   return (
    <>
    
  
       {/* HEADER */}
       <Box  alignItems="center">
       <Box sx={{ width: '100%', bgcolor: 'background.paper',}}>
       <Tabs value={value} onChange={handleChange}  left>
         <Tab label="Installation" {...a11yProps(0)} className='tabs' sx={{color:'#1B1A55' , fontSize:'12px',fontWeight:'bolder',fontFamily:'initial'}}/>
         <Tab label="Deactivation" {...a11yProps(1)}  className='tabs' sx={{color:'#1B1A55' , fontSize:'12px',fontWeight:'bolder',fontFamily:'initial'}}/>
         <Tab label="Reactivation" {...a11yProps(2)} className='tabs' sx={{color:'#1B1A55' , fontSize:'12px',fontWeight:'bolder',fontFamily:'initial'}}/>
       </Tabs>
     </Box> 
       </Box>
       <CustomTabPanel value={value} index={0}>
        <InstallReport/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Deactive_Report/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ReactiveReport/>
      </CustomTabPanel>
      
     
   </>
  );
}

// https://github.com/CodAffection/React-Material-UI-Table-Paging-Sorting-and-Filtering./blob/master/src/components/useTable.js