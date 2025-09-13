import {React,useState,forwardRef} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import InputTable from './Tables';
// import InputTable from './Demofile';
import Dialogs from './DialogBox';
import { colors } from '@mui/material';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import Grid from '@mui/material/Unstable_Grid2';
import AddIcon from '@mui/icons-material/Add';
// Define custom styles for the buttons
const CustomButton = styled(Button)(({ theme }) => ({
  // color: 'white',
  // backgroundColor: 'blue',
  // '&:hover': {
  //   backgroundColor: 'blue',
  //   color:'#0A21C0',
  //   border:'none'
  // },
  // border:'none'
 
    backgroundColor: '#0C134F',
    '&:hover': {
    backgroundColor: 'white',
    color:'#535C91',
    border:'1px solid #535C91'
  },
    color: 'white',
    fontSize: "12px",
    fontWeight: "bold",
    padding: "8px 8px",
    boxShadow:"12px"
    
}));
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function ExportButton() {
  const [open, setOpen] = useState(false);
  const [opens,setOpens] = useState(false)
   const handleClickOpen =()=>{
     setOpen(true)
   }
    const handleClose = () => {
      setOpen(false);
    };
  return (
    <Box bgcolor='white' sx={{ ml: "auto" }}
    >
      <Stack spacing={1} direction='row' className='ins-buttons'>
        
        <CustomButton variant="outlined" size="medium" onClick={handleClickOpen} ><AddIcon fontSize="small" sx={{ mr: "10px" }} />Device Entry</CustomButton>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative', background:`linear-gradient(${'#535C91'},${'#fff'})`,boxShadow:'5'}}>
            <Toolbar >
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
               
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div" style={{fontFamily:'Arial',fontWeight:800,color:'#1B1A55'}}>
                Install Device Entry
              </Typography>
              <Button autoFocus color="inherit" onClick={handleClose} style={{fontFamily:'Arial',fontWeight:'bolder',color:'#233044'}}>
                close
              </Button>
            </Toolbar>
          </AppBar>
          <Grid container xs={12} p={3}>
          <InputTable opens={opens} />
          </Grid>
        </Dialog>
      </Stack>
      
    </Box>
  );
}
