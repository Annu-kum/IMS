// import React from 'react'

// export default function Deletedialogbox() {
//   return (
//     <div>Deletedialogbox</div>
//   )
// }
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
export default function Deletedialogbox(props) {
  const [open, setOpen] = React.useState(false);
  const {setDeleteid,setDeleteDialog,deleteDialog } = props;
  const isNonMobile = useMediaQuery("(min-width:600px)");
 
 const[data,setdata]=React.useState([])
 const token = localStorage.getItem('Token');
 const headers = {
   'content-type': 'application/json',
   'Authorization': `Token ${token}`,
   'Accept': 'application/json',
 };


 


  const handleClickOpen = () => {
   setDeleteDialog(true);
  };
const navigate= useNavigate()
  const handleClose = () => {
    setDeleteDialog(false)
  };


  const handledeleteClick = (event) => {
    event.preventDefault();
    axios.delete(`${baseUrl}/installation/deleteinstaller/${setDeleteid}/`,{headers})
    .then((res)=>{
        toast.success("Row deleted successfully")
        handleClose()
    }) 
      .catch((err) => toast.error("Something went wrong")
    );
  };
  
  return (
    <React.Fragment>
      <Dialog
        open={deleteDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
       
        
      >
      <DialogActions style={{background:'#E1E4EF',}}></DialogActions>
      <DialogActions style={{background:'#E1E4EF',}}></DialogActions>
      <DialogActions style={{background:'#E1E4EF',}}></DialogActions>
      <DialogContent style={{background:'#E1E4EF', fontSize:'1.2rem',fontWeight:'bold',color:'red'}}>
      Are you want to delete data
  <DialogActions style={{background:'#E1E4EF',}}></DialogActions>
  <DialogActions style={{background:'#E1E4EF',}}></DialogActions>
  <DialogActions style={{background:'#E1E4EF', justifyContent: 'center'}}>
    <Button onClick={handledeleteClick} sx={{
      height:'5vh',
      width:'40px',
      background:`linear-gradient(${'#1B1A55'},${'#9290C3'})`,
      '&:hover':{
        background:'#9290C3',
        color:'#fff',
        fontSize: "14px",
        fontWeight: "bold",
      },
      color:'#fff',
      fontSize: "14px",
      fontWeight: "bold",
      margin:'12px',
    }}>
      Delete
    </Button>
    <Button onClick={handleClose}  sx={{
      height:'5vh',
      width:'40px',
      background:`linear-gradient(${'#1B1A55'},${'#9290C3'})`,
      '&:hover':{
        background:'#9290C3',
        color:'#fff',
        fontSize: "14px",
        fontWeight: "bold",
      },
      color:'#fff',
      fontSize: "14px",
      fontWeight: "bold",
      margin:'12px',
    }}>
      Cancel
    </Button>
  </DialogActions>
</DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

