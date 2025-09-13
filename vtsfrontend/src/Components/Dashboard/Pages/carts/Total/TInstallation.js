import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


export default function TInstallation() {
  return (
    <>
    <Card style={{border:'2px solid DodgerBlue'}} >
      <CardContent>
        <Typography  sx={{fontSize:'9' , transform: 'scale(0.8)' ,color:'DodgerBlue'}}  component="span">
       <b>  Install </b>
        </Typography>
        <Typography sx={{fontSize:'8',}} component="div">
        Total - 123
        </Typography>
        <Typography sx={{ fontSize:'8' }} component="div">
        New - 23
        </Typography >
        <Typography sx={{ fontSize:'8' }} component="div">
        Renewal - 45
        </Typography>
        </CardContent>
        </Card>
        </>
  );
}
