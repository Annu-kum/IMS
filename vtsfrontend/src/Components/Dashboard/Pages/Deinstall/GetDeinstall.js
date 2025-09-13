import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { TextField, FormControl,Select,Table,AlertTitle, TableBody, TableCell, TableContainer,Alert, TableHead, TableRow, Paper, Checkbox, Button } from '@mui/material';


import TablePagination from '@mui/material/TablePagination';

import { IconButton, MenuItem, Typography, Hidden } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuid } from 'uuid';
import NewExport from './NewExport';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Box } from '@mui/material';
// import Dateview from './DateView';
import { DataGrid, gridColumnVisibilityModelSelector, } from '@mui/x-data-grid';
import Dateview from '../Manages/Installation/DateView';
import  '../Manages/Installation/install.css';
import Header from '../../Header';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from '@mui/icons-material/Delete';
const columns = [
  { id: '', label: 'Action'},
  {id:'vehicle1',label: 'Vehicle No 1',minWidth: 120,align: 'right', format: (value) => value.toFixed(2), },
  { id: 'Entity_id', label: 'Entity ID', minWidth: 150 },
  { id: 'MILLER_NAME', label: ' MILLER NAME', minWidth: 150 },
  { id: 'MillerContactNo', label: 'Miller ContactNo', minWidth: 180 },
  { id: 'district', label: 'District', minWidth: 120 },
  { id: 'GPS_IMEI_NO', label: 'GPS IMEI No', minWidth: 150 },
  { id: 'SIM_NO', label: 'SIM No', minWidth: 100, align: 'right' },
  { id: 'Device_Name', label: 'Device Name', minWidth: 120, align: 'right' },
  { id: 'Dealer_Name', label: 'Dealer Name', minWidth: 120, align: 'right' },
  // Add more columns as needed
  {id: 'NewRenewal',label: 'New/Renewal',minWidth: 120,align: 'right',format: (value) => value.toFixed(2),},
  {id: 'OTR',label: 'OTR',minWidth: 80,align: 'right', format: (value) => value.toFixed(2),},
  { id: 'vehicle2', label: 'Vehicle No 2', minWidth: 120, align: 'right', format: (value) => value.toFixed(2),},
  {id: 'vehicle3', label: 'Vehicle No 3', minWidth: 120, align: 'right', format: (value) => value.toFixed(2),},
  {id: 'DeactivationDate',label: 'Deactivation Date',minWidth: 150,align: 'right',format: (value) => value.toFixed(2),},
    
      {
        id: 'Employee_Name',
        label: ' Employee Name ',
        minWidth: 120,
        align: 'right',
        format: (value) => value.toFixed(2),
      },
      {
        id: 'Device_Fault',
        label: 'Device Fault ',
        minWidth: 150,
        align: 'right',
        format: (value) => value.toFixed(2),
      },
      {
        id: 'Fault_Reason',
        label: 'Fault Reason',
        minWidth: 150,
        align: 'right',
        format: (value) => value.toFixed(2),
      },
      {
        id: 'Replace_DeviceIMEI_NO',
        label: 'Replace Device IMEI No',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
      },
      {
        id: 'Remark1',
        label: 'Remark 1',
        minWidth: 100,
        align: 'right',
        format: (value) => value.toFixed(2),
      },
     {
        id: 'Remark2',
        label: 'Remark 2',
        minWidth: 100,
        align: 'right',
        format: (value) => value.toFixed(2),
     },
      {
        id: 'Remark3',
        label: 'Remark 3',
        minWidth: 100,
        align: 'right',
        format: (value) => value.toFixed(2),
      },     
];



