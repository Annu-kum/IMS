import React, { useRef,useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { IconButton, TextField, Button, MenuItem, Typography, Hidden } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuid } from 'uuid';
import Dialogs from './DialogBox';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Box } from '@mui/material';
import Dateview from './DateView';
import { DataGrid, gridColumnVisibilityModelSelector, } from '@mui/x-data-grid';
import ExportButton from './Exportbutton';
import Header from '../../../Header';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import './install.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate } from 'date-fns';


const baseUrl='http://127.0.0.1:8000'
export default function InputTable() {
  const [hide,setHide]=useState(true)
  
const columns = [
  { id: 'delete', label: 'Action' },
  { id: 'Entity_id', label: 'Entity_ID', minWidth: 200 },
  { id: 'GPS_IMEI_NO', label: 'GPS IMEI No', minWidth: 200 },
  { id: 'SIM_NO', label: 'SIM No', minWidth: 170, align: 'right' },
  { id: 'Device_Name', label: 'Device Name', minWidth: 170, align: 'right' },
  // Add more columns as needed
  {id: 'NewRenewal',label: 'New/Renewal',minWidth: 170,align: 'right',format: (value) => value.toFixed(2),},
  {id: 'OTR',label: 'OTR',minWidth: 170,align: 'right', format: (value) => value.toFixed(2),},
  {id: 'vehicle1',label: 'Vehicle No 1',minWidth: 170,align: 'right', format: (value) => value.toFixed(2), },
  { id: 'vehicle2', label: 'Vehicle No 2', minWidth: 170, align: 'right', format: (value) => value.toFixed(2),},
  {id: 'vehicle3', label: 'Vehicle No 3', minWidth: 170, align: 'right', format: (value) => value.toFixed(2),},
  {id: 'InstallationDate',label: 'Installation Date',minWidth: 170,align: 'right',format: (value) => value.toFixed(2),},
    
      {
        id: 'Employee_Name',
        label: ' Employee Name ',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
      },
      {
        id: 'Device_Fault',
        label: 'Device Fault ',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
      },
      {
        id: 'Fault_Reason',
        label: 'Fault Reason',
        minWidth: 170,
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
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
      },
     {
        id: 'Remark2',
        label: 'Remark 2',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
     },
      {
        id: 'Remark3',
        label: 'Remark 3',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
      },     
];


const initialRow = {
  id: uuid(),
  MILLER_TRANSPORTER_ID:'',
  MILLER_NAME:'',
  district:'',
  MillerContactNo:'',
  Dealer_Name:'',
  Entity_id:'',
  GPS_IMEI_NO:'',
  SIM_NO:'',
  Device_Name:'',
  NewRenewal:'',
  OTR:'',
  vehicle1:'',
  vehicle2:'',
  vehicle3:'',
  InstallationDate:'',
  Employee_Name:'',
  Device_Fault:'',
  Fault_Reason:'',
  Replace_DeviceIMEI_NO:'',
  Remark1:'',
  Remark2:'',
  Remark3:'',
  Installation_letterHead:null,
};





  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [rows, setRows] = useState([{...initialRow}]);
  const [newRow, setNewRow] = useState([]);
  const dname =useRef('')
  const theme = useTheme()
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [mlID,setMlID]=useState('')
  const [dealerName,setDealername]=useState(' ')
  const[MAcontactno,setMAcontactno]=useState('')
  const[districts,setdistrict]=useState('')
  const[millername,setMillerName]=useState('')
  const[entityid,setEntityid]=useState('')
  const[gpsimeino,setgpsimeino]=useState('')
  const[simno,setsimno]=useState('')
  const[devicename,setdevicename]=useState('')
  const[newrenewal,setnewrenewal]=useState('')
  const[otr,setotr]=useState('')
  const[vehicle1,setvehicle1]=useState('')
  const[vehicle2,setVehicle2]=useState('')
  const[vehicle3,setVehicle3]=useState('')
  const[installdate,setinstalldate]=useState('')
  const[employeename,setemployeename]=useState('')
  const[devicefault,setdevicefault]=useState('')
  const[faultreason,setfaultreason]=useState('')
  const[deviceimeino,setDeviceimei]=useState('')
  const[remark1,setremark1]=useState('')
  const[remark2,setremark2]=useState('')
  const[remark3,setremark3]=useState('')
  const[installedletter,setinstalledletter]=useState('')
  const [file, setFile] = useState(null)
  const token = localStorage.getItem('Token');
 const headers = {
   'content-type': 'application/json',
   'Authorization': `Token ${token}`,
   'Accept': 'application/json',
 };

  const[loadDealers,setLoadealers]=useState([])
  useEffect(() => {
    axios.get(`${baseUrl}/dealer/getdealer/`,{headers})
    .then((response) => {
      setLoadealers(response.data.results);
    });
  }, []);

  const handleonLoad=()=>{
    axios.get(`${baseUrl}/millers/getmillers/${mlID}/`,{headers})
    .then((res)=>{
     const data=res.data;
     setPost(data)
     setMillerName(data.MILLER_NAME);
     setdistrict(data.district);
     setMAcontactno(data.ContactNo);
     handleInputChange(rows[0].id, 'MILLER_NAME', data.MILLER_NAME);
     handleInputChange(rows[0].id, 'district', data.district); 
     handleInputChange(rows[0].id,'ContactNo',data.MillerContactNo)     
    }).catch((err)=>toast.error('miller not found'))
 }
 



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // const formData = new FormData()
  // Object.keys(newRow).forEach(key => formData.append(key, row[key]));
  //   if (row.Installation_letterHead) {
  //     formData.append('File', row.Installation_letterHead);
  //   } 

//  const files = newRow.forEach((row) => {
//     const formData = new FormData();
//     Object.keys(row).forEach(key => formData.append(key, row[key]));
//     if (row.Installation_letterHead) {
//       formData.append('File', row.Installation_letterHead);
//     }
//   })

  


const [installedData,setinstalledData]=useState('')

const handleInputChange = (id, field, value) => {
    if (field === 'Installation_letterHead') {
      setFile(value);
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
      );
    } else {
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
      );
    }
    // setRows((prevRows) =>
    //   prevRows.map((row) => (row.id === id ? {...row, [field]: value } : row))
    // );
    
  };


