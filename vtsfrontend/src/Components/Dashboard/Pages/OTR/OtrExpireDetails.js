import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { DataGrid} from '@mui/x-data-grid';
import 'jspdf-autotable';
import Search from '../Manages/Installation/Search';
import '../Manages/Installation/install.css';
import Header from '../../Header';
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import RefreshIcon from '@mui/icons-material/Refresh'
import {CircularProgress} from '@mui/material';
import { useAuth } from '../../../account/AuthContext';
import { addMonths,format,parse,isAfter,isSameDay,isBefore } from 'date-fns';
import {CSVLink} from 'react-csv';

const baseUrl="http://127.0.0.1:8000"

export default function OtrExpireDetails() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('Token'); 
  const{auth} = useAuth();
 const headers = {
   'content-type': 'application/json',
   'Authorization': `Token ${token}`,
   'Accept': 'application/json',
 };


//Main Implementation...



  
 const fetchData = async () => {
  setLoading(true);
  try {
    const [installRes, otrRes] = await Promise.all([
      axios.get(`${baseUrl}/otrentries/getOTRinstall`, { headers }),
      axios.get(`${baseUrl}/otrentries/getallotr`, { headers }),
    ]);

    const installData = installRes.data;
    const otrData = otrRes.data;
    const today = new Date();

    const enrichedData = installData.map(item => {
      const imeiNo = item.GPS_IMEI_NO?.trim();
      let parsedInstallDate;
      let finalExpireDate;
      let showInOTRTable = true;

      if (item.InstallationDate && typeof item.InstallationDate === 'string') {
        try {
          parsedInstallDate = parse(item.InstallationDate, 'dd-MM-yyyy', new Date());
          finalExpireDate = addMonths(parsedInstallDate, 6);
        } catch (err) {
          console.warn('Invalid InstallationDate:', item.InstallationDate);
          return null;
        }
      } else {
        console.warn('Missing InstallationDate:', item);
        return null;
      }

      const matchingOtr = otrData.find(
        otr => otr.GPS_IMEI_NO?.trim() === imeiNo && otr.nextExpirydate
      );

      if (matchingOtr && typeof matchingOtr.nextExpirydate === 'string') {
        try {
          const parsedNextExpire = parse(matchingOtr.nextExpirydate, 'dd-MM-yyyy', new Date());
        if (isAfter(parsedNextExpire, today)) {
  showInOTRTable = false;
} else if (isSameDay(parsedNextExpire, today)) {
  finalExpireDate = parsedNextExpire;
  showInOTRTable = true;
} else {
  finalExpireDate = parsedNextExpire;
  showInOTRTable = true;
}
        } catch (err) {
          console.warn('Invalid nextExpirydate:', matchingOtr.nextExpirydate);
        }
      }

      return {
        ...item,
        ExpireDate: format(finalExpireDate, 'dd-MM-yyyy'),
        showInOTRTable,
      };
    }).filter(Boolean);

    const filteredData = enrichedData.filter(item => {
      const parsedExpire = parse(item.ExpireDate, 'dd-MM-yyyy', new Date());
      return item.showInOTRTable && (isSameDay(parsedExpire, today) || isBefore(parsedExpire, today));
    });

    const dataWithImeiFlag = markDuplicateGPSIMEI(filteredData);
    setRows(dataWithImeiFlag);

  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};

      

useEffect(() => {
  const loadData = async () => {
    await fetchData();
  };
  loadData();
}, []);

  const markDuplicateGPSIMEI = (data) => {
    const imeiCount = {};
    // Count occurrences of each IMEI
    data.forEach(row => {
      imeiCount[row.GPS_IMEI_NO] = (imeiCount[row.GPS_IMEI_NO] || 0) + 1;
    });
   

    // Mark rows with duplicate IMEI
    return data.map(row => ({
      ...row,
      imeiStatus: imeiCount[row.GPS_IMEI_NO] > 1 ? 'duplicate' : 'unique'
    }));
  };

  // Refresh the table data...
  const refresh = () => {
   fetchData();
  };
   
      

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

// Your original columns without the actions column
const baseColumns = [
  
  { field: 'Entity_id', align: 'center', headerAlign: 'center', headerName: 'Entity ID', width: 120, editable: true, headerClassName: 'head', sx: { fontFamily: 'cursive' } },
  { field: 'district', align: 'center', headerAlign: 'center', headerName: 'District', width: 120, editable: true, headerClassName: 'head', sx: { fontFamily: 'cursive' } },
  {
    field: 'GPS_IMEI_NO',
    align: 'center',
    headerAlign: 'center',
    headerName: 'GPS IMEI No',
    width: 100,
    editable: true,
    headerClassName: 'head',
    renderCell: (params) => (
      <Box
        sx={{
          color: params.row.imeiStatus === 'duplicate' ? '#CD1818' : 'inherit',
          padding: '5px',
          borderRadius: '4px',
        }}
      >
        {params.value}
      </Box>
    ),
  },
  { field: 'SIM_NO', align: 'center', headerAlign: 'center', headerName: 'SIM NO', width: 100, editable: true, headerClassName: 'head' },
  { field: 'Device_Name', align: 'center', headerAlign: 'center', headerName: 'Device Name', width: 100, editable: true, headerClassName: 'head' },
  { field: 'Dealer_Name', align: 'center', headerAlign: 'center', headerName: 'Dealer Name', width: 100, editable: true, headerClassName: 'head' },
  { field: 'NewRenewal', align: 'center', headerAlign: 'center', headerName: 'New/Renewal', width: 100, editable: true, headerClassName: 'head' },
  { field: 'OTR', align: 'center', headerAlign: 'center', headerName: 'OTR', width: 50, editable: true, headerClassName: 'head' },
  { field: 'vehicle1', align: 'center', headerAlign: 'center', headerName: 'Vehicle No 1', width: 100, editable: true, headerClassName: 'head' },
  { field: 'vehicle2', align: 'center', headerAlign: 'center', headerName: 'Vehicle No 2', width: 100, editable: true, headerClassName: 'head' },
  { field: 'vehicle3', align: 'center', headerAlign: 'center', headerName: 'Vehicle No 3', width: 100, editable: true, headerClassName: 'head' },
  { field: 'MILLER_TRANSPORTER_ID', align: 'center', headerAlign: 'center', headerName: 'Miller/Transporter Id', width: 120, editable: true, headerClassName: 'head' },
  { field: 'MILLER_NAME', align: 'center', headerAlign: 'center', headerName: 'Miller/Transporter Name', width: 120, editable: true, headerClassName: 'head' },
  { field: 'InstallationDate', align: 'center', headerAlign: 'center', headerName: 'Installation Date', type: 'Date', width: 120, editable: true, headerClassName: 'head' },
  { field: 'ExpireDate', align: 'center', headerAlign: 'center', headerName: 'Expire Date', type: 'Date', width: 120, editable: true, headerClassName: 'head' },
  { field: 'Employee_Name', align: 'center', headerAlign: 'center', headerName: 'Employee Name', width: 130, editable: true, headerClassName: 'head' },
  { field: 'Device_Fault', align: 'center', headerAlign: 'center', headerName: 'Device Fault', width: 100, editable: true, headerClassName: 'head' },
  { field: 'Fault_Reason', align: 'center', headerAlign: 'center', headerName: 'Fault Reason', width: 100, editable: true, headerClassName: 'head' },
  { field: 'Replace_DeviceIMEI_NO', headerAlign: 'center', align: 'center', headerName: 'Replace Device IMEI No', width: 150, editable: true, headerClassName: 'head' },
  { field: 'Remark1', align: 'center', headerAlign: 'center', headerName: 'Remark 1', width: 80, editable: true, headerClassName: 'head' },
  { field: 'Remark2', align: 'center', headerAlign: 'center', headerName: 'Remark 2', width: 80, editable: true, headerClassName: 'head' },
  { field: 'Remark3', align: 'center', headerAlign: 'center', headerName: 'Remark 3', width: 80, editable: true, headerClassName: 'head' },
];

// Final columns conditionally including "actions"
const columns = auth.isSuperuser
  ? [ ...baseColumns ]
  : baseColumns;


//Filter operation...
  const filterRowsBySearch = () => {
    if (!search) return rows;
  
    return rows.filter((items) => {
      return (
        (items.GPS_IMEI_NO || '').toLowerCase().includes(search.toLowerCase()) ||
        (items.Device_Name || '').toLowerCase().includes(search.toLowerCase()) ||
        (items.SIM_NO || '').toLowerCase().includes(search.toLowerCase()) ||
        (items.NewRenewal || '').toLowerCase().includes(search.toLowerCase()) ||
        (items.Employee_Name || '').toLowerCase().includes(search.toLowerCase()) ||
        (items.MILLER_TRANSPORTER_ID || '').toLowerCase().includes(search.toLowerCase()) ||
        (items.MILLER_NAME || '').toLowerCase().includes(search.toLowerCase()) ||
        (items.district || '').toLowerCase().includes(search.toLowerCase()) ||
        (items.Dealer_Name || '').toLowerCase().includes(search.toLowerCase())||
        (items.vehicle1 || '').toLowerCase().includes(search.toLowerCase())
      );
    });
  };
  
  const filteredRows = filterRowsBySearch();
  //for export button logic...
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Box m="9px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="OTR Expiration Details" subtitle="Records of otr expiration" />
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
          >
            <Box sx={{ gridColumn: 'span 2', padding: "15px 15px 0px 0px" }}>
              <Search sendData={setSearch} />
            </Box>
            <Box sx={{gridColumn: 'span 2',display:'flex',justifyContent:'flex-end' }}>
      {/* Export Button */}
      <Button
        id="demo-positioned-button"
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
         <CSVLink filename="OTRExpiry-Report.csv"  data={filteredRows} style={{textDecoration:'none',color:'inherit'}}>Export</CSVLink>
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
         onClick={refresh}
        ><RefreshIcon fontSize='small'/>refresh</Button>
            </Box>
            
          </Box>
          <Box m="0.1rem 0.2rem"  sx={{overflowY: 'auto',height: '70vh', width: '100%' }}>
          {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : rows.length === 0 ? (
                
                  <Typography variant="body1">No data found</Typography>
                
            ) : (
              <DataGrid
                rowHeight={33}
                rows={filteredRows}
                columns={columns}
                // classes={{'duplicate-imei': classes['duplicate-imei'] }}
                editMode="column"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
               
                
                initialState={{
                  ...filteredRows.initialState,
                  pagination: { paginationModel: { pageSize: 25 } },
                }}
                pageSizeOptions={[25, 50,100,150,200]}
             />
              )}
          </Box>
        </Box>
      </Box>
 
    </>
  );
}

