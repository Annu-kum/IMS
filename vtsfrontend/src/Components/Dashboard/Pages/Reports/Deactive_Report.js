import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Dateview from '../Manages/Installation/DateView';

import {CSVLink,CSVDownload} from 'react-csv';
import  {useTheme } from '@mui/material';
import {
 
  GridToolbarContainer,
  
  GridToolbarFilterButton,
 
} from '@mui/x-data-grid';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import Search from '../Manages/Installation/Search';
import '../Manages/Installation/install.css'
import {TextField,TableCell,TableRow,TableContainer,Table,TableHead,TableSortLabel,TableBody,TablePagination} from '@mui/material';
import axios from 'axios';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RefreshIcon from '@mui/icons-material/Refresh';
import {CircularProgress} from '@mui/material';
import { useAuth } from '../../../account/AuthContext';


export default function DeactivationReport() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [DataFromChild,setDataFromChild]=React.useState('')
  const theme = useTheme()
  const [page,pageChange]=React.useState(0);
  const[rowsPerPage,rowperpagechange]=React.useState(25);
  const [loading, setLoading] = React.useState(true);
  const [order, setOrder] = React.useState()
  const [orderBy, setOrderBy] = React.useState()
  const [startDate,setStartRange]=React.useState(new Date())
  const [endDate,setEndRanges]=React.useState(new Date())
  const [search,setSearch]=React.useState('')
   const [datacount,setDatacount]=React.useState(0)
   
   const{auth} = useAuth();
 //columns of the table...

const adminMaincolumn = [
    { field: 'Entity_id',align:'center', label: 'Entity Id', width: 100,  },
  { field: 'district',align:'center',  label: 'District', width: 100, sx:{fontFamily:'cursive'} },
  { field: 'GPS_IMEI_NO',align:'center', label: 'GPS IMEI NO', width: 100,  },
  { field: 'SIM_NO',align:'center',  label: 'SIM NO', width: 100, },
  { field: 'Device_Name',align:'center', label: 'Device Name', width: 100, },
  { field: 'Dealer_Name',align:'center', label: 'Dealer Name', width: 100,  },
  { field: 'NewRenewal',align:'center', label: 'New/Renewal', width: 100, },
  { field: 'OTR',align:'center',label: 'OTR', width: 100, },
  { field: 'vehicle1',align:'center',  label: 'Vehicle No 1', width: 100, },
  { field: 'vehicle2',align:'center',  label: 'Vehicle No 2', width: 100,  },
  { field: 'vehicle3',align:'center',  label: 'Vehicle No 3', width: 100,  },
  { field: 'MILLER_TRANSPORTER_ID', align:'center',label: 'Miller/Transporter Id', width: 100,},
  { field: 'MILLER_NAME',align:'center',  label: 'Miller/Transporter Name', width: 100, },
  { field: 'MillerContactNo',align:'center', label: 'MillerContactNo', width: 100, },
  { field: 'DeactivationDate',align:'center',  label: 'Deactivation Date', width: 100 },
  { field: 'Employee_Name',align:'center',  label: 'Entry Employee Name', width: 100,  },
  { field: 'Device_Fault',align:'center',  label: 'Device Fault' ,width:100,  },
  { field: 'Fault_Reason',align:'center', label: 'Fault Reason', width: 100,  },
  { field: 'Replace_DeviceIMEI_NO',align:'center', label: 'Replace Device IMEI No', width: 100,  },
  { field: 'Remark1', align:'center',label: 'Remark 1', width: 100, },
  { field: 'Remark2',align:'center', label: 'Remark 2', width: 100, },
  { field: 'Remark3',align:'center', label: 'Remark 3', width: 100,},
]; 
 //columns of the table...
 const userColumn = [
  { field: 'Entity_id',align:'center', label: 'Entity Id', width: 100,  },
  { field: 'district',align:'center',  label: 'District', width: 100, sx:{fontFamily:'cursive'} },
  { field: 'GPS_IMEI_NO',align:'center', label: 'GPS IMEI NO', width: 100,  },
  { field: 'vehicle1',align:'center',  label: 'Vehicle No 1', width: 100, },
  { field: 'vehicle2',align:'center',  label: 'Vehicle No 2', width: 100,  },
  { field: 'vehicle3',align:'center',  label: 'Vehicle No 3', width: 100,  },
  { field: 'MILLER_TRANSPORTER_ID', align:'center',label: 'Miller/Transporter Id', width: 100,},
  { field: 'MILLER_NAME',align:'center',  label: 'Miller/Transporter Name', width: 100, },
  { field: 'MillerContactNo',align:'center', label: 'MillerContactNo', width: 100, },
  { field: 'DeactivationDate',align:'center',  label: 'Deactivation Date', width: 100 },
  { field: 'Replace_DeviceIMEI_NO',align:'center', label: 'Replace Device IMEI No', width: 100,  },
  { field: 'Remark1', align:'center',label: 'Remark 1', width: 100, },
  { field: 'Remark2',align:'center', label: 'Remark 2', width: 100, },
  { field: 'Remark3',align:'center', label: 'Remark 3', width: 100,},
];

