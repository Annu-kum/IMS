import React, { useRef,useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { IconButton,Menu, TextField, Button, MenuItem, Typography, Hidden } from '@mui/material';
import {CSVLink,CSVDownload} from 'react-csv';
import { Box } from '@mui/material';
// import Dateview from './DateView';

import Dateview from '../Manages/Installation/DateView';
import  '../Manages/Installation/install.css';
import Header from '../../Header';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import TableSortLabel from '@mui/material/TableSortLabel';
import EditIcon from '@mui/icons-material/Edit';
import Search from '../Manages/Installation/Search';
import zIndex from '@mui/material/styles/zIndex';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getDate } from 'date-fns';
import { toast } from 'react-toastify';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import UploadIcon from '@mui/icons-material/Upload';
import UploadEx from './UploadEx';


export default function DealerEnrty() {
  const [hide,setHide]=useState(true)
const columns = [ 
{id: 'Dealer_Name',label: 'Dealer Name',minWidth: 120,align: 'right',}, 
{id:'contactno1',label:'Contact No1',minWidth: 120,align: 'right',},    
{id:'contactno2',label:'Contact No2',minWidth: 120,align: 'right',} ,  
{id:'companyName',label:'Company Name',minWidth: 120,align: 'right',} ,
{id:'Remark',label:'Remark',minWidth: 120,align: 'right',},
{id:'update',label:'Update',align:'right',}
];


const initialRow = {
  Dealer_Name:'',
  contactno1:'',
  contactno2:'',
  companyName:'',
  Remark:'',
};






  const [page,pageChange]=React.useState(0);
  const[dealername,setDealername]=useState('')
  const[contact1,setcontact1]=useState('');
  const[contact2,setcontact2]=useState('')
  const[companyName,setcompanyName]=useState('');
  const[remark,setRemark]=useState('');
  const[rowsPerPage,rowperpagechange]=React.useState(25);
  const [rows, setRows] = useState([initialRow]);
  const [newRow, setNewRow] = useState([]);
  const [order, setOrder] = React.useState()
  const [orderBy, setOrderBy] = React.useState()
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [value, setValue] = React.useState(1);
  const[search,setSearch]=React.useState('')
  const [editedRows, setEditedRows] = useState([]);
  const [editingDealerId, setEditingDealerId] = useState(null);
  const [newDealerName, setNewDealerName] = useState('');
  const[newcontact1,setnewContact1]=useState('');
  const[newcontact2,setnewContact2]=useState('');
  const[newcompany,setnewcompany]=useState('');
  const[newrmark,setnewRemark]=useState('');
  const[fetchDealer,setfetchDealers]=useState([])
 const [refresh,setRefresh]=React.useState('')
 const [recordForEdit, setRecordForEdit] = useState(null)
 const [openPopup, setOpenPopup] = useState(false)
 const  [openDialog,setOpenDialog] = useState(false)
 const [datacount,setDatacount]=React.useState(0)

 const token = localStorage.getItem('Token');
 const headers = {
   'content-type': 'application/json',
   'Authorization': `Token ${token}`,
   'Accept': 'application/json',
 };

 const openInPopup = item => {
  setRecordForEdit(item)
  setOpenPopup(true)
}

const dialogbox=()=>{
setOpenDialog(true)
}
 
 //page change...
 const handlechangepage=(event,newPage)=>{
    pageChange(newPage)
  }
  const handleRowsPerPage =(e)=>{
    rowperpagechange(+e.target.value)
    pageChange(0)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

//Get data form dealers table.
const getData = async ()=>{
  const response = await axios.get('http://127.0.0.1:8000/dealer/getdealer/',
     {
     params:{
    search:search
  }, 
    headers})
  setfetchDealers(response.data.results)
 }
useEffect(()=>{
  getData()
},[search])

  //post dealer data
 const handleSubmit=(event)=>{
   event.preventDefault();

  
  axios.post('http://127.0.0.1:8000/dealer/postdealer/',{
    Dealer_Name:dealername,
    contactno1:contact1,
    contactno2:contact2,
    companyName:companyName,
    Remark:remark,
  },{headers}).then((res)=>{
    setfetchDealers([...fetchDealer,res.data])
    setDealername('')
    setcontact1('')
    setcontact2('')
    setcompanyName('')
    setRemark('')
  })
  .catch((err)=>{
    if (!/^\d{10}$/.test(contact1)) {
      toast.error("Contact number must be 10 digits", { theme: "light", position: "top-center" });
      return;
    }
    if (!/^\d{10}$/.test(contact2)) {
      toast.error("Contact number must be 10 digits", { theme: "light", position: "top-center" });
      return;
    }
 })
 }



 //Edit table data....
 const handleEditClick = (dealerId, currentName,currentContact1,currentContact2,currentCompany,currentRemark) => {
  setEditingDealerId(dealerId);
  setNewDealerName(currentName);
  setnewContact1(currentContact1);
  setnewContact2(currentContact2);
  setnewcompany(currentCompany);
  setnewRemark(currentRemark);
};



//Update table data....
const handleUpdateClick = (dealerId) => {
  axios.put(`http://127.0.0.1:8000/dealer/dealerupdate/${dealerId}/`, {
    Dealer_Name: newDealerName,
    contactno1: newcontact1,
    contactno2: newcontact2,
    companyName: newcompany,
    Remark:newrmark
  },{headers})
    .then((res) => {
      setfetchDealers((prevDealers) =>
        prevDealers.map((dealer) =>
          dealer.id === dealerId ? { ...dealer, Dealer_Name: newDealerName,contactno1:newcontact1,contactno2:newcontact2,companyName:newcompany,Remark:newrmark } : dealer
        )
      );

      setEditingDealerId(null);
      setNewDealerName('');
      setnewContact1('')
      setnewContact2('')
      setcompanyName('')
      setRemark('')
    })
    .catch((err) => toast.error("something went wrong"));
};


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
      return -1;
  }
  if (b[orderBy] > a[orderBy]) {
      return 1;
  }
  return 0;
}


