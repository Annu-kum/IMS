import React, { useEffect } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dateview from '../Manages/Installation/DateView';
import {CSVLink} from 'react-csv';
import  { useTheme } from '@mui/material';
import 'jspdf-autotable';
import Search from '../Manages/Installation/Search';
import '../Manages/Installation/install.css'
import {TableCell,TableRow,TableContainer,Table,TableHead,TableSortLabel,TableBody,TablePagination} from '@mui/material';
import Header from '../../Header';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import DealerwiseReport from './DealerwiseReport';
import {CircularProgress,Typography} from '@mui/material';
import api from '../../../account/BaseApi';
import { all } from 'axios';





export default function DealerReport() {
  const [rows, setRows] = React.useState([]);
  const theme = useTheme()
  const [startDate,setStartDate]=React.useState(new Date())
  const [endDate,setEndDate]=React.useState(new Date())
  const [page,pageChange]=React.useState(0);
  const[rowsPerPage,rowperpagechange]=React.useState(25);
  const [order, setOrder] = React.useState()
  const [orderBy, setOrderBy] = React.useState()
  const [openPopup, setOpenPopup] = React.useState(false)
  const [selectedDealerName, setSelectedDealerName] = React.useState(null);
  const [loading,setLoading]=React.useState(true)
  const [type,setType] =React.useState('all')
  const [fetchSum,setfetchSum] =React.useState({
    total_count: 0,
    total_new: 0,
    total_renewal: 0,
    total_otr: 0,
  })
  
  const openInPopup = (dealerName,type) => {
    setSelectedDealerName(dealerName)
    setType(type)
    setOpenPopup(true)
}


const columns = [
  {
    field: 'dealername',
    label: 'Dealer Name',
    headerClassName: 'head',
    render: (rowData) => (
      <Link
        onClick={() => openInPopup(rowData.dealername, 'all')}
        style={{ textDecoration: 'none', color: 'black' }}
      >
        {rowData.dealername}
      </Link>
    ),
  },

  {
    field: 'totalcount',
    label: 'Total Count',
    headerClassName: 'head',
    render: (rowData) => (
      <Link
        onClick={() => openInPopup(rowData.dealername, 'all')}
        style={{ textDecoration: 'none', color: 'black' }}
      >
        {rowData.totalcount}
      </Link>
    ),
  },

  {
    field: 'newinstall',
    label: 'Total New Install',
    headerClassName: 'head',
    render: (rowData) => (
      <Link
        onClick={() => openInPopup(rowData.dealername, 'new')}
        style={{ textDecoration: 'none', color: 'black' }}
      >
        {rowData.newinstall}
      </Link>
    ),
  },

  {
    field: 'totalrenewal',
    label: 'Total Renewal',
    headerClassName: 'head',
    render: (rowData) => (
      <Link
        onClick={() => openInPopup(rowData.dealername, 'renewal')}
        style={{ textDecoration: 'none', color: 'black' }}
      >
        {rowData.totalrenewal}
      </Link>
    ),
  },

  {
    field: 'totalotr',
    label: 'Total OTR',
    headerClassName: 'head',
    render: (rowData) => (
      <Link
        onClick={() => openInPopup(rowData.dealername, 'otr')}
        style={{ textDecoration: 'none', color: 'black' }}
      >
        {rowData.totalotr}
      </Link>
    ),
  },
];


const token = localStorage.getItem('Token');
 const headers = {
   'content-type': 'application/json',
   'Authorization': `Token ${token}`,
   'Accept': 'application/json',
 };


  const getData = async (start, end) => {
  try {
    setLoading(true);

    // Function to format the date to 'DD-MM-YYYY'
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns month from 0-11
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const formattedStartDate = start ? formatDate(start) : undefined;
    const formattedEndDate = end ? formatDate(end) : undefined;

    // Fetch data
    const response = await api.get(`/otrdetails/dealerReport/`, {
      params: {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      },
      headers,
    });

    // Process response data
    const convertedData = Object.keys(response.data).map((key) => ({
      dealername: key,
      totalcount: response.data[key].total_count,
      newinstall: response.data[key].total_new,
      totalrenewal: response.data[key].total_renewal,
      totalotr: response.data[key].total_otr,
    }));

    setRows(convertedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false); // Ensure loading state is reset
  }
};

useEffect(()=>{
  getData(startDate,endDate)
},[startDate,endDate])



const refreshBtn=()=>{
   getData()
}


useEffect(() => {
  api.get(`/otrdetails/getSum/`,{headers}) 
  .then(response => {
    const data = response.data;
    if (data && data.overall_totals) {
      setfetchSum(data.overall_totals);
  } else {
      console.error('Invalid data format:', data);
  }
})
.catch(error => {
    console.error('Error fetching the dealer report:', error);
});
}, []);


  const handlechangepage=(event,newPage)=>{
    pageChange(newPage)
  }
  const handleRowsPerPage =(e)=>{
    rowperpagechange(+e.target.value)
    pageChange(0)
  }
 
  //columns of the table...


  //Groups of buttons...
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

 
  

  //Get data From search bar....
  const rowStyles = {
    redRow: {
      backgroundColor: 'red',
      color: 'white',
    },
  };

   const dateFilter = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  const [searchs,setSearch]=React.useState('')
  //Code for filtering data....
  const filterRowsBySearch = () => {

    return rows.filter((item) => {
      let searchFilter = true;
      if (searchs) {
        searchFilter = Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchs.toLowerCase())
        );
      }
      return searchFilter;
    });}
  //filterData of the rows...
  const filteredRows = filterRowsBySearch();

  const getRowClassName = (params) => {
    return params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd';
    
  };



  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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