const token = localStorage.getItem('Token');
 const headers = {
   'content-type': 'application/json',
   'Authorization': `Token ${token}`,
   'Accept': 'application/json',
 };




const getData = async (start, end) => {
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

    const response = await axios.get(`http://127.0.0.1:8000/deactivation/getdeactivatedetai/`, {
      params: {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
 page: page + 1,        // Backend usually expects 1-based page
          page_size: rowsPerPage,
          search:search
      },
      headers
    });

    setRows(response.data.results);
    setDatacount(response.data.count)
  } catch (error) {
    toast.error("something went wrong");
  }finally{
    setLoading(false)
  }
};
  React.useEffect(() => {
    getData(startDate, endDate);
  }, [startDate, endDate,page,rowsPerPage,search]);



const refreshBtn=()=>{
  getData()
}
  const handlechangepage=(event,newPage)=>{
    pageChange(newPage)
  }
  const handleRowsPerPage =(e)=>{
    rowperpagechange(+e.target.value)
    pageChange(0)
  }

 
 
  

  //Groups of buttons...
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
 
  //Get data From search bar....
  const rowStyles = {
    redRow: {
      backgroundColor: 'red',
      color: 'white',
    },
  };

 
  // filter according to date 
  const DateFilter = (start,end) => {
           
     setStartRange(start);
    setEndRanges(end);

}

  const [value, setValue] = React.useState(1);
const [csvdatas,setCSVdata]=React.useState([])
  const csvLinkRef = React.useRef();
    const handleExport = async () => {
    try {
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
  
      const formattedStartDate = startDate ? formatDate(startDate) : undefined;
      const formattedEndDate = endDate ? formatDate(endDate) : undefined;
  
      const response = await axios.get(`http://127.0.0.1:8000/deactivation/getdeactivatedetai/`, {
        params: {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          export: true,
          search: search
        },
        headers
      });
  
      setCSVdata(response.data);
  
      // Delay export trigger after state is updated
      setTimeout(() => {
        if (csvLinkRef.current) {
          csvLinkRef.current.link.click();
        }
      }, 100); // Delay to ensure setCSVdata has taken effect
  
    } catch (error) {
      toast.error("Export failed");
    }
  };

 const adminHeader=[
  { key: 'SIM_NO',align:'center',  label: 'SIM NO', width: 100, },
  { key: 'Device_Name',align:'center', label: 'Device Name', width: 100, },
  { key: 'Dealer_Name',align:'center', label: 'Dealer Name', width: 100,  },
  { key: 'NewRenewal',align:'center', label: 'New/Renewal', width: 100, },
  { key: 'OTR',align:'center',label: 'OTR', width: 100, },
  { key: 'Employee_Name',align:'center',  label: 'Entry Employee Name', width: 100,  },
  { key: 'Device_Fault',align:'center',  label: 'Device Fault' ,width:100,  },
  { key: 'Fault_Reason',align:'center', label: 'Fault Reason', width: 100,  },
 ]  

 

