import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
import {TableCell,TableRow,MenuItem,Menu,Table,TableHead,TableBody} from '@mui/material';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import api from '../../../account/BaseApi'; 
const DealerwiseReport = ({ selectedDealerName,startDate,endDate, type, openPopup, setOpenPopup }) => {
    const[rows,setRows]=React.useState(null)
    const[datas,setData]=React.useState([])
    const [maxWidth, setMaxWidth] = React.useState('lg');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const token = localStorage.getItem('Token');

 const headers = {
   'content-type': 'application/json',
   'Authorization': `Token ${token}`,
   'Accept': 'application/json',
 };

    const handleCloses = () => {
    setOpenPopup(false);
  };
 
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const formattedStartDate = formatDate(startDate);
const formattedEndDate = formatDate(endDate);

useEffect(() => {
  if (selectedDealerName) {
    api.get(`/otrdetails/FetchDealerdata/`, {
    params: {
        dealer: selectedDealerName,
        type: type,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
    },
      headers
    })
    .then((res) => setRows(res.data))
    .catch(() => alert("Error fetching data"));
  }
}, [selectedDealerName, type,startDate,endDate]);



if (!rows) {
    return <Box></Box>;
  }



const open = Boolean(anchorEl);
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl(null);
};

// -----------------------------Installation---------------------------
  const csvHeaders = [
    { key: 'MILLER_TRANSPORTER_ID', label: 'ID' },
    { key: 'MILLER_NAME', label: 'Name' },
    { key: 'district', label: 'District' },
    {key:'vehicle1',label:'Vehicle No'},
    { key: 'GPS_IMEI_NO', label: 'GPSIMEINO' },
    { key: 'Device_Name', label: 'Device Name' },
    { key: 'NewRenewal', label: 'NewRenewal' },
    { key: 'OTR', label: 'Otr' },
    { key: 'InstallationDate', label: 'Installation Date' },
  ];

  // Accessing and mapping installation_data
  const data = rows?.map((record) => ({
    MILLER_TRANSPORTER_ID: record.MILLER_TRANSPORTER_ID,
    MILLER_NAME: record.MILLER_NAME,
    district: record.district,
    vehicle1: record.vehicle1,
    GPS_IMEI_NO: record.GPS_IMEI_NO,
    Device_Name: record.Device_Name,
    NewRenewal: record.NewRenewal,
    OTR: record.OTR,
    InstallationDate: record.InstallationDate,
  })) || []; 



  return (
    <>
    <Dialog open={openPopup} onClose={handleClose} maxWidth={maxWidth}>
      <DialogTitle style={{background:'#F0F8FF',fontSize:'15px',fontWeight:'bold',color:'#1B1A55',}}>Report Of Dealer {selectedDealerName}</DialogTitle>
      <DialogContent>
        
      <Typography style={{fontWeight:'bold',fontSize:'15px'}}>Installation Data</Typography>
            <Table  style={{borderRadius:'12%'}} >
                <TableHead  >
                    <TableRow style={{boxShadow:7, borderRadius:'12px', background: '#233044' ,color:'#fff',fontFamily:'sans-serif',fontWeight:'bold',border:'1px solid white' }}   >
                    <TableCell size='small' style={{color:'#fff'}}>MILLER_TRANSPORTER_ID</TableCell>
                        <TableCell size='small' style={{color:'#fff'}}>MILLER_NAME</TableCell>
                        <TableCell size='small' style={{color:'#fff'}}>District</TableCell>
                        <TableCell size='small' style={{color:'#fff'}}>VEHICLE No</TableCell>
                        <TableCell size='small' style={{color:'#fff'}}>GPS_IMEI_NO</TableCell>
                        <TableCell size='small' style={{color:'#fff'}}>Device_Name</TableCell>
                        <TableCell size='small' style={{color:'#fff'}}>NewRenewal</TableCell>
                        <TableCell size='small' style={{color:'#fff'}}>OTR</TableCell>
                        <TableCell size='small' style={{color:'#fff'}}>InstallationDate</TableCell>
                         {/* Add more fields as necessary  */}
                    </TableRow>
                    </TableHead>
               
                <TableBody>
                    {rows.map((record) => (
                        <TableRow key={record.id}>
                            <TableCell size='small'>{record.MILLER_TRANSPORTER_ID}</TableCell>
                            <TableCell size='small'>{record.MILLER_NAME}</TableCell>
                            <TableCell size='small'>{record.district}</TableCell>
                            <TableCell size='small'>{record.vehicle1}</TableCell>
                            <TableCell size='small'>{record.GPS_IMEI_NO}</TableCell>
                            <TableCell size='small'>{record.Device_Name}</TableCell>
                            <TableCell size='small'>{record.NewRenewal}</TableCell>
                            <TableCell size='small'>{record.OTR}</TableCell>
                            <TableCell size='small'>{record.InstallationDate}</TableCell>
                             {/* Add more fields as necessary  */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
      </DialogContent>
      <DialogActions>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          height:'5vh',
          width:'90px',
          backgroundColor:'#233044',
          '&:hover':{
            background:'#535C91',
            color:'#fff',
            fontSize: "12px",
          fontWeight: "bold",
          },
          color:'#fff' ,
          fontSize: "12px",
          fontWeight: "bold",
          
         }}
      >
    <CSVLink
      headers={csvHeaders}
      data={data}
      filename={`Dealer ${selectedDealerName}-installation-data.csv`}
      style={{ textDecoration: 'none', color: '#fff' ,fontSize:'12px' }}
    >
       Export
    </CSVLink>
      </Button>

        <Button onClick={handleCloses}  sx={{
          height:'5vh',
          width:'90px',
          backgroundColor:'#233044',
          '&:hover':{
            background:'#535C91',
            color:'#fff',
            fontSize: "12px",
          fontWeight: "bold",
          },
          color:'#fff' ,
          fontSize: "12px",
          fontWeight: "bold",
          
         }}>Close</Button>
        
      </DialogActions>
    </Dialog>
    </>
  );
};

export default DealerwiseReport;
