import * as React from 'react';
import { styled } from '@mui/material/styles';
// import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

// import InputTable from './Tables';
import DataGridDemo from '../Manages/Installation/GetInsTable';
import NewExport from '../Deinstall/NewExport';
import ReactiveButton from './Reactivebutton';
import MainReactivation from './ReACEntryp';
import { Box } from '@mui/material';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'right',
  color: theme.palette.text.secondary,
}));

export default function Reinstall() {
  return (
    
     <>
        <Box>
          <MainReactivation/>
        </Box>
        
        </>
  
  );
}