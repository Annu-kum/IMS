//upload excel letterhead
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box, useMediaQuery } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const baseUrl= 'http://127.0.0.1:8000'
export default function ExcelLetterhead(props) {
    const{excelDialog,setExceldialog}=props
  const [millerTransporterId, setMillerTransporterId] = useState('');
  const [letterHeadFile, setLetterHeadFile] = useState(null);
  const [installationData, setInstallationData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const token = localStorage.getItem('Token');
  
  

  
  const handleFileChange = (e) => {
    setLetterHeadFile(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('letterhead', letterHeadFile);
    try {
      const response = await axios.post(`${baseUrl}/installation/updateexcelLetterhead/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      toast.success('Letter head inserted successfully!');
      toast.error(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'failed to post');
      toast.success(null);
    }
  };

  const handleClose = () => {
   setExceldialog(false)
    
  };

  return (
    <React.Fragment>
      <Dialog
        open={excelDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ background: '#E1E4EF', fontSize: '15px', fontWeight: 'bold', color: '#1B1A55' }}>
          {"Update LetterHead"}
        </DialogTitle>
        <DialogContent style={{ background: '#E1E4EF' }}>
          <Box backgroundColor='#E1E4EF' borderRadius={'1%'}>
            <Box display="flex" justifyContent="space-between" alignItems="center"></Box>
            <Box backgroundColor='#E1E4EF' padding={'1rem'} m={'0px 0px 1px'} borderRadius={'1%'}>
              <Box
                display="grid"
                gap="12px"
                gridTemplateColumns="repeat(1, minmax(0, 1fr))"
                sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 2" } }}
              >
               
                <Box>
                  <label style={{ fontWeight: 'bolder' }}>Upload Letterhead</label>
                 
                      <input type='file' accept='.pdf,.png,.jpeg,jpg' name='file' onChange={handleFileChange} />  
              
                </Box>
              </Box>
            </Box>
          </Box>
          <DialogActions style={{ background: '#E1E4EF' }}>
            <Button
              sx={{
                height: '7vh',
                width: '40px',
                background: `linear-gradient(${'#1B1A55'},${'#9290C3'})`,
                '&:hover': {
                  background: '#9290C3',
                  color: '#fff',
                  fontSize: "12px",
                  fontWeight: "bold",
                },
                color: '#fff',
                fontSize: "12px",
                fontWeight: "bold",
                margin: '2px',
              }}
              onClick={handleSubmit}
            >
              Update
            </Button>
            <Button
              onClick={handleClose}
              autoFocus
              sx={{
                height: '7vh',
                width: '40px',
                background: `linear-gradient(${'#1B1A55'},${'#9290C3'})`,
                '&:hover': {
                  background: '#9290C3',
                  color: '#fff',
                  fontSize: "12px",
                  fontWeight: "bold",
                },
                color: '#fff',
                fontSize: "12px",
                fontWeight: "bold",
                margin: '2px',
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