const handleSave = () => {
  rows.forEach((row) => {
    const formData = new FormData();
    Object.keys(row).forEach(key => formData.append(key, row[key]));
     
      formData.append('MILLER_TRANSPORTER_ID', mlID);
      formData.append('MILLER_NAME', millername);
      formData.append('district', districts);
      formData.append('MillerContactNo', MAcontactno);
      formData.append('Dealer_Name', dealerName);
      formData.append('Installation_letterHead', file);
    axios.post(`${baseUrl}/installation/postinstaller/`,formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Token ${token}`,
    },}
    )
      .then((res) =>{ 
        toast.success("Data saved",{theme:"light",position:"top-center"},setMlID(''), setRows([initialRow]));
        // setMlID(''),
       // setRows([initialRow])
     }
  ).catch((err) =>{toast.error("something went wrong, please check dealerName, Date or upload letterhead",{theme:"light",position:"top-center"}
   )
  //  console.log(err) 
},
    
);
  })
  
};
 

  const handleAddRow = () => {

    const newRowData = {
      ...initialRow,
      MILLER_TRANSPORTER_ID: mlID,
      MILLER_NAME: millername,
      district: districts,
      MillerContactNo: MAcontactno,
      Dealer_Name: dealerName,
      Installation_letterHead: file,
    };
    setRows([...rows,newRowData]);
       
  };
 
  
  const handleRefreshChange=()=>{
    const newRowData = {
      ...initialRow,  
    };
    setRows([newRowData]);
    setMAcontactno("")
    setMlID("")
    setDealername("")
    setdistrict("")
    setMillerName("")

    }
    const handleDeleteRow = (id) => {
      setRows(rows.filter((row) => row.id !== id));
    };

const [arr,setArr]= useState('')



const[post,setPost]=useState('')


return (
    <Paper sx={{ width:'100%', overflow: 'hidden', }}>
  
 <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Device Entry" subtitle={'Entry of Installation Device'} />
        <Grid container spacing={4} p={1} m={1} >
      <Box m={1} className='dialogbtn'>
    <Button  onClick={handleRefreshChange}
      size='small'
      sx={{
        backgroundColor: '#233044',
        '&:hover':{
          backgroundColor:'#233044',
          color:'#fff',
          fontSize: "12px",
        fontWeight: "bolder",
        padding: "8px 10px"
        },
        color:'#fff' ,
        fontSize: "12px",
        fontWeight: "bolder",
        padding: "8px 10px",}}
    className='dialogbtn'>New Entry</Button>
    </Box>
   

   {/* <IconButton onClick={handleAddRow} sx={{color:'#0C134F'}}>
        <AddIcon />
      </IconButton> */}
      </Grid> 
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
              gap="12px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
             <TextField  
                fullWidth
                type="text"
                label="Miller/TransportId"
                value={mlID}
                onChange={(e)=>{
                  const inputs=e.target.value
                  setMlID(inputs)
                    handleInputChange(rows[0].id,'MILLER_TRANSPORTER_ID',inputs);
                }}
                sx={{gridColumn:'span 2'}}
                InputProps={{sx:{height:'50px'}}}
              />
           
              <Button
                sx={{
                  height:'50px',
                  width:'10%',
                  background:`linear-gradient(${'#233044'},${'#233044'})`,
                  '&:hover':{
                    background:'#233044',
                    color:'#fff',
                    fontSize: "14px",
                  fontWeight: "bold",
                  
                  },
                  color:'#fff' ,
                  fontSize: "14px",
                  fontWeight: "bold",
                  gridColumn:'span 2'
                 }}
                 onClick={(e)=>handleonLoad()}
              >Load
              </Button>
           <Box sx={{ fontWeight: 'bold' }}>
               <label>Miller-Name</label>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                
                value={millername}
                onChange={(e)=>{
                  const inputs=e.target.value
                 setMillerName(inputs)
                  handleInputChange(rows[0].id,'MILLER_NAME',inputs)}}
                sx={{ gridColumn:'span 4' ,color:'black'}}
                disabled
                InputProps={{sx:{height:'40px'}}}
              />
            </Box>
            <Box sx={{ fontWeight: 'bold' }}>
              <label>District</label>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                value={districts}
                onChange={(e)=>{
                  const inputs=e.target.value
                  setdistrict(inputs);
                  handleInputChange(rows[0].id,'district',inputs)}}
                disabled
                sx={{gridColumn:'Span 4' }}
                InputProps={{sx:{height:'40px'}}}
                // InputProps={{value:}}
              />
             
             </Box>
             <Box sx={{ fontWeight: 'bold' }}>
                <label>Miller Contact No </label>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                value={MAcontactno}
                onChange={(e)=>{
                  const inputs=e.target.value
                  setMAcontactno(inputs)
                  handleInputChange(rows[0].id,'MillerContactNo',inputs)}}
                sx={{ gridColumn: "span 4" }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              />
            </Box>
           
             <Box sx={{ fontWeight: 'bold' }}>
                <label>Dealer_Name</label>
                
                <TextField
                fullWidth
                variant="filled"
                select
                type="text"
                value={dealerName} 
                onChange={(e)=>{
                  const inputs=e.target.value
                  setDealername(inputs)
                  handleInputChange(rows[0].id,'Dealer_Name',inputs)}} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                InputProps={{sx:{height:'40px'}}}
              >
              <option value=" " >select</option>
              {  loadDealers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.Dealer_Name}
              </option>
            ))}
              </TextField>
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
        <TableContainer sx={{ maxHeight: 300, borderRadius:'1%'}}>
        <Table stickyHeader aria-label="sticky table"  size='small'>
          <TableHead >
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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id} hover role="checkbox" tabIndex={-1} >
               
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} >
                    {
                      column.id === 'delete'? (
                        <IconButton onClick={() => handleDeleteRow(row.id)} sx={{ color: 'red' }}>
                        <DeleteIcon />
                      </IconButton>
                      ):
                      column.id === 'Entity_id' ? (
                        <TextField  
                          value={row[column.id]}
                          
                          onChange={(e) =>{
                          const inputs=e.target.value
                          setEntityid(inputs)
                          handleInputChange(row.id, column.id, inputs)}}
                          size="small"
                        />  ):
                    column.id === 'GPS_IMEI_NO' ? (
                      <TextField  
                        value={row[column.id]}
                        
                        onChange={(e) =>{
                        const inputs=e.target.value
                        setgpsimeino(inputs)
                        handleInputChange(row.id, column.id, inputs)}}
                        size="small"
                      />  ): column.id === 'SIM_NO' ? (
                        <TextField
                          value={row[column.id]}
                          onChange={(e) =>{
                            const inputs=e.target.value
                            setsimno(inputs)
                          handleInputChange(row.id, column.id, inputs)}}
                          size="small"
                        /> ): column.id === 'Device_Name' ? (
                          <TextField
                            value={row[column.id]}
                            size="small"
                            onChange={(e) =>{
                              const inputs=e.target.value
                              setdevicename(inputs)
                               handleInputChange(row.id, column.id, inputs)}}
                          />  ): column.id === 'NewRenewal' ? (
                              <TextField
                                select
                                value={row[column.id]}
                                onChange={(e) =>{
                                  const inputs=e.target.value
                                  setnewrenewal(inputs)
                                   handleInputChange(row.id, column.id, inputs)}}
                                sx={{minWidth:120}}
                                size="small"
                              >
                               <MenuItem value="New">New</MenuItem>
                               <MenuItem value="Renewal">Renewal</MenuItem>
                               </TextField>): column.id === 'OTR' ? (
                                <TextField
                                  value={row[column.id]}
                                  size="small"
                                 onChange={(e) =>{
                                  const inputs=e.target.value
                                  setotr(inputs)
                                   handleInputChange(row.id, column.id, inputs)}}
                               />): column.id === 'vehicle1' ? (
                                <TextField
                                  value={row[column.id]}
                                  size="small"
                                 onChange={(e) => {
                                  const inputs=e.target.value
                                  setvehicle1(inputs)
                                  handleInputChange(row.id, column.id, inputs)}}
                               />): column.id === 'vehicle2' ? (
                                <TextField
                                  value={row[column.id]}
                                  size="small"
                                  onChange={(e) => {
                                    const inputs=e.target.value
                                    setVehicle2(inputs)
                                    handleInputChange(row.id, column.id, inputs)}}
                                 
                               />): column.id === 'vehicle3' ? (
                                <TextField
                                  value={row[column.id]}
                                  size="small"
                                  onChange={(e) => {
                                    const inputs=e.target.value
                                    setVehicle3(inputs)
                                    handleInputChange(row.id, column.id, inputs)}}
                               />): column.id === 'InstallationDate' ? (
                      <TextField
                        type="date"
                        value={row[column.id]}

                        onChange={(e) => {
                          const inputs=e.target.value
                          setinstalldate(inputs)
                          handleInputChange(row.id, column.id, inputs)}}                        size="small"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />): column.id === 'Employee_Name' ? (
                        <TextField
                          
                          value={row[column.id]}
                          size="small"
                          onChange={(e) => {
                            const inputs=e.target.value
                            setemployeename(inputs)
                            handleInputChange(row.id, column.id, inputs)}}                       
                            />): column.id === 'Device_Fault' ? (
                        <TextField
                          
                          value={row[column.id]}
                          size="small"
                          onChange={(e) => {
                            const inputs=e.target.value
                            setdevicefault(inputs)
                            handleInputChange(row.id, column.id, inputs)}}                       
                            />): column.id === 'Fault_Reason' ? (
                        <TextField
                          value={row[column.id]}
                          size="small"
                          onChange={(e) => {
                            const inputs=e.target.value
                            setfaultreason(inputs)
                            handleInputChange(row.id, column.id, inputs)}}                       
                            />): column.id === 'Replace_DeviceIMEI_NO' ? (
                        <TextField
                          value={row[column.id]}
                          size="small"
                          onChange={(e) => {
                            const inputs=e.target.value
                            setDeviceimei(inputs)
                            handleInputChange(row.id, column.id, inputs)}}                       />): column.id === 'Remark1' ? (
                        <TextField
                          value={row[column.id]}
                          size="small"
                          onChange={(e) => {
                            const inputs=e.target.value
                            setremark1(inputs)
                            handleInputChange(row.id, column.id, inputs)}}                       />): column.id === 'Remark2' ? (
                        <TextField
                          value={row[column.id]}
                          size="small"
                          onChange={(e) => {
                            const inputs=e.target.value
                            setremark2(inputs)
                            handleInputChange(row.id, column.id, inputs)}}                       />): column.id === 'Remark3' ? (
                        <TextField
                          value={row[column.id]}
                          size="small"
                          onChange={(e) => {
                            const inputs=e.target.value
                            setremark3(inputs)
                            handleInputChange(row.id, column.id, inputs)}}                       />):<TextField
                          value={row[column.id]}
                          size="small"
                         onChange={(e) => handleInputChange(row.id, column.id, e.target.value)}
                          />
                        }
                  </TableCell>
                ))}
                 
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* ADD ICON */}
         <IconButton onClick={handleAddRow} sx={{
              height:'7vh',
              width:'40px',
              backgroundColor:'#D7E4C0',
              '&:hover':{
                backgroundColor:'#D7E4C0',
                color:'#535C91',
                fontSize: "14px",
              fontWeight: "bold",
              
              },
              color:'#535C91' ,
              fontSize: "14px",
              fontWeight: "bold",
        }}>
        <AddIcon />
      </IconButton>
      </TableContainer>


      </Box>
    </Box> 
     </Box>  
    {/* Row 3 */}
    <Box
           backgroundColor='#F0F8FF'
          padding={'0.2rem'}
          m={'12px 0px 0px'}
          borderRadius={'1%'}
          boxShadow={'12'}
        >
          <Typography  sx={{fontFamily:'inherit',fontWeight:'bold',color:'black',fontSize:'15px' }}>Upload LetterHead  <IconButton component="div" style={{color:'red' }} >*</IconButton>  </Typography>
          
          <Box
              
              gap="20px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                padding:'1.0rem'
              }}
            >
                {/* <TextField
                fullWidth
                variant="filled"
                type="file"
                onChange={(e)=>{
                  const file=e.target.files[0]
                  setFile(file)
                  handleInputChange(rows.id,'Installation_letterHead',file)}}
                InputProps={{sx:{height:'39px'}}}
                sx={{ gridColumn: "span 2" }}
              />  */}
               <input
                            type="file"
                           
                            accept=".pdf,.doc,.docx,.png"
                            onChange={(e)=>{
                              const inputs=e.target.files[0]
                              setFile(inputs)
                              handleInputChange(rows[0].id,'Installation_letterHead',inputs)}}
                          
                          />
                      
              <Button
                size='medium'
                 height='7vh'
                 width='40px'
                sx={{
                 
                  background:`linear-gradient(${'#233044'},${'#82A0D8'})`,
                  '&:hover':{
                    backgroundColor:'#FF8A08',
                    color:'#fff',
                    fontSize: "14px",
                  fontWeight: "bold",
                  
                  },
                  color:'#fff' ,
                  fontSize: "14px",
                  fontWeight: "bold",
                  gridColumn:'span 1',
                   margin:'7px 7px 0px 0px'
                 }}
                 onClick={handleSave}
                 
              >Submit
              </Button>
              <Button
              size='medium'
              height='7vh'
              width='40px'
                sx={{
                  
                  background:`linear-gradient(${'#FF8E8F'},${'#D04848'})`,
                  '&:hover':{
                    backgroundColor:'#FF8A08',
                    color:'#fff',
                    fontSize: "14px",
                  fontWeight: "bold",
                 
                  
                  },
                  color:'#fff' ,
                  fontSize: "14px",
                  fontWeight: "bold",
                  gridColumn:'span 1',
                   margin:'7px 7px 0px 0px'
                 }}
                 
              >Cancel
              </Button>
              </Box>
              </Box>
          </Box>
    </Paper>
  );
}

