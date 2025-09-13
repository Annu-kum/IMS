import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box } from '@mui/material';


const baseUrl= 'http://127.0.0.1:8000'

export default function BulkUpload(props) {
  const [open, setOpen] = React.useState(false);
  const[maxWeight,setMaxwidth]=React.useState('lg')
  const{openDialog,setOpenDialog}=props
  const[files,setFiles]=React.useState([])
  const[uploadFile,setuploadFile]=React.useState([])
  const[letterHead,setletterHead]=React.useState([])
  const FileInputref = React.useRef(null)
  const sampleFileUrl = 'http://127.0.0.1:8000/images/InstallationSample.xlsx';

 
    const downloadSampleFile = async (url) => {
        try {
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const blob = await response.blob();
          const fileUrl = window.URL.createObjectURL(blob);
      
          // Get filename from content-disposition header
          const contentDisposition = response.headers.get('content-disposition');
          let filename = 'InstallationSample.xls';  // Default filename
          if (contentDisposition) {
            const matches = /filename="(.+)"/.exec(contentDisposition);
            if (matches != null && matches[1]) {
              filename = matches[1];
            }
          }
      
          // Initiate download
          const link = document.createElement('a');
          link.href = fileUrl;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch (error) {
          console.error('Error downloading file:', error);
          alert('Error downloading file');
        }
      };
      
  
  
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setuploadFile('');
    setletterHead('')
  };

  const handleFileInput=()=>{
    FileInputref.current.click();
  }

 const handleLetterHead=(e)=>{
    setletterHead(e.target.files[0])
  }



  
  const handleUpload = async () => {
    if (!uploadFile) {
      toast.info("choose file to upload",{
        theme:"light",
        position:"top-center"
    
      })
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('letterhead',letterHead);
    try {
      const response = await axios.post(`${baseUrl}/installation/import/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(response.data.message,{
        theme:"light",
        position:"top-center"
    
      })
      setuploadFile('')
      handleClose();
    } catch (error) {
      if (error.response) {
        toast.error('Error: Due to Duplicate value',{
          theme:"light",
          position:"top-center"
        });
      } else {
        toast.error('An error occurred during file upload',{
          theme:"light",
          position:"top-center"
        });
        console.log(error)
      }
    }
  };

  return (
    <React.Fragment>
      
      <Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth={maxWeight}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle 
        style={{ cursor:'pointer',display:'flex',justifyContent:'center',color:'#9290C3',}}
         id="draggable-dialog-title">
          Upload File
        </DialogTitle>
        <DialogContent style={{height:'120px',border:'2px dashed #9290C3',borderRadius:'5px',backgroundColor:'#E1E4EF',margin:'2px 30px 12px 30px ',alignItems:'center',padding:'40px'}}>
          <DialogContentText style={{ display:'flex',justifyContent:'center', }}>
        <UploadFileOutlinedIcon  sx={{fontSize:'90px',color:'#9290C3'}} onClick={handleFileInput}/>
            <input type='file' accept='.xlsx ,.csv' name='file' hidden ref={FileInputref} onChange={(e)=>{setuploadFile(e.target.files[0])}}/>
          </DialogContentText>
          <DialogContentText sx={{color:'#9290C3'}}> Browse File to upload .xlsx or .csv formate</DialogContentText>
          <DialogContentText sx={{color:'#9290C3',display:'flex',justifyContent:'center',color:'red',fontWeight:'bolder'}}>{uploadFile.name}</DialogContentText>
        </DialogContent>
        
         {/* Letterhead_upload */}
        
        <DialogContent >
      
                <Box>
                  <label style={{ fontWeight: 'bolder' }}>Upload Letterhead</label>
                 
                      <input type='file' accept='.pdf,.png,.jpeg,jpg' name='file' onChange={handleLetterHead} required/>  
              
                </Box>
              
        </DialogContent>    




    <DialogContent>
          <Box
            style={{
              height: '1vh',
              width: '400px',
              color:'green',
              cursor:'pointer',
              fontSize: '14px',
            }}
            onClick={()=>downloadSampleFile(sampleFileUrl)} 
          >
           Click here to Download Sample format of Excelsheet
          </Box>
          </DialogContent>
        
        <DialogActions>
          <Button
          style={{
            height:'7vh',
            width:'40px',
            background:'#1B1A55',
            '&:hover':{
              background:'#9290C3',
              color:'#fff',
              fontSize: "14px",
            fontWeight: "bold",
            },
            color:'#fff' ,
            fontSize: "14px",
            fontWeight: "bold",
            margin:'3px',
         }} 
           onClick={handleClose}>
            Cancel
          </Button>
          <Button style={{
             height:'7vh',
             width:'40px',
             background:'#1B1A55',
             '&:hover':{
               background:'#9290C3',
               color:'#fff',
               fontSize: "14px",
             fontWeight: "bold",
             },
             color:'#fff' ,
             fontSize: "14px",
             fontWeight: "bold",
             margin:'6px',
          }} onClick={handleUpload}>Upload</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}



