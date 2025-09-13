import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { createTheme, } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const defaultTheme = createTheme();
const baseUrl = 'http://127.0.0.1:8000';

export default function ChangePassword(props) {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [open, setOpen] = React.useState(false);
  const[maxWeight,setMaxwidth]=React.useState('lg')
  const{openDialog,setOpenDialog}=props
 

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    const token = localStorage.getItem('Token');
    const headers = {
      'content-type': 'application/json',
      'Authorization': `Token ${token}`,
      'Accept': 'application/json',
    };

    try {
      await axios.post(`${baseUrl}/accounts/changepswd/`, {
        old_password: currentPassword,
        new_password: newPassword,
      }, { headers });

      localStorage.removeItem('Token');
      navigate('/');
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error('Invalid password');
    }
  };



  const handleClose = () => {
    setOpenDialog(false);
  };




  return (
    <>
    <Dialog
    open={openDialog}
    onClose={handleClose}
    maxWidth={maxWeight}
    aria-labelledby="draggable-dialog-title"
  >
    <DialogTitle 
    style={{fontSize:'15px',fontWeight:'bold',color:'#1B1A55',}}>
      Reset Password
    </DialogTitle>
    <DialogContent style={{border:'2px dashed #9290C3',borderRadius:'5px',margin:'0px 12px 0px 12px ',background:'#F0F8FF',}}>
    <TextField
              margin="normal"
              required
              fullWidth
              id="currentPassword"
              label="Old Password"
              type="password"
              value={currentPassword}
              autoComplete="current-password"
              autoFocus
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              autoComplete="new-password"
              minLength={8}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              autoComplete="new-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
    </DialogContent>
    
    <DialogActions >
    <Button
     sx={{
      height:'5vh',
      width:'90px',
      background:'#1B1A55',
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
       onClick={handleSubmit}>
        Reset
      </Button>
      <Button
      sx={{
        height:'5vh',
        width:'90px',
        background:'#1B1A55',
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
       onClick={handleClose}>
        Cancel
      </Button>

    </DialogActions>
  </Dialog>

</>
    
  );
}