return (
  <>  
  
 <Box m="3px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Dealer Wise Report" subtitle={''} />
      </Box>

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
             <Box padding={'10px'} 
        > <Search sendData={setSearch}/></Box>
               

             {/* Export Button */}
        <Box  p='1px' sx={{display:'flex',justifyContent:'flex-end',margin:'0px 0px 3px 0px',padding:'1px'}}  >
    <Dateview getData={dateFilter} />
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
          height:'30px',
          margin:'25px 0px 0px 0px'
         
         }}
      >
        <CSVLink data={rows} filename='DealerCount-Report'  style={{textDecoration:'none',color:'#fff'}}>Export</CSVLink>
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
          height:'30px',
          margin:'25px 0px 0px 5px'
         
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
           boxShadow={'12'}
         >
           
           
       <Box
         height="100%"
         width="100%"
       >
         <TableContainer sx={{overflowY: 'auto',height: '70vh', width: '100%' }}>
         <Table stickyHeader aria-label="sticky table" size='small'>
          
           <TableHead>
              <TableRow >
                {columns.map((headCell) => (
                  <TableCell
                    size='small'

                    key={headCell.field}
                    align={'center'}
                    sortDirection={orderBy === headCell.field ? order : false}
                   style={{ background: '#233044' ,color:'#fff',fontFamily:'sans-serif',fontWeight:'bold',border:'1px solid white' }}   
                  //  sortDirection={orderBy === column.field ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.field}
                      direction={orderBy === headCell.field ? order : 'asc'}
                      onClick={() => handleSortRequest(headCell.field)}
                      
                      sx={{
                          '& .MuiTableSortLabel-icon': {
                              color: 'white !important',
                          },
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                
              </TableRow>
            </TableHead>
            <TableBody>
            {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Typography variant="body1">No data found</Typography>
                  </TableCell>
                </TableRow>
              ):( 
              stableSort(filteredRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index} hover tabIndex={-1} style={index % 2 ? { background: "#e3ebf3" } : { background: "#fff" }}>
                      {columns.map((column) => (
                        <TableCell key={column.field} align={'center'} size='small'>
                          {column.render ? column.render(row) : row[column.field]}
                        </TableCell>
                      ))}
                    
                   
                  </TableRow>
                )))}
            </TableBody>
          
         </Table>
       </TableContainer>
         
       <Box sx={{backgroundColor:'##add4f8',display:'flex'}} > 
    
      <Box  align='center' style={{fontWeight:700,fontSize:'18px',color:'#1E201E',width:'50vh',backgroundColor:'#D1E9F6'}}>Total</Box>
      <Box align='center' style={{fontWeight:600,fontSize:'16px',color:'#1E201E',width:'50vh',backgroundColor:'#D1E9F6'}}>{fetchSum.total_count}</Box>
      <Box align='center' style={{fontWeight:600,fontSize:'16px',color:'#1E201E',width:'50vh',backgroundColor:'#D1E9F6'}}>{fetchSum.total_new}</Box>
      <Box align='center' style={{fontWeight:600,fontSize:'16px',color:'#1E201E',width:'50vh',backgroundColor:'#D1E9F6'}}>{fetchSum.total_renewal}</Box>
      <Box align='center' style={{fontWeight:600,fontSize:'16px',color:'#1E201E',width:'50vh',backgroundColor:'#D1E9F6'}}>{fetchSum.total_otr}</Box>
    
  </Box>
     
      
       <TablePagination
                    rowsPerPageOptions={[25,50,100,150,200]}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    count={filteredRows.length}
                    component="div"
                    onPageChange={handlechangepage}
                    onRowsPerPageChange={handleRowsPerPage}

                >

                </TablePagination>
 </Box>
     </Box>
    
     </Box>
  <DealerwiseReport
  selectedDealerName={selectedDealerName}
  type={type}
  startDate={startDate}
  endDate={endDate}
  openPopup={openPopup}
  setOpenPopup={setOpenPopup}
>
</DealerwiseReport>
</>
  );
  }

