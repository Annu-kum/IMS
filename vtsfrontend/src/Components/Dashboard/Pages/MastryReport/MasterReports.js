import * as React from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import { Button, MenuItem, Menu, useMediaQuery } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CSVLink } from 'react-csv';
import DateView from '../Manages/Installation/DateView';
import Search from '../Manages/Installation/Search';
import jspdf from 'jspdf';
import Header from '../../Header';
import { toast } from 'react-toastify';

const baseUrl = 'http://127.0.0.1:8000';

export default function MasterReports() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [datacount,setDatacount]=React.useState(0)
  const open = Boolean(anchorEl);
  const token = localStorage.getItem('Token');
 const headers = {
   'content-type': 'application/json',
   'Authorization': `Token ${token}`,
   'Accept': 'application/json',
 };

  const isNonMobile = useMediaQuery('(min-width:600px)');

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

      const response = await axios.get(`${baseUrl}/masterReport/mastereport/`, {
        params: {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
           page: page + 1,        // Backend usually expects 1-based page
          page_size: rowsPerPage,
          search:search
        },
        headers
      });
      
      setData(response.data.results);
       setDatacount(response.data.count)
     
    } catch (error) {
      toast.error('something went wrong');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getData(startDate, endDate);
  }, [startDate, endDate,page,rowsPerPage,search]);

  const handleRefresh = () => {
    getData();
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleDateFilter = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSearch('');
  };

  const filterData = () => {
    let filteredData = data;

    // Filter by search keyword
    if (search) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Filter by date range

    return filteredData;
  };

  const filteredData = filterData();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when changing rows per page
  };

  const handleExportMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setAnchorEl(null);
  };

  const exportToPDF = () => {
    const doc = new jspdf({ orientation: 'landscape' });
    doc.text('Active Report', 5, 10);
    doc.autoTable({
      html: '#reportTable',
      theme: 'grid',
      tableWidth: 'wrap',
      alignItems: 'center',
      styles: { cellPadding: 0.7, fontSize: 8, align: 'center' },
    });

    doc.save('Active_Report.pdf');
  };

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
  
      const response = await axios.get(`${baseUrl}/masterReport/mastereport/`, {
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

  const csvHeaders = [
    { label: 'Miller Transporter ID', key: 'MILLER_TRANSPORTER_ID' },
    { label: 'Miller Name', key: 'MILLER_NAME' },
    { label: 'District', key: 'district' },
    { label: 'Dealer Name', key: 'Dealer_Name' },
    { label: 'GPS IMEI No', key: 'GPS_IMEI_NO' },
    { label: 'SIM No', key: 'SIM_NO' },
    {label:'Vehicle No', key:'vehicle1'},
    { label: 'Device Name', key: 'Device_Name' },
    { label: 'Installation Date', key: 'InstallationDate' },
    { label: 'New/Renewal', key: 'NewRenewal' },
    { label: 'OTR', key: 'OTR' },
  ];

  return (
    <>
    <Box m={'5px'}>
      <Header title="Master Report" />

      {/* Header Section */}
      <Box
        padding={'0rem'}
        m={'0px 0px 1px'}
        borderRadius={'1%'}
        alignItems="flex-end"
        position={'relative'}
        zIndex={'12'}
      >
        <Box
          display="grid"
          gridTemplateColumns="repeat(2, minmax(0, 1fr))"
          sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 2" } }}
        >
          <Box p="10px">
            <Search sendData={setSearch} onSearchChange={handleSearchChange} />
          </Box>
          <Box p="5px" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <DateView getData={handleDateFilter} onClearFilters={handleClearFilters} />
            <Button
              id="exportButton"
              aria-controls={open ? 'exportMenu' : undefined}
              aria-haspopup="true"
              onClick={handleExport}
              sx={{
                height: '5vh',
                width: '90px',
                backgroundColor: '#1B1A55',
                '&:hover': {
                  background: '#535C91',
                  color: '#fff',
                  fontSize: "12px",
                  fontWeight: "bold",
                },
                color: '#fff',
                fontSize: "12px",
                fontWeight: "bold",
                margin: '25px 0px 0px 0px',
              }}
            >
  Export
      </Button>
           <CSVLink  headers={csvHeaders} filename="Master_Report" data={csvdatas}
  ref={csvLinkRef}
  target="_blank"/>           
            <Box style={{ padding: '1px' }}>
              <Button
                onClick={handleRefresh}
                type="button"
                sx={{
                  height: '5vh',
                  width: '90px',
                  backgroundColor: '#1B1A55',
                  '&:hover': {
                    background: '#535C91',
                    color: '#fff',
                    fontSize: "12px",
                    fontWeight: "bold",
                  },
                  color: '#fff',
                  fontSize: "12px",
                  fontWeight: "bold",
                  margin: '25px 0px 0px 5px',
                }}
              >
                <RefreshIcon fontSize="small" /> Refresh
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Table Section */}
     
      <Box backgroundColor="#F0F8FF" boxShadow={'5'} style={{margin:'0px 8px 10px 0px'}}>
      <TablePagination
          rowsPerPageOptions={[ 25, 50, 100,150,200]}
          component="div"
          count={datacount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          size='small'
       

 />
        <TableContainer component={Paper} style={{overflowY: 'auto',height: '70vh', width: '100%' }}>
          <Table id="reportTable" size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ background: '#233044', color: '#fff' }}>
                  Miller Transporter ID
                </TableCell>
                <TableCell style={{ background: '#233044', color: '#fff' }}>Miller Name</TableCell>
                <TableCell style={{ background: '#233044', color: '#fff' }}>District</TableCell>
                <TableCell style={{ background: '#233044', color: '#fff' }}>Dealer Name</TableCell>
                <TableCell style={{ background: '#233044', color: '#fff' }}>GPS IMEI No</TableCell>
                <TableCell style={{ background: '#233044', color: '#fff' }}>SIM No</TableCell>
                <TableCell style={{ background: '#233044', color: '#fff' }}>Vehicle No</TableCell>
                <TableCell style={{ background: '#233044', color: '#fff' }}>Device Name</TableCell>
                <TableCell style={{ background: '#233044', color: '#fff', }}>Installation Date</TableCell>
                <TableCell style={{ background: '#233044', color: '#fff' }}>New/Renewal</TableCell>
                <TableCell style={{ background: '#233044', color: '#fff' }}>OTR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Typography variant="body1">No data found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={row.id}
                      style={
                        index % 2
                          ? { backgroundColor: '#e3ebf3' }
                          : { backgroundColor: '#fff' }
                      }
                    >
                      <TableCell>{row.MILLER_TRANSPORTER_ID}</TableCell>
                      <TableCell>{row.MILLER_NAME}</TableCell>
                      <TableCell>{row.district}</TableCell>
                      <TableCell>{row.Dealer_Name}</TableCell>
                      <TableCell>{row.GPS_IMEI_NO}</TableCell>
                      <TableCell>{row.SIM_NO}</TableCell>
                      <TableCell>{row.vehicle1}</TableCell>
                      <TableCell>{row.Device_Name}</TableCell>
                      <TableCell>{row.InstallationDate}</TableCell>
                      <TableCell>{row.NewRenewal}</TableCell>
                      <TableCell>{row.OTR}</TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
      </Box>
      </Box>
    </>
  );
}
