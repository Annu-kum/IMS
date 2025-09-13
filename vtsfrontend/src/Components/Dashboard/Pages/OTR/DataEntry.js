import React, { useRef,useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { IconButton, TextField, Button, } from '@mui/material';
import { Box ,Menu} from '@mui/material';
import { addMonths,format,parse } from 'date-fns';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import {InputAdornment} from '@mui/material';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RefreshIcon from '@mui/icons-material/Refresh';




const baseUrl='http://127.0.0.1:8000'




export default function DataEntry() {
  const months=[1,2,3,4,5,6,7,8,9,10,11,12]
  const [rows, setRows] = useState({
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
        ExpiryDate:'',
        extendedMonth:'',
        nextExpirydate:'',
  });
  const[values,setValues]=useState('')
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
  const[ExpiryDate,setExpirydate]=useState('')
  const[extendedMonth,setExtendedmonth]=useState('')
  const[nextExpirydate,setNextexpirydate]=useState('')
  
 

  useEffect(() => {
    if (gpsimeino) {
      axios.get(`${baseUrl}/otrentries/gpsno/${gpsimeino}`)
        .then((res) => {
          const data = res.data;
         ;

     setMlID(data.MILLER_TRANSPORTER_ID);
     setMillerName(data.MILLER_NAME);
     setdistrict(data.district);
     setMAcontactno(data.MillerContactNo);
     setDealername(data.Dealer_Name);
     setEntityid(data.Entity_id);
     setsimno(data.SIM_NO);
     setdevicename(data.Device_Name);
     setnewrenewal(data.NewRenewal);
     setotr(data.OTR);
     setvehicle1(data.vehicle1);
     setVehicle2(data.vehicle2);
     setVehicle3(data.vehicle3);
     setinstalldate(data.InstallationDate);
     setemployeename(data.Employee_Name);
     setdevicefault(data.devicefault)
     setfaultreason(data.Device_Fault)
     setDeviceimei(data.Replace_DeviceIMEI_NO);
        })
        .catch((err) => toast.error("something went wrong"));
    }
  }, [gpsimeino]);



  useEffect(() => {
    // Set up interval to update expiry date 
    const interval = setInterval(() => {
      if (installdate) {
      const givenDate= parse(installdate,'dd-MM-yyyy',new Date());
      const newDate = addMonths(givenDate,6);
      const dateformate = format(newDate,'dd-MM-yyyy');
        setExpirydate(dateformate);
      }
    }, 2000);

    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, [installdate]); 

//convert the string to integer...
const num = parseInt(extendedMonth,10)

  const nextexdate=() => {
    // Set up interval to update expiry date 
      if (!ExpiryDate || !extendedMonth) return;

      const num = parseInt(extendedMonth, 10);
      const givenDate = parse(ExpiryDate, 'dd-MM-yyyy', new Date()); 
      const newDate = addMonths(givenDate,num);
      const dateformate = format(newDate,'dd-MM-yyyy');
        setNextexpirydate(dateformate);
      
    // Cleanup function to clear the interval
   
    };

    const handleSubmit=(event)=>{
      event.preventDefault();
     
     axios.post(`${baseUrl}/otrentries/postotrdata`,{
      MILLER_TRANSPORTER_ID:mlID,
      MILLER_NAME:millername,
      district:districts,
      MillerContactNo:MAcontactno,
      Dealer_Name:dealerName,
      Entity_id:entityid,
      GPS_IMEI_NO:gpsimeino,
      SIM_NO:simno,
      Device_Name:devicename,
      NewRenewal:newrenewal,
      OTR:otr,
      vehicle1:vehicle1,
      vehicle2:vehicle2,
      vehicle3:vehicle3,
      InstallationDate:installdate,
      Employee_Name:employeename,
      Device_Fault:devicefault,
      Fault_Reason:faultreason,
      Replace_DeviceIMEI_NO:deviceimeino,
      ExpiryDate:ExpiryDate,
      extendedMonth:extendedMonth,
      nextExpirydate:nextExpirydate,
     }).then((res)=>{
       toast.success("Data saved",{theme:"light",position:"top-center"})
      
       
     }).catch((error)=> toast.error("nextExpirydate not be blank",{theme:"light",position:"top-center"}))
     
    }
   
   

const ITEM_HEIGHT = 48;


  const [anchorEl, setAnchorEl] = useState(null);
  const [getGPS, setGPS] = useState([]);
  const open = Boolean(anchorEl);
 
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  useEffect(() => {
    axios.get(`${baseUrl}/otrentries/getotrdata`)
      .then((res) => {
        const data = res.data;
        setGPS(data)
      })
      .catch((err) => toast.error("Error fetching data"));
  }, []);


  return (
    <Paper sx={{ width:'100%', overflow: 'hidden', }}>
    <Box m="20px">
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
              <Box sx={{ fontWeight: 'bold' }}>
              <label>Enter GPS IMEI No</label>
      <TextField
        fullWidth
        type="text"
       
        value={gpsimeino}
        onChange={(e) => setgpsimeino(e.target.value)}
        sx={{ gridColumn: 'span 2' }}
        InputProps={{ sx: { height: '40px' } }}
        aria-label="more"
        aria-haspopup="true"
        
      />
     
           </Box>
             
              <Box sx={{ fontWeight: 'bold' }}>
                <label>Miller/Transpoter Id</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                 value={mlID} 
                onChange={(e)=>setMlID(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
           <Box sx={{ fontWeight: 'bold' }}>
               <label>Miller-Name</label>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                
                value={millername} 
                onChange={(e)=>setMillerName(e.target.value)} 
                sx={{ gridColumn:'span 4' ,color:'black'}}
                disabled
                InputProps={{sx:{height:'40px'}}}
              />
            </Box>
            <Box sx={{ fontWeight: 'bold' }}>
                <label>Miller Contact No </label>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                value={MAcontactno} 
                onChange={(e)=>setMAcontactno(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
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
                onChange={(e)=>setdistrict(e.target.value)} 
                disabled
                sx={{gridColumn:'Span 4' }}
                InputProps={{sx:{height:'40px'}}}
                // InputProps={{value:}}
              />
             
             </Box>
            
           
             <Box sx={{ fontWeight: 'bold' }}>
                <label>Dealer_Name</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={dealerName} 
                onChange={(e)=>setDealername(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box> 
              <Box sx={{ fontWeight: 'bold' }}>
                <label>Entity Id</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={entityid} 
                onChange={(e)=>setEntityid(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>SIM No</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={simno} 
                onChange={(e)=>setsimno(e.target.value)}  
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>Device Name</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={devicename} 
                onChange={(e)=>setdevicename(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>New/Renewal</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={newrenewal} 
                onChange={(e)=>setnewrenewal(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>OTR</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={otr} 
                onChange={(e)=>setotr(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>vehicle1</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={vehicle1} 
                onChange={(e)=>setvehicle1(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>vehicle2</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={vehicle2} 
                onChange={(e)=>setVehicle2(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>vehicle3</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={vehicle3} 
                onChange={(e)=>setVehicle3(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>Employee_Name</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={employeename} 
                onChange={(e)=>setemployeename(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>Device_Fault</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={devicefault} 
                onChange={(e)=>setdevicefault(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>Fault_Reason</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={faultreason} 
                onChange={(e)=>setfaultreason(e.target.value)}  
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>Replace_DeviceIMEI_NO</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={deviceimeino} 
                onChange={(e)=>setDeviceimei(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>Installation Date</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={installdate} 
                onChange={(e)=>setinstalldate(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>Expiry Date</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                value={ExpiryDate} 
                onChange={(e)=>setExpirydate(e.target.value)} 
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                disabled
                InputProps={{sx:{height:'40px'}}}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>Extended Month</label>
                <TextField
                fullWidth
                variant="filled"
                type="number"
                value={extendedMonth} 
                onChange={(e)=>setExtendedmonth(e.target.value)}  
                sx={{ gridColumn: "span 4" }}
                SelectProps={{ native: true }}
                InputProps={{sx:{height:'40px'}}}
              />
               
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>Next Expiry Date</label>
                
                <TextField
      fullWidth
      variant="filled"
      type="text"
      value={nextExpirydate}
      onChange={(e) => setNextexpirydate(e.target.value)}
      sx={{ gridColumn: "span 4" }}
      InputProps={{
        sx: { height: '40px' },
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="refresh"
              onClick={nextexdate}
              edge="end"
            >
              <RefreshIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
              <Button
                size='small'
                 height='2vh'
                 width='20px'
                sx={{
                 
                  background:`linear-gradient(${'#8B93FF'},${'#5755FE'})`,
                  '&:hover':{
                    backgroundColor:'#FF8A08',
                    color:'#fff',
                    fontSize: "14px",
                  fontWeight: "bold",
                  
                  
                  },
                  color:'#fff' ,
                  fontSize: "14px",
                  fontWeight: "bold",
                 gridColumn: "span 4",
                   margin:'7px 7px 0px 0px'
                 }}
                 onClick={handleSubmit}
                 
              >Submit
              </Button>
              <Button
              size='small'
              height='2vh'
              width='20px'
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
                  gridColumn:'span 4',
                   margin:'7px 7px 0px 0px'
                 }}
                 
              >Cancel
              </Button>
              </Box>
             
              </Box>
              </Box>  
        </Box>
       
        </Paper>
  )
}
