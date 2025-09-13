import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField,Box,Paper, } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {IconButton} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { addMonths,format } from 'date-fns';
import {InputAdornment} from '@mui/material';
const baseUrl='http://127.0.0.1:8000'
export default function UpdateOtr(props) {
  const [open, setOpen] = React.useState(false);
  const { setRecordForEdit, openPopup, setOpenPopup ,refreshData} = props;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const[values,setValues]=React.useState({
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
  })
  
 
 const[data,setdata]=React.useState([])
 const token = localStorage.getItem('Token');
 const headers = {
   'content-type': 'application/json',
   'Authorization': `Token ${token}`,
   'Accept': 'application/json',
 };


  React.useEffect(()=>{
    if (setRecordForEdit) {
      axios.get(`${baseUrl}/otrentries/getbygpsno/${setRecordForEdit}`)
        .then((res) => {
          setValues(res.data); 
        })
        .catch((error) => {
          toast.error('Error fetching data:', error);
        });
    }
  }, [setRecordForEdit]);


  const nextexdate=() => {
    // Set up interval to update expiry date 
    const num = parseInt(values.extendedMonth,10)
      const givenDate= format(values.ExpiryDate,'dd-MM-yyyy')
      const newDate = addMonths(givenDate,num);
      const dateformate = format(newDate,'dd-MM-yyyy');
     
      setValues(prevValues => ({
        ...prevValues,
        nextExpirydate:dateformate
      }));
    };



  const handleClickOpen = () => {
    setOpenPopup(true);
  };
const navigate= useNavigate()
  const handleClose = () => {
    setOpenPopup(false)
  };


  const handleUpdateClick = (event) => {
    event.preventDefault();
    axios.put(`${baseUrl}/otrentries/updatebyid/${setRecordForEdit}`,values)
    .then((res)=>{
        toast.success("Row updated successfully")
        handleClose()
    }) 
      .catch((err) => toast.error("Something went wrong")
    );
  };


  
  return (
    <React.Fragment>
      <Dialog
        open={openPopup}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
       
        
      >
        <DialogTitle id="alert-dialog-title" style={{background:'#E1E4EF',fontSize:'15px',fontWeight:'bold',color:'#1B1A55'}}>
          {"Update OTR Data"}
        </DialogTitle>
        <DialogContent style={{background:'#E1E4EF'}}>
        
  
  <Box  backgroundColor='#E1E4EF'
           padding={'1.5rem'}
         
           borderRadius={'1%'}>
     
    
       {/* First Box*/}
           
           <Box
               display="grid"
               gap="12px"
               gridTemplateColumns="repeat(2, minmax(0, 1fr))"
               sx={{
                 "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
               }}
             >
    <Box sx={{ fontWeight: 'bold' }}>
    <label>Enter GPS No</label>
      <TextField
        fullWidth
        variant="filled"
        type="text"
       disabled
        value={values.GPS_IMEI_NO}
        onChange={(e)=>setValues({...values,GPS_IMEI_NO:e.target.value})}
        sx={{ gridColumn: 'span 2' }}
        InputProps={{ sx: { height: '40px' } }}
       
      />
     
           </Box>
             
              <Box sx={{ fontWeight: 'bold' }}>
                <label>Miller/Transpoter Id</label>
                
                <TextField
                fullWidth
                variant="filled"
                type="text"
                 value={values.MILLER_TRANSPORTER_ID} 
                onChange={(e)=>setValues({...values,MILLER_TRANSPORTER_ID:e.target.value})} 
                sx={{ gridColumn: "span 2" }}
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
                
                value={values.MILLER_NAME} 
                onChange={(e)=>setValues({...values,MILLER_NAME:e.target.value})}
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
                value={values.MillerContactNo} 
                onChange={(e)=>setValues({...values,MillerContactNo:e.target.value})}
                sx={{ gridColumn: "span 2" }}
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
                value={values.district} 
                onChange={(e)=>setValues({...values,district:e.target.value})}
                disabled
                sx={{gridColumn:'Span 2' }}
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
                value={values.Dealer_Name} 
                onChange={(e)=>setValues({...values,Dealer_Name:e.target.value})}
                sx={{ gridColumn: "span 2" }}
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
                value={values.Entity_id} 
                onChange={(e)=>setValues({...values,Entity_id:e.target.value})}
                sx={{ gridColumn: "span 2" }}
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
                value={values.SIM_NO} 
                onChange={(e)=>setValues({...values,SIM_NO:e.target.value})}
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
                value={values.Device_Name} 
                onChange={(e)=>setValues({...values,Device_Name:e.target.value})}
                sx={{ gridColumn: "span 2" }}
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
                value={values.NewRenewal} 
                onChange={(e)=>setValues({...values,NewRenewal:e.target.value})}
                sx={{ gridColumn: "span 2" }}
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
                value={values.OTR} 
                onChange={(e)=>setValues({...values,OTR:e.target.value})}
                sx={{ gridColumn: "span 2" }}
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
                value={values.vehicle1} 
                onChange={(e)=>setValues({...values,vehicle1:e.target.value})} 
                sx={{ gridColumn: "span 2" }}
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
                value={values.vehicle2} 
                onChange={(e)=>setValues({...values,vehicle2:e.target.value})}
                sx={{ gridColumn: "span 2" }}
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
                value={values.vehicle3} 
                onChange={(e)=>setValues({...values,vehicle3:e.target.value})}
                sx={{ gridColumn: "span 2" }}
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
                value={values.Employee_Name} 
                onChange={(e)=>setValues({...values,Employee_Name:e.target.value})} 
                sx={{ gridColumn: "span 2" }}
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
                value={values.Device_Fault} 
                onChange={(e)=>setValues({...values,Device_Fault:e.target.value})}
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
                value={values.Fault_Reason} 
                onChange={(e)=>setValues({...values,Fault_Reason:e.target.value})}
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
                value={values.Replace_DeviceIMEI_NO} 
                onChange={(e)=>setValues({...values,Replace_DeviceIMEI_NO:e.target.value})}
                sx={{ gridColumn: "span 2" }}
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
                value={values.InstallationDate} 
                onChange={(e)=>setValues({...values,InstallationDate:e.target.value})}
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
                value={values.ExpiryDate} 
                onChange={(e)=>setValues({...values,ExpiryDate:e.target.value})}
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
                value={values.extendedMonth} 
                onChange={(e)=>setValues({...values,extendedMonth:e.target.value})} 
                sx={{ gridColumn: "span 2" }}
                SelectProps={{ native: true }}
                InputProps={{sx:{height:'40px'},
                
              }}
              >
              </TextField>
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                <label>Next Expiry Date</label>
                
                <TextField
      fullWidth
      variant="filled"
      type="text"
      value={values.nextExpirydate}
      onChange={(e)=>setValues({...values,nextExpirydate:e.target.value})}
      sx={{ gridColumn: "span 2" }}
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
                
            
             
            
               
            
               </Box>
               </Box>
               </Box> 
              
        
        <DialogActions style={{background:'#E1E4EF'}}>
          <Button onClick={handleUpdateClick}   sx={{
                   height:'7vh',
                   width:'40px',
                   background:`linear-gradient(${'#1B1A55'},${'#9290C3'})`,
                   '&:hover':{
                     background:'#9290C3',
                     color:'#fff',
                     fontSize: "14px",
                   fontWeight: "bold",
                   },
                   color:'#fff' ,
                   fontSize: "14px",
                   fontWeight: "bold",
                   margin:'12px',
                   
                  }}>Update</Button>
          <Button onClick={handleClose} 
           sx={{
                   height:'7vh',
                   width:'40px',
                   background:`linear-gradient(${'#1B1A55'},${'#9290C3'})`,
                   '&:hover':{
                     background:'#9290C3',
                     color:'#fff',
                     fontSize: "14px",
                   fontWeight: "bold",
                   },
                   color:'#fff' ,
                   fontSize: "14px",
                   fontWeight: "bold",
                   margin:'12px',
                   
                  }}>
            Cancle
          </Button>
        </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

