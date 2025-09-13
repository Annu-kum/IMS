import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {  TextField, Button, Menu,MenuItem } from '@mui/material';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import {CSVLink,CSVDownload} from 'react-csv';
import { Box } from '@mui/material';
// import Dateview from './DateView';

import  '../Manages/Installation/install.css';
import Header from '../../Header';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

import EditIcon from '@mui/icons-material/Edit';
import Search from '../Manages/Installation/Search';

import RefreshIcon from '@mui/icons-material/Refresh';
import Updatemillers from './Updatemillers';
import UploadIcon from '@mui/icons-material/Upload';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadCSV from './UploadCSV';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';


export default function MealersEntry() {
  const [hide,setHide]=useState(true)
const columns = [ 
{id: 'MILLER_TRANSPORTER_ID',label: 'Miller-Id',minWidth: 170,align: 'right',}, 
{id: 'MILLER_NAME',label: 'Millers Name',minWidth: 170,align: 'right',},  
{id: 'ContactNo',label: 'Contact No',minWidth: 170,align: 'right',},  
{id: 'district',label: 'District',minWidth: 170,align: 'right',},     
{id:'update',label:'Update',minWidth:170,align:'right',}
];


const initialRow = {
    MILLER_TRANSPORTER_ID:'',
    MILLER_NAME:'',
    ContactNo:'',
    district:'',
};


const baseUrl= 'http://127.0.0.1:8000'



  const [page,pageChange]=React.useState(0);
  const[dealername,setDealername]=useState('')
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
  const[fetchMldetails,setmlDetails]=useState([])
 const [refresh,setRefresh]=React.useState('')
 const [mlID,setMlID]=useState('')
 const[ContactNo,setContactNo]=useState('')
 const[districts,setdistrict]=useState('')
 const[millername,setMillerName]=useState('')
 const [recordForEdit, setRecordForEdit] = useState(null)
 const [openPopup, setOpenPopup] = useState(false)
 const  [openDialog,setOpenDialog] = useState(false)
 const token = localStorage.getItem('Token');
 const headers = {
   'content-type': 'application/json',
   'Authorization': `Token ${token}`,
   'Accept': 'application/json',
 };
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


  const openInPopup = item => {
    setRecordForEdit(item)
    setOpenPopup(true)
}

const dialogbox=()=>{
  setOpenDialog(true)
}

//Get data form dealers table.
const getData = async ()=>{
  const response = await axios.get(`${baseUrl}/millers/getmillerss/`,{headers})
  setmlDetails(response.data.results)
 }
useEffect(()=>{
  getData()
},[])

  //post dealer data
 const handleSubmit=(event)=>{
   event.preventDefault();
   const isDuplicate = fetchMldetails.some(detail => detail.MILLER_TRANSPORTER_ID === mlID);
  
  if (isDuplicate) {
    toast.error("Duplicate Miller/Transport ID", { theme: "light", position: "top-center" });
    return;
  }
 
  axios.post(`${baseUrl}/millers/postmiller/`,{
    MILLER_TRANSPORTER_ID:mlID,
    MILLER_NAME: millername,
    ContactNo: ContactNo,
    district:districts 
  },{headers}).then((res)=>{
    toast.success("Data saved",{theme:"light",position:"top-center"})
    setRows(res.data)
    setMlID('')
    setMillerName('')
    setContactNo('')
    setdistrict('')
  }).catch(err=>{
    const isDuplicate = fetchMldetails.some(detail => detail.ContactNo === ContactNo);
    if (!/^\d{10}$/.test(ContactNo)) {
      toast.error("Contact number must be 10 digits", { theme: "light", position: "top-center" });
      return;
    }
    else if(isDuplicate) {
      toast.error("Duplicate Contact No", { theme: "light", position: "top-center" });
      return;
    }
  })
  
 }







 //Edit table data....
 const handleEditClick = (dealerId, currentName) => {
  setEditingDealerId(dealerId);
  setNewDealerName(currentName);
};



//Update table data....


  const handleSortRequest = cellId => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(cellId)
}
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getComparator(order, orderBy) {
  return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

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


//Search code...
const filterData=()=>{
  if (!search ) {
    return fetchMldetails;
  }

  return fetchMldetails.filter((item) => {
  
    let searchFilter = true;
    if (search) {
      searchFilter = Object.values(item).some(value => 
        String(value).toLowerCase().includes(search.toLowerCase())
      );
    }
    return  searchFilter;
  });
}

const rowsData=filterData()

//for refeshing button 
const refreshBtn=()=>{
   getData()
}

function pdfs(){
  const doc=new jspdf({orientation:'portrait'})
  doc.text('Millers Detail',12,8)
  doc.autoTable({
    theme:'grid',
      columns:[
        {header:'Miller_Transporter_Id',dataKey:'MILLER_TRANSPORTER_ID'},
        {header:'Miller_Name',dataKey:'MILLER_NAME'},
        {header:'Contact No',dataKey:'ContactNo'},
        {header:'district',dataKey:'district'},
      ],

  
    tableLineWidth: 0,
    alignItems:'center',
    pageSize:'A0',
    cellWidth: 8,
    body: rowsData,

    headStyles: {
      fontSize: 8, // adjust font size to fit the width
      halign: 'center', // center the header text
      margin: { top: 1, },  
    
      lineColor: [0, 0, 0] // black border
    },
    theme: 'grid', // or 'triped' or 'plain'
  });
  doc.save('Millers Detali.pdf');
}
//Groups of buttons...
const [anchorEl, setAnchorEl] = React.useState(null);
const open = Boolean(anchorEl);
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl(null);
};





return (
  <>
    <Paper sx={{ width:'100%', overflow: 'hidden', }}>
  
 <Box m="5px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Millers Entry" subtitle={'Entry of Millers Details' } />
        </Box>
      {/* First Box*/}


<Box
           backgroundColor='#F0F8FF'
          padding={'1.0rem'}
          m={'0px 0px 12px'}
          borderRadius={'1%'}
          boxShadow={'12'}
        >
          
          <Box
              display="grid"
              gap="10px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
           <Box sx={{ fontWeight: 'bold' }}>
               <label >Miller/Transporter_ID</label>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                required
                value={mlID}
                onChange={(e)=>setMlID(e.target.value)}
                sx={{ gridColumn:'span 4' ,color:'black'}}     
                InputProps={{sx:{height:'40px'}}}
              />
            </Box>
           
              
           <Box sx={{ fontWeight: 'bold' }}>
               <label>Miller/Transporter_Name</label>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                required
                value={millername}
                onChange={(e)=>setMillerName(e.target.value)
                
                }
                sx={{ gridColumn:'span 4' ,color:'black'}}
               
                InputProps={{sx:{height:'40px'}}}
              />
            </Box>
            <Box sx={{ fontWeight: 'bold' }}>
              <label>District</label>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                value={districts}
                onChange={(e)=>setdistrict(e.target.value)
                }
                required
                sx={{gridColumn:'Span 4' }}
                InputProps={{sx:{height:'40px'}}}
                // InputProps={{value:}}
              />
             
             </Box>
             <Box sx={{ fontWeight: 'bold' }}>
                <label>Contact No</label>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                value={ContactNo}
                onChange={(e)=>setContactNo(e.target.value)}
                sx={{ gridColumn: "span 4" }}
                required
                InputProps={{sx:{height:'40px'}}}
              />
            </Box>
             
       <Box  sx={{display:'flex',justifyContent:'flex-end',gridColumn: "span 4"}} >
       <Button
               sx={{backgroundColor: '#240750',
                '&:hover':{
                  backgroundColor:'#1B1A55',
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
                sx={{backgroundColor: '#240750',
                  '&:hover':{
                    backgroundColor:'#1B1A55',
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
        
        sx={{backgroundColor: '#240750',
        '&:hover':{
          backgroundColor:'#1B1A55',
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
        <CSVLink data={rowsData}  filename='Millers Data'  style={{textDecoration:'none',color:'#fff'}}>Export</CSVLink>
      </Button>
      
        <Box ><Button 
        sx={{backgroundColor: '#240750',
          '&:hover':{
            backgroundColor:'#1B1A55',
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
        height="100%"
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
         
          <TableBody>
            {stableSort(rowsData, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row,index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} style={index % 2 ? { background: "#e3ebf3" } : { background: "#fff" }}  align='center'>
                    {columns.map((column) => {
                      const value = row[column.id];
                      if (column.id === 'update') {
                        return (
                          <TableCell key={column.id} align={'center'} size='small'>
                            <Button
                              onClick={() => { openInPopup(row.MILLER_TRANSPORTER_ID) }}>
                            
                              <EditIcon />
                            </Button>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'MILLER_NAME' ? row.MILLER_NAME : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
                   rowsPerPageOptions={[25,50,100,150]}
                   rowsPerPage={rowsPerPage}
                   page={page}
                   count={fetchMldetails.length}
                   component="div"
                   onPageChange={handlechangepage}
                   onRowsPerPageChange={handleRowsPerPage}>
      </TablePagination>
    </Box>
    {/* Row 3 */}
    </Box>
          </Box>
    </Paper>

    <Updatemillers
                setRecordForEdit={recordForEdit}
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
            </Updatemillers>

            <UploadCSV 
            openDialog={openDialog}
            setOpenDialog={setOpenDialog} />

           
    </>
  );
}
