const InputTable = () => {
  
  const [millerId, setMillerId] = useState('');
  const [dealername,setDealername] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const { control, handleSubmit } = useForm();
  const[dataList,setData]=useState([]);
  const [selectedOption, setSelectedOption] = useState(""); // Track selected option
  const [file, setFile] = useState(null);
  const token = localStorage.getItem('Token');
  const headers = {
    'content-type': 'application/json',
    'Authorization': `Token ${token}`,
    'Accept': 'application/json',
  };
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const[loadDealers,setLoadealers]=useState([])

  const fetchInstallations = async () => {
    setData([]);
  
    if (!millerId) {
      toast.error("Please enter a Miller ID.");
      return;
    }
  
    try {
      let installResponse;
      let deactivateResponse = { data: [] };
  
      // Fetch installation or reactivation data
      if (selectedOption === "installation") {
        installResponse = await axios.get(
          `http://127.0.0.1:8000/installation/getinstaller/${millerId}/`,
          { headers }
        );
  
        // Try deactivation fetch separately
        try {
          deactivateResponse = await axios.get(
            `http://127.0.0.1:8000/deactivation/getdeactivate/${millerId}/`,
            { headers }
          );
        } catch (deactError) {
          if (deactError.response?.status === 404) {
            // No deactivation data found, which is okay
            deactivateResponse.data = [];
          } else {
            throw deactError; // rethrow other errors
          }
        }
  
      } else if (selectedOption === "reactivation") {
        installResponse = await axios.get(
          `http://127.0.0.1:8000/reactivation/getReactivate/${millerId}/`,
          { headers }
        );

         // Try deactivation fetch separately
         try {
          deactivateResponse = await axios.get(
            `http://127.0.0.1:8000/deactivation/getdeactivate/${millerId}/`,
            { headers }
          );
        } catch (deactError) {
          if (deactError.response?.status === 404) {
            // No deactivation data found, which is okay
            deactivateResponse.data = [];
          } else {
            throw deactError; // rethrow other errors
          }
        }
      } else {
        toast.error("Please select an option.");
        return;
      }
  
      const installations = Array.isArray(installResponse.data)
        ? installResponse.data
        : [installResponse.data];
  
      const deactivatedEntityIds = new Set(
        deactivateResponse.data.map((item) => item.Entity_id)
      );
  
      const updatedData = installations.map((install) => ({
        ...install,
        isDeactivated: deactivatedEntityIds.has(install.Entity_id),
      }));
  
      setData(updatedData);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching data. Check Miller ID.");
    }
  };
  
  


// Use useEffect to log the updated state
useEffect(() => {
    console.log("");
}, [dataList]);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 3000); // 3000ms = 3 seconds

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, []);


  const onSubmit = async (data) => {
    const selectedData = dataList
      .filter((item) => selectedRows.includes(item.id))
      .map((item) => ({
        ...item,
        ...data[item.id],
        MILLER_TRANSPORTER_ID:millerId,
        Deactivation_letterHead:file, // Add the deactivation letterhead to each selected row
      }));

   
        selectedData.forEach((row) => {
          const formData = new FormData();
          Object.keys(row).forEach(key => formData.append(key, row[key]));
           
            formData.append('MILLER_TRANSPORTER_ID', millerId);
            formData.append('Deactivation_letterHead', file);
          axios.post(`http://127.0.0.1:8000/deactivation/postdeactivate/`,formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${token}`
          },}
          ).then((res) => 
            toast.success("Data submitted successfully ",{
              theme:"light",
              position:"top-center"
            })).catch((err) => 
            alert("check date or letterhead field")      
    );
        });
          };

  return (
    <Paper sx={{ width:'100%', overflow: 'hidden', }}>
  
    <Box m="20px">
         {/* HEADER */}
         <Box display="flex" justifyContent="space-between" alignItems="center">
         <Header title="Device Entry" subtitle={'Entry of Deactivated Device'} />
          
         </Box>
   
         {/* First Box*/}
         <Box
              backgroundColor='#F0F8FF'
             padding={'1.5rem'}
             m={'0px 0px 12px'}
             borderRadius={'1%'}
             boxShadow={'12'}
           >
             
             <Box
                 display="grid"
                 gap="15px"
                 gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                 sx={{
                   "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                 }}
               >

              <Box sx={{ fontWeight: 'bold' }}>
                   <label>Find Id by selecting options </label>   
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          sx={{ backgroundColor: "#fff", borderRadius: "8px", height: "40px" }}
        >
          <MenuItem value="">Select Option</MenuItem>
          <MenuItem value="installation">Installation</MenuItem>
          <MenuItem value="reactivation">Reactivation</MenuItem>
        </Select>
      </FormControl>
      </Box>
                 <Box sx={{ fontWeight: 'bold' }}>
                   <label>Miller/Transporter Id</label>      
               <TextField
               fullWidth
              
               type="text"
    
        value={millerId}
        onChange={(e)=>setMillerId(e.target.value)}
        sx={{ gridColumn:'span 2' ,color:'black'}}
        InputProps={{sx:{height:'40px'}}}
        
      /></Box>
  <Box>        
                 <Button
                   sx={{
                    height:'6vh',
                    width:'40px',
                    background:`linear-gradient(${'#233044'},${'#233044'})`,
                    '&:hover':{
                      background:'#9290C3',
                      color:'#fff',
                      fontSize: "14px",
                    fontWeight: "bold",
                    
                    },
                    color:'#fff' ,
                    fontSize: "14px",
                    fontWeight: "bold",
                    gridColumn:'span 2',
                    margin:'15px 0px 0px 0px'
                   }}
                    onClick={fetchInstallations}
                 >Load
                 </Button>
                 </Box>  
                
                 <Box sx={{ fontWeight: 'bold' }}>
                 <Typography  sx={{fontFamily:'inherit',fontWeight:'bold',color:'black',fontSize:'15px' }}>Upload LetterHead <IconButton sx={{color:'red'}}>*</IconButton></Typography>
                 <input
                             type="file"
                             accept=".pdf,.doc,.docx,.png"
                             onChange={handleFileChange}
                             
                             required
                          />
                          </Box>
                 </Box>
                 </Box>  
           {/* Row 2 */}
            <Box
             gridColumn="span 4"
             gridRow="span 2"
             backgroundColor='#F0F8FF'
             p="8px"
             boxShadow={'12'}
           >
             
             <Box m="1.5rem ">
         <Box
           height="100%"
           sx={{
             "& .MuiDataGrid-root": {
               border: "none",
             },
             "& .MuiDataGrid-cell": {
               borderBottom: "none",
             },
             "& .MuiDataGrid-columnHeaders": {
               bgcolor:'none',
               color: 'none',
               borderBottom: "none",
               
             },
             "& .MuiDataGrid-virtualScroller": {
               backgroundColor: 'none',
             },
             "& .MuiDataGrid-footerContainer": {
               backgroundColor: 'none',
               color: 'none',
               borderTop: "none",
             },
             "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
               color: `none !important`,
             },
            
           }}
         >
          <form onSubmit={handleSubmit(onSubmit)}>
      <TableContainer sx={{ maxHeight: 300, borderRadius:'1%'}}>
        <Table stickyHeader aria-label="sticky table" size='small'>
          <TableHead>
          <TableRow   >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={'center'}
                  style={{ minWidth: column.minWidth,minHeight:10,background: '#233044' ,color:'#fff',fontFamily:'sans-serif',fontWeight:'bold',border:'1px solid white' }}   
               >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.length > 0 ? (
              dataList.map((datalists) => (
                <TableRow key={datalists.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(datalists.id)}
                      onChange={() => handleRowSelect(datalists.id)}
                       sx={{
                        color: datalists.isDeactivated ? 'grey' : 'inherit',
                        opacity: datalists.isDeactivated ? 0.6 : 1,
                        pointerEvents: datalists.isDeactivated ? 'none' : 'auto', // makes row non-clickable
                      }}                    

/>
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.vehicle1`}
                      control={control}
                      defaultValue={datalists.vehicle1}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small"  />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.Entity_id`}
                      control={control}
                      defaultValue={datalists.Entity_id}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.MILLER_NAME`}
                      control={control}
                      defaultValue={datalists.MILLER_NAME}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.MillerContactNo`}
                      control={control}
                      defaultValue={datalists.MillerContactNo}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.district`}
                      control={control}
                      defaultValue={datalists.district}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.GPS_IMEI_NO`}
                      control={control}
                      defaultValue={datalists.GPS_IMEI_NO}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.SIM_NO`}
                      control={control}
                      defaultValue={datalists.SIM_NO}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.Device_Name`}
                      control={control}
                      defaultValue={datalists.Device_Name}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.Dealer_Name`}
                      control={control}
                      defaultValue={datalists.Dealer_Name}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.NewRenewal`}
                      control={control}
                      defaultValue={datalists.NewRenewal}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small"  />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.OTR`}
                      control={control}
                      defaultValue={datalists.OTR}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" />}
                    />
                  </TableCell>
                 
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.vehicle2`}
                      control={control}
                      defaultValue={datalists.vehicle2}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small"  />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.vehicle3`}
                      control={control}
                      defaultValue={datalists.vehicle3}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small"  />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.DeactivationDate`}
                      control={control}
                      defaultValue={datalists.DeactivationDate}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" type="date" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.Employee_Name`}
                      control={control}
                      defaultValue={datalists.Employee_Name}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.Device_Fault`}
                      control={control}
                      defaultValue={datalists.Device_Fault}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small"  />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.Fault_Reason`}
                      control={control}
                      defaultValue={datalists.Fault_Reason}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small"  />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.Replace_DeviceIMEI_NO`}
                      control={control}
                      defaultValue={datalists.Replace_DeviceIMEI_NO}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small"  />}
                    />
                  </TableCell>
 
                  
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.Remark1`}
                      control={control}
                      defaultValue={datalists.Remark1}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.Remark2`}
                      control={control}
                      defaultValue={datalists.Remark2}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" />}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`${datalists.id}.Remark3`}
                      control={control}
                      defaultValue={datalists.Remark3}
                      render={({ field }) => <TextField {...field} variant="outlined" size="small" />}
                    />
                  </TableCell>
                  
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="10">No Data found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button type="submit" 
          sx={{
            background:`linear-gradient(${'#233044'},${'#82A0D8'})`,
            '&:hover': {
              backgroundColor: '#1B1A55',
              color: '#fff',
              fontSize: "12px",
              fontWeight: "bold",
            },
            color: '#fff',
            fontSize: "12px",
            fontWeight: "bold",
            height: '30px',
            margin: '25px 0px 0px 0px'
          }}
      >
        Submit Selected Rows
      </Button>
      <Button
       sx={{
        background:`linear-gradient(${'#FF8E8F'},${'#D04848'})`,
        '&:hover': {
          backgroundColor:'#FF8A08',
           color: '#fff',
          fontSize: "12px",
          fontWeight: "bold",
        },
        color: '#fff',
        fontSize: "12px",
        fontWeight: "bold",
        height: '30px',
        margin: '25px 0px 0px 5px'
      }}
               
                 
              >Cancel
              </Button>
    </form>
   
   
         </Box>
       </Box> 
        </Box>  
       
             
             </Box>
       </Paper>
  );
};

export default InputTable;
