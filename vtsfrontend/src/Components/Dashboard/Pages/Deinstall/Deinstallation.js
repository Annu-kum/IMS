import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

// import InputTable from './Tables';

import MainDeactivation from './MainDeactivation';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'right',
  color: theme.palette.text.secondary,
}));

export default function Deinstallation() {
  return (
    
     <>
       <Box>
       <MainDeactivation/>
       </Box> 
        </>
  
  );
}