const basecsvHeaders = [
{ key: 'Entity_id',align:'center', label: 'Entity Id', width: 100,  }, 
{ key: 'district',align:'center',  label: 'District', width: 100, sx:{fontFamily:'cursive'} },
{ key: 'GPS_IMEI_NO',align:'center', label: 'GPS IMEI NO', width: 100,  },
{ key: 'vehicle1',align:'center',  label: 'Vehicle No 1', width: 100, },
{ key: 'vehicle2',align:'center',  label: 'Vehicle No 2', width: 100,  },
{ key: 'vehicle3',align:'center',  label: 'Vehicle No 3', width: 100,  },
{ key: 'MILLER_TRANSPORTER_ID', align:'center',label: 'Miller/Transporter Id', width: 100,},
{ key: 'MILLER_NAME',align:'center',  label: 'Miller/Transporter Name', width: 100, },
{ key: 'MillerContactNo',align:'center', label: 'MillerContactNo', width: 100, },
{ key: 'DeactivationDate',align:'center',  label: 'Deactivation Date', width: 100 },
{ key: 'Replace_DeviceIMEI_NO',align:'center', label: 'Replace Device IMEI No', width: 100,  },
{ key: 'Remark1', align:'center',label: 'Remark 1', width: 100, },
{ key: 'Remark2',align:'center', label: 'Remark 2', width: 100, },
{ key: 'Remark3',align:'center', label: 'Remark 3', width: 100,},
];

const csvHeaders=auth.isSuperuser?[...adminHeader,...basecsvHeaders]:[...basecsvHeaders]
const columns=auth.isSuperuser?[...adminMaincolumn]:[...userColumn]





  return (
    <>
       {/* First Box*/}
       <Box
            backgroundColor='#F0F8FF'
           padding={'0rem'}
           m={'0px 0px 1px'}
           borderRadius={'1%'} 
           alignItems='flex-end'  
           position={'relative'}
           zIndex={'12'} 
         > 
           <Box
               display="grid"
               gridTemplateColumns="repeat(2, minmax(0, 1fr))"
               sx={{
                //  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
               }}
             >
     
             <Box p='10px'>
             <Search sendData={setSearch}/>
             </Box>
             <Box p='2px' sx={{display:'flex',justifyContent:'flex-end'}}  >
             
               <Dateview getData={DateFilter}/>
             
             {/* Export Button */}
    <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleExport}
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
        margin:'25px 0px 0px 0px'
       
       }}
      >
      Export
      </Button>
 <CSVLink filename="Deactivation_report.csv" headers={csvHeaders}  data={csvdatas}
  ref={csvLinkRef}
  target="_blank" />

      <Box ><Button 
       sx={{
        backgroundColor: '#fff',
        color: 'black',
        border: '2px solid blue',
        fontSize: "12px",
        fontWeight: "bold",
        height: '30px',
        margin: '25px 0px 0px 5px'
      }}
        onClick={refreshBtn}
         type='button'
        ><RefreshIcon fontSize='small'/>refresh</Button></Box>    
              
    </Box>  
             <Box> 
          
               </Box>
               </Box>
               </Box>  
         {/* Row 2 */}
         <Box
           
           backgroundColor='#F0F8FF'
         
           boxShadow={'5'}
         >
           
         
       <Box
         height="100%"
         width="100%"
       >
         <TableContainer sx={{overflowY: 'auto',height: '70vh', width: '100%'}}>
         {/* <TableContainer sx={{ maxHeight: "100%", borderRadius:'1%' }}> */}
      <Table stickyHeader aria-label="sticky table" size='small'>
        <TableHead>
          <TableRow>
            {columns.map((headCell) => (
              <TableCell 
                size='small'
                key={headCell.field}
                align={headCell.align}
                style={{ width: headCell.width, minHeight: 10, background: '#233044', color: '#fff', fontFamily: 'sans-serif', fontWeight: 'bold', border: '1px solid white' }}
              >
                {headCell.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) :
                rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                       No data found
                    </TableCell>
                  </TableRow>
                ) : (
         rows && rows.slice(page*rowsPerPage,page*rowsPerPage+rowsPerPage).map((row, index) => (
            <TableRow key={index} style={index % 2 ? { background: "#e3ebf3" } : { background: "#fff" }}>
              {columns.map((column) => (
                <TableCell key={column.field} align={column.align}>
                  {row[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))
          )}
        </TableBody>
      </Table>
       </TableContainer>
       <TablePagination
                    rowsPerPageOptions={[25,50,100,150]}
                    component="div"
                    count={datacount}
                    page={page}
                    onPageChange={handlechangepage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPage}
                >

                </TablePagination>
 
       </Box>
     </Box>
    
 
     {/* Row 3 */}
     
           </>
  );
}
