import {React,useState,forwardRef} from 'react';

import Button from '@mui/material/Button';




const Dialogs =()=>{
    const[InputTable]=InputTable()
    return(
        <>
        <Button onClick={InputTable}> Add Button</Button>
        </>
    )
    
  }

export default Dialogs;