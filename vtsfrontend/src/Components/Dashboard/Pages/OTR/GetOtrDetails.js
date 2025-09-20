import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {  TextField, Button, Menu,MenuItem, IconButton } from '@mui/material';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import {CSVLink,CSVDownload} from 'react-csv';
import { Box } from '@mui/material';
// import Dateview from './DateView';

import  '../Manages/Installation/install.css';
import Header from '../../Header';
import { useTheme ,Typography} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Dateview from '../Manages/Installation/DateView';
import EditIcon from '@mui/icons-material/Edit';
import Search from '../Manages/Installation/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
// import Updatemillers from './Updatemillers';
import UploadIcon from '@mui/icons-material/Upload';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import UploadCSV from './UploadCSV';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ExportButton from './ExportButton';
import UpdateOtr from './UpdateOtr';
import DeleteBox from './DeleteBox';
import {CircularProgress} from '@mui/material';

export default function GetOtrDetails() {
  const [hide,setHide]=useState(true)
  const [startDate,setStartRange]=React.useState(new Date())
  const [endDate,setEndRanges]=React.useState(new Date())
const columns = [ 
{id:'update',label:'Action',minWidth:70,align:'right',},
{id: 'MILLER_TRANSPORTER_ID',label: 'Miller/Transporter-Id',minWidth: 170,align: 'right',}, 
{id: 'MILLER_NAME',label: 'Millers Name',minWidth: 100,align: 'right',},  
{id: 'MillerContactNo',label: ' ContactNo',minWidth: 100,align: 'right',},  
{id: 'district',label: 'District',minWidth: 100,align: 'right',},     
{id:'Dealer_Name',label:'Dealer Name',minWidth:100,align:'right',},
{id:'Entity_id',label:'Entity id',minWidth:100,align:'right',},
{id:'GPS_IMEI_NO',label:'GPS IMEI NO',minWidth:100,align:'right',},
{id:'Device_Name',label:'Device Name',minWidth:100,align:'right',},
{id:'NewRenewal',label:'NewRenewal',minWidth:100,align:'right',},
{id:'OTR',label:'OTR',minWidth:100,align:'right',},
{id:'vehicle1',label:'Vehicle 1',minWidth:80,align:'right',},
{id:'vehicle2',label:'Vehicle 2',minWidth:80,align:'right',},
{id:'vehicle3',label:'Vehicle 3',minWidth:80,align:'right',},
{id:'InstallationDate',label:'InstallationDate',minWidth:100,align:'right',},
{id:'Employee_Name',label:'Employee Name',minWidth:120,align:'right',},
{id:'Device_Fault',label:'Device Fault',minWidth:100,align:'right',},
{id:'Fault_Reason',label:'Fault Reason',minWidth:100,align:'right',},
{id:'Replace_DeviceIMEI_NO',label:'Replace DeviceIMEI NO',minWidth:170,align:'right',},
{id:'ExpiryDate',label:'Expiry Date',minWidth:100,align:'right',},
{id:'extendedMonth',label:'Extended Month',minWidth:120,align:'right',},
{id:'nextExpirydate',label:'Next Expiry date',minWidth:120,align:'right',},

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
  const[value, setValue] = React.useState(1);
  const[search,setSearch]=React.useState('')
  const[editedRows, setEditedRows] = useState([]);
  const[editingDealerId, setEditingDealerId] = useState(null);
  const[newDealerName, setNewDealerName] = useState('');
  const[fetchMldetails,setmlDetails]=useState([])
 const[refresh,setRefresh]=React.useState('')
 const[mlID,setMlID]=useState('')
 const[ContactNo,setContactNo]=useState('')
 const[districts,setdistrict]=useState('')
 const[millername,setMillerName]=useState('')
 const[recordForEdit, setRecordForEdit] = useState(null)
 const[openPopup, setOpenPopup] = useState(false)
 const[openDialog,setOpenDialog] = useState(false)
 const[loading,setLoading]=useState(false)
 const[deleteId,setdeleteId]=useState(null)
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

const deletePopup = item =>{
  setdeleteId(item)
  setOpenDialog(true)
}

//Get data form dealers table.


  //post dealer data
 
  const getData = async (start, end) => {
    setLoading(true);
    try {
      // Function to format the date to 'DD-MM-YYYY'
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns month from 0-11
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
  
      const formattedStartDate = start ? formatDate(start) : undefined;
      const formattedEndDate = end ? formatDate(end) : undefined;
  
      const response = await axios.get(`${baseUrl}/otrentries/getallotr`, {
        params: {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        },
      headers:headers
      },);
  
      setRows(response.data);
    
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally {
      setLoading(false);
    }
  };
    React.useEffect(() => {
      getData(startDate, endDate);
    }, [startDate, endDate]);  








 //Edit table data....
 const handleEditClick = (dealerId, currentName) => {
  setEditingDealerId(dealerId);
  setNewDealerName(currentName);
};



//Update table data....


  


const [arr,setArr]= useState('')


//Search code...
const filterData=()=>{
  if (!search ) {
    return rows;
  }

  return rows.filter((item) => {
  
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

const pdfs = () => {
  const doc = new jspdf({orientation:'landscape'});
  doc.text('OTR Report', 12, 10);
  doc.autoTable({
    columns: columns.map(col => ({ 
      header: col.label, 
      dataKey: col.id, 
      columnWidth: 5 // or a specific width, e.g. 50
      
    })),

    tableLineWidth: 0,
   
    pageSize:'A0',
    cellWidth: 8,
    body: rowsData,
    headStyles: {
      fontSize: 8.5, // adjust font size to fit the width
      halign: 'center', // center the header text
      margin: { top: 1, },  
      
      lineColor: [0, 0, 0] // black border
    },
    theme: 'grid', // or 'triped' or 'plain'
    startY: 15,
    // split overflowing columns into pages
    horizontalPageBreak: true,
    horizontalPageBreakBehaviour: 'immediately',
  });
  doc.save('OTR Report.pdf');
};

//Groups of buttons...
const [anchorEl, setAnchorEl] = React.useState(null);
const open = Boolean(anchorEl);
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl(null);
};

const DateFilter = (start,end) => {
  useEffect(() => {
    if (start && end) {
      setStartRange(start);
      setEndRanges(end);
    }
  },[]
)}


 // filter according to date 
//  const dateFilter =(start,end)=>{
//   setStartRange(start)
//   setEndRanges(end)
  
// }
return (
  <>
      <Box m="9px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title="OTR Details" subtitle={'Entry of OTR Details' } />
          <Box>
            <ExportButton />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor="#F0F8FF"
          p="1px"
          boxShadow="12"
        

        >
          <Box
            display="grid"
            gap="5px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            position={'relative'}
            zIndex={'12'}
          >
            <Box sx={{ gridColumn: 'span 2', padding: "15px 15px 0px 0px" }}>
              <Search sendData={setSearch} />
            </Box>
            <Box sx={{gridColumn: 'span 2', margin:'0px 0px 0px 5px',display:'flex',justifyContent:'flex-end' }}>
         
            <Dateview getData={DateFilter}/>
               {/* Export Button */}
               <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{backgroundColor: '#1B1A55',
        '&:hover':{
          backgroundColor:'#1B1A55',
          color:'#fff',
          fontSize: "12px",
        fontWeight: "bold",
       
        },
        color:'#fff' ,
        fontSize: "12px",
        fontWeight: "bold",
        height:'30px',
         margin:'25px 0px 0px 2px'
       
       }}
      >
         <CSVLink filename="OTR_report.csv"  data={rowsData} style={{textDecoration:'none',color:'inherit'}}>Export</CSVLink>
      </Button>
      
    
              <Button 
       sx={{
        backgroundColor: '#fff',
        color: 'black',
        border: '2px solid blue',
        fontSize: "12px",
        fontWeight: "bold",
        height: '30px',
        margin: '25px 0px 0px 5px'
      }}
         type='button'
         onClick={refreshBtn}
        >refresh</Button>
            </Box>
            
          </Box>
          <Box m="0.1rem 0.2rem"  sx={{height:'90%',overflow:'scroll',position:'relative',zIndex:'2'}}>
           
          <TableContainer sx={{overflowY: 'auto',height: '70vh', width: '100%'}}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align="center"
                  sx={{
                    minWidth: column.minWidth,
                    background: '#233044',
                    color: '#fff',
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                    border: '1px solid white'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody >
          {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : rows.length === 0 ? (
                
              <TableRow>
              <TableCell colSpan={10} align="center">
                <Typography variant="body1">No data found</Typography>
              </TableCell>
            </TableRow>
                
            ) : (
            rowsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => (
              <TableRow  hover role="checkbox"  tabIndex={-1} key={row.id} style={index % 2 ? { background: "#e3ebf3" } : { background: "#fff" }} size="small">
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align="center" >
                      {column.id === 'update' ? (
                        <>
                        <IconButton onClick={() => openInPopup(row.id)}>
                          <EditIcon fontSize='small' sx={{color:'grey'}}/>
                        </IconButton>
                        <IconButton onClick={() => deletePopup(row.id)}>
                          <DeleteIcon fontSize='small' sx={{color:'grey'}}/>
                        </IconButton>
                      </>
                      ) : (
                        value
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
                   rowsPerPageOptions={[25,50,100,150]}
                   rowsPerPage={rowsPerPage}
                   page={page}
                   count={rows.length}
                   component="div"
                   onPageChange={handlechangepage}
                   onRowsPerPageChange={handleRowsPerPage}>
      </TablePagination>
          </Box>
        </Box>
      </Box>
 
  <UpdateOtr
     setRecordForEdit={recordForEdit}
     openPopup={openPopup}
     setOpenPopup={setOpenPopup}
    />
    <DeleteBox 
      setdeleteId={deleteId}
      openDialog={openDialog}
      setOpenDialog={setOpenDialog}
    />
    </>
  );
}


































