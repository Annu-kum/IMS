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


const baseUrl='http://127.0.0.1:8000'
export default function Updatemillers(props) {
  const [open, setOpen] = React.useState(false);
  const { setRecordForEdit, openPopup, setOpenPopup ,refreshData} = props;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const[values,setValues]=React.useState({
    MILLER_TRANSPORTER_ID:'',
    MILLER_NAME:'',
    ContactNo:'',
    district:'',
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
      axios.get(`${baseUrl}/millers/getmillers/${setRecordForEdit}/`,{headers})
        .then((res) => {
          setValues(res.data);
        })
        .catch((error) => {
          toast.error('Error fetching data:', error);
        });
    }
  }, [setRecordForEdit]);


  const handleClickOpen = () => {
    setOpenPopup(true);
  };
const navigate= useNavigate()
  const handleClose = () => {
    setOpenPopup(false)
  };


  const handleUpdateClick = (event) => {
    event.preventDefault();
    axios.patch(`${baseUrl}/millers/updatemillers/${setRecordForEdit}/`,values,{headers})
    .then((res)=>{
        toast.success("Row updated successfully")
        handleClose()
    }) 
      .catch((err) => toast.error("check contact no. digit"),
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
          {"Update millers Details"}
        </DialogTitle>
        <DialogContent style={{background:'#E1E4EF'}}>
        
  
  <Box  backgroundColor='#F0F8FF'
           padding={'1.5rem'}
         
           borderRadius={'1%'}>
       {/* HEADER */}
       <Box display="flex" justifyContent="space-between" alignItems="center">
         
         </Box>
       {/* First Box*/}
 
 
 <Box
            backgroundColor='#F0F8FF'
           padding={'1.5rem'}
           m={'0px 0px 12px'}
           borderRadius={'1%'}
           
         >
           
           <Box
               display="grid"
               gap="12px"
               gridTemplateColumns="repeat(2, minmax(0, 1fr))"
               sx={{
                 "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
               }}
             >
            <Box sx={{ fontWeight: 'bold' }}>
                <label >Miller-ID</label>
               <TextField
                 fullWidth
                
                 type="text"
                 
                value={values.MILLER_TRANSPORTER_ID}
                disabled
                 onChange={(e)=>setValues({...values,MILLER_TRANSPORTER_ID:e.target.value})}
                 sx={{ gridColumn:'span 2' ,color:'black',background:'#fff'}}
                 
                 InputProps={{sx:{height:'40px'}}}
               />
             </Box>
            
               
            <Box sx={{ fontWeight: 'bold' }}>
                <label>Miller-Name</label>
               <TextField
                 fullWidth
                 
                 type="text"
                 value={values.MILLER_NAME}
                 onChange={(e)=>setValues({...values,MILLER_NAME:e.target.value})}
                //  onChange={(e)=>setMillerName(e.target.value)}
                 
                 
                 sx={{ gridColumn:'span 2' ,color:'black',background:'#fff'}}
                
                 InputProps={{sx:{height:'40px'}}}
               />
             </Box>
             <Box sx={{ fontWeight: 'bold' }}>
               <label>District</label>
               <TextField
                 fullWidth
                
                 type="text"
                 value={values.district}
                 onChange={(e)=>setValues({...values,district:e.target.value})}
                 
                 sx={{gridColumn:'Span 2',background:'#fff' }}
                 InputProps={{sx:{height:'40px'}}}
                 // InputProps={{value:}}
               />
              
              </Box>
              <Box sx={{ fontWeight: 'bold' }}>
                 <label>Contact No</label>
               <TextField
                 fullWidth
                 
                 type="text"
                  value={values.ContactNo}
                  onChange={(e)=>setValues({...values,ContactNo:e.target.value})}
                 sx={{ gridColumn: "span 2",background:'#fff' }}
             
                 InputProps={{sx:{height:'40px'}}}
               />
             </Box>
               </Box>
               </Box>
               </Box> 
              
        
        <DialogActions style={{background:'#E1E4EF'}}>
          <Button onClick={handleUpdateClick}   
          sx={{backgroundColor: '#240750',
            '&:hover':{
              backgroundColor:'#1B1A55',
              color:'#fff',
              fontSize: "12px",
            fontWeight: "bold",
           
            },
            color:'#fff' ,
            fontSize: "12px",
            fontWeight: "bold",
            height:'35px',
            margin:'0px 5px 2px 5px'
           
           }}>Update</Button>
          <Button onClick={handleClose}    sx={{backgroundColor: '#240750',
        '&:hover':{
          backgroundColor:'#1B1A55',
          color:'#fff',
          fontSize: "12px",
        fontWeight: "bold",
       
        },
        color:'#fff' ,
        fontSize: "12px",
        fontWeight: "bold",
        height:'35px',
        margin:'0px 5px 2px 5px'
       
       }}>
            Cancle
          </Button>
        </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
