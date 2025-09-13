// import React from 'react'
// import { Typography,Box,Grid} from '@mui/material';
// import { styled } from '@mui/material/styles';
// import Paper from '@mui/material/Paper';
// import Dateview from './DateView';
// import Search from './Search';
// export default function Installation() {
//     const Item = styled(Paper)(({ theme }) => ({
//         backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
//         ...theme.typography.body2,
//         padding: theme.spacing(),
//         textAlign: '',
//         color: theme.palette.text.secondary,
//       }));

//   return (
    
//     <>
//    <Box sx={{flexGrow:1}}>
//     <Grid container spacing={1} rowSpacing={2} columns={1}>
//         <Grid item sx={15}>
//            <Item><Dateview/> </Item>
           
//         </Grid>
//         <Grid item sx={15}>
//             <Item><Search/></Item>
//         </Grid>
//     </Grid>
//    </Box>
    
//     </>
//   )
// }
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';

import Exportbutton from './Exportbutton';
import InputTable from './Tables';
import DataGridDemo from './GetInsTable';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'right',
  color: theme.palette.text.secondary,
}));

export default function Installation() {
  return (
    
     <>
        
       <Box>
        <DataGridDemo/>
       </Box>
        </>
  
  );
}