const [arr,setArr]= useState('')



//for refeshing button 
const refreshBtn=()=>{
   getData()
}

//Groups of buttons...
const [anchorEl, setAnchorEl] = React.useState(null);
const open = Boolean(anchorEl);
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};

return (
    <Paper sx={{ width:'100%', overflow: 'hidden', }}>
  
 <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dealer Entry" subtitle={'Entry of Dealer Name' } />
        </Box>
      {/* First Box*/}
      <Box
           backgroundColor='#F0F8FF'
          padding={'1.5rem'}
          m={'0px 0px 12px'}
          borderRadius={'1%'}
          boxShadow={'12'}>
          
          <Box
              display="grid"
              gap="12px"
              gridTemplateColumns="repeat(5, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
             
            >
              <Box sx={{ fontWeight: 'bold'}} >
            Dealer Name
            <Box>  
             <TextField  
                width='2px'
                size='small'
                type="text"
                // onBlur={handleBlur}
                value={dealername}
                onChange={(e)=>setDealername(e.target.value)}
               
                InputProps={{sx:{height:'35px'}}}
              />
              </Box>
           </Box>
           <Box sx={{ fontWeight: 'bold' }}>
            Contactno1  
            <Box>
             <TextField  
                
                type="text"
                // onBlur={handleBlur}
                value={contact1}
                onChange={(e)=>setcontact1(e.target.value)}
               
                InputProps={{sx:{height:'35px'}}}
              />
              </Box>
           </Box>
           <Box sx={{ fontWeight: 'bold' }}>
            Contactno2 
            <Box>
             <TextField  
                
                type="text"
                // onBlur={handleBlur}
                value={contact2}
                onChange={(e)=>setcontact2(e.target.value)}
               
                InputProps={{sx:{height:'35px'}}}
              />
              </Box>
           </Box>
           <Box sx={{ fontWeight: 'bold' }}>
            Company Name 
            <Box>
             <TextField  
                type="text"
                // onBlur={handleBlur}
                value={companyName}
                onChange={(e)=>setcompanyName(e.target.value)}
               
                InputProps={{sx:{height:'35px'}}}
              />
              </Box>
           </Box>
           <Box sx={{ fontWeight: 'bold' }}>
            Remark  
            <Box>
             <TextField  
                
                type="text"
                // onBlur={handleBlur}
                value={remark}
                onChange={(e)=>setRemark(e.target.value)}
               
                InputProps={{sx:{height:'35px'}}}
              />
              </Box>
           </Box>
           <Box  sx={{display:'flex',justifyContent:'flex-end',gridColumn: "span 5"}} >
           <Button
                sx={{backgroundColor: '#233044',
                  '&:hover':{
                    backgroundColor:'#233044',
                    color:'#fff',
                    fontSize: "12px",
                  fontWeight: "bold",
                  },
                  color:'#fff' ,
                  fontSize: "12px",
                  fontWeight: "bold",
                  height:'35px',
                  margin:'0px 5px 2px 5px'
                 
                 }}
                 
                 type='submit'
                 onClick={dialogbox}
              ><UploadIcon fontSize='small'  />Bulk Upload
              </Button> 
           
              <Button
                sx={{backgroundColor: '#233044',
                  '&:hover':{
                    backgroundColor:'#233044',
                    color:'#fff',
                    fontSize: "12px",
                  fontWeight: "bold",
                  },
                  color:'#fff' ,
                  fontSize: "12px",
                  fontWeight: "bold",
                  height:'35px',
                  margin:'0px 5px 2px 5px'
                 
                 }}
                 
                 type='submit'
                 onClick={handleSubmit}
              >Add
              </Button>
              </Box>
           </Box>
           </Box>
        {/* Row 2 */}
       
        <Box
          
          backgroundColor='#F0F8FF'
          boxShadow={'5'}
        >
          <Box padding={'5px'} style={{display:'flex',justifyContent:'flex-end'}}  display={'relative'}
        zIndex={'12'}> <Search sendData={setSearch}/>
        
    <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{backgroundColor: '#233044',
        '&:hover':{
          backgroundColor:'#233044',
          color:'#fff',
          fontSize: "12px",
        fontWeight: "bold",
        },
        color:'#fff' ,
        fontSize: "12px",
        fontWeight: "bold",
        height:'35px',
        margin:'0px 5px 2px 5px'
       
       }}
      >
        <CSVLink filename="Dealers_Details" style={{textDecoration:'none',color:'#fff'}} data={fetchDealer}>Export</CSVLink>
     
