import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';


export default function TODeactive() {
  return (
    <Card style={{border:'2px solid DodgerBlue'}} >
          <CardContent >
        <Typography  sx={{fontSize:'9', mx: '5px', transform: 'scale(0.8)' ,color:'DodgerBlue'}}  component="span">
       <b> Deactivate</b>
        </Typography>
        <Typography sx={{fontSize:'4'}} component="div">
        Total - 123
        </Typography>
        <Typography sx={{ fontSize:'4'}} component="div">
        New - 23
        </Typography >
        <Typography sx={{ fontSize:'4'}} component="div">
        Renewal - 45
        </Typography>
       </CardContent>
       </Card>
  );
}