</Button>     
     

        <Box ><Button 
           sx={{backgroundColor: '#233044',
            '&:hover':{
              backgroundColor:'#233044',
              color:'#fff',
              fontSize: "12px",
            fontWeight: "bold",
            },
            color:'#fff' ,
            fontSize: "12px",
            fontWeight: "bold",
            height:'35px',
            margin:'0px 5px 2px 5px'
           
           }}
        
         onClick={refreshBtn}
         type='button'
        ><RefreshIcon fontSize='small'/>refresh</Button></Box> 
         </Box>

      
      <Box
        height="1%"
        display={'relative'}
        zIndex={'-1'}
      >
        <TableContainer sx={{overflowY: 'auto',height: '70vh', width: '100%' }} >
        <Table stickyHeader aria-label="sticky table" size='small'>
          <TableHead >
            
            <TableRow >
              {columns.map((column) => (
                <TableCell
                size='small'
                  key={column.id}
                  align={'center'}
                  style={{ minWidth: column.minWidth,minHeight:10,background: '#233044' ,color:'#fff',fontFamily:'sans-serif',fontWeight:'bold',border:'1px solid white' }}     
               >
                {column.label} 
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody >
          {
            fetchDealer.slice(page*rowsPerPage,page*rowsPerPage+rowsPerPage).map((dealer,index) => {
            return(
            <TableRow key={dealer.id} style={index % 2 ? { background: "#e3ebf3" } : { background: "#fff" }}>
              <TableCell align='center' inputprops={{height:'2px'}}>
                {editingDealerId === dealer.id ? (
                  <TextField
                    value={newDealerName}
                    onChange={(e) => setNewDealerName(e.target.value)}   
                  />
                ) : (
                  dealer.Dealer_Name
                )}
              </TableCell>
              <TableCell align='center' inputprops={{height:'2px'}}>
                {editingDealerId === dealer.id ? (
                  <TextField
                    value={newcontact1}
                    onChange={(e) => setnewContact1(e.target.value)}   
                  />
                ) : (
                  dealer.contactno1
                )}
              </TableCell>
              <TableCell align='center' inputprops={{height:'2px'}}>
                {editingDealerId === dealer.id ? (
                  <TextField
                    value={newcontact2}
                    onChange={(e) => setnewContact2(e.target.value)}   
                  />
                ) : (
                  dealer.contactno2
                )}

              </TableCell>
              <TableCell align='center' inputprops={{height:'2px'}}>
                {editingDealerId === dealer.id ? (
                  <TextField
                    value={newcompany}
                    onChange={(e) => setnewcompany(e.target.value)}   
                  />
                ) : (
                  dealer.companyName
                )}
              </TableCell>
              <TableCell align='center' inputprops={{height:'2px'}}>
                {editingDealerId === dealer.id ? (
                  <TextField
                    value={newrmark}
                    onChange={(e) => setnewRemark(e.target.value)}   
                  />
                ) : (
                  dealer.Remark
                )}
              </TableCell>
              
              
              <TableCell align='center' inputprops={{height:'2px'}}>
                {editingDealerId === dealer.id ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateClick(dealer.id)}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => handleEditClick(dealer.id, dealer.Dealer_Name,dealer.contactno1,dealer.contactno2,dealer.companyName,dealer.Remark)}
                    style={{backgroundColor:'#070F2B'}}
                    size='small'
                  >
                    <EditIcon/>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )})}
          
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
                   rowsPerPageOptions={[25,50,100,150,200]}
                   rowsPerPage={rowsPerPage}
                   page={page}
                   count={fetchDealer.length}
                   component="div"
                   onPageChange={handlechangepage}
                   onRowsPerPageChange={handleRowsPerPage}>
      </TablePagination>
    </Box>
    {/* Row 3 */}
    </Box>
          </Box>
          <UploadEx
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          />
    </Paper>
  );
}































