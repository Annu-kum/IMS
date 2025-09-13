import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {CSVLink,CSVDownload} from 'react-csv';
import {Typography} from '@mui/material';
import  {useTheme } from '@mui/material';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbarFilterButton,
  GridToolbar,
  GridToolbarExport,
  GridPagination,
  gridPageCountSelector,
  useGridApiContext,
  useGridSelector
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Search from '../Manages/Installation/Search';
import NewExport from './NewExport';
import { createTheme } from '@mui/material/styles';
import '../Manages/Installation/install.css'
import { Toolbar } from '@mui/material';
import Header from '../../Header';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from 'date-fns';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import UpdateDeactiveletter from './UpdateDeactiveletter';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadIcon from '@mui/icons-material/Upload';
import BulkUpload from './BulkUpload';
import Deletedialogbox from './Deleteddialogbox';
import {CircularProgress} from '@mui/material';
import { useAuth } from '../../../account/AuthContext';

export default function DataGridDemo() {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const[loading,setLoading]=useState(false)
  const [search, setSearch] = useState('');
  const theme = useTheme();
  const[openDialog,setOpenDialog]=useState(false)
  const [openPopup, setOpenPopup] = useState(false)
  const [ ids,setids]=useState('')
  const[deleteDialog,setDeleteDialog]=useState(false)
  const [deleteId,setDeleteid]=useState(null)
  const [page, setPage] = useState(0); // 0-based for MUI
  const [pageSize, setPageSize] = useState(25);
  const [rowCount, setRowCount] = useState(0);
  const token = localStorage.getItem('Token');
  const{auth} = useAuth();

  const headers = {
   'content-type': 'application/json',
   'Authorization': `Token ${token}`,
   'Accept': 'application/json',
 };


  
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch your data here
        const response = await axios.get(`http://127.0.0.1:8000/deactivation/getdeactivatedetai/`,
      {
         params: {
            search:search,
            page: page + 1,        // Backend usually expects 1-based page
            page_size: pageSize,
          },
        headers
       });
        setRows(response.data.results);
        setRowCount(response.data.count)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

   useEffect(()=>{
    fetchData()
  },[search,page,pageSize])
  

  const refresh = ()=>{
 fetchData()   
}

const openInPopup = id => {
  setids(id)
  setOpenPopup(true)
}

const dialogbox=()=>{
  setOpenDialog(true)
  }

  //delete dialogue box...

const deletePopups = id =>{
    setDeleteid(id)
    setDeleteDialog(true)

} 

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };  

    // Create FormData object to handle file upload
    const formData = new FormData();
    for (const key in updatedRow) {
      if (key === 'Deactivation_letterHead' && updatedRow[key] instanceof File) {
        formData.append('Deactivation_letterHead', updatedRow[key]);
      } else {
        formData.append(key, updatedRow[key]);
      }
    }

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/deactivation/updatedeactivate/${newRow.id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization':`Token ${token}`
          },
        }
      );
      setRows((prevRows) => prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      // toast.success('Row updated successfully!');
      toast.success("Data updated successfully ",{
        theme:"light",
        position:"top-center"
      })
    } catch (error) {
      console.log(error);
      toast.error('There was an error updating the row!',{
        theme:'light',
        position:'top-center'
      });
    }

    return updatedRow;
  };

  const handleDownload = (id) => async () => {
     try {
      // Fetch  data from  API
      const response = await axios.get(`http://127.0.0.1:8000/deactivation/getdeactiveurl/${id}`);
      const url = response.data.Deactivation_letterHead;
      setData(url);  // Set the URL to be used for download
      console.log(url)
      // Programmatically create and click a download link
      const link = document.createElement('a');
      link.href = url;
      link.target='_blank'
      link.setAttribute('download', 'file'); // Set a default filename or use a dynamic one
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error fetching secure file URL:', error);
    }
  };



  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  

    const actionsColumn={
      field: 'actions',
      flex: 1,
      type: 'actions',
      headerName: 'Actions',
      headerClassName:'head',
      headerAlign:'center',
      align:'center',
      width: 140,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={()=>deletePopups(id)}
          />,
        ];
      },
    
  };

const updateColumn = {
  field: 'update',
      headerName: 'Update LetterHead',
      headerAlign:'center',
      width: 140,
      editable: false,
      align:'center',
      headerClassName: 'head',
     
      renderCell: (params) => (
        <Button
        sx={{backgroundColor: '#0C134F',
        '&:hover': {
        backgroundColor: '#0C134F',
        color:'#fff',
        border:'1px solid #535C91'
      },
        color: 'white',
        fontSize: "8px",
        fontWeight: "bold",
        padding: "3px 3px",
        boxShadow:"12px",
        
    }}
     onClick={()=>{openInPopup(params.row.id)}}
     
        >
        Update
        </Button>
      ),
}
  const baseColumns = [
    {field:'Entity_id',align:'center', headerAlign:'center', headerName: 'Entity ID', width: 120, editable: true,headerClassName:'head',sx:{fontFamily:'cursive'} },
    { field: 'district',align:'center', headerAlign:'center', headerName: 'District', width: 120, editable: true,headerClassName:'head',sx:{fontFamily:'cursive'} },
    { field: 'GPS_IMEI_NO',align:'center', headerAlign:'center', headerName: 'GPS IMEI NO', width: 100, editable: true,headerClassName:'head' },
    { field: 'vehicle1',align:'center', headerAlign:'center', headerName: 'Vehicle No 1', width: 100, editable: true ,headerClassName:'head'},
    { field: 'vehicle2',align:'center', headerAlign:'center', headerName: 'Vehicle No 2', width: 100, editable: true,headerClassName:'head' },
    { field: 'vehicle3',align:'center', headerAlign:'center', headerName: 'Vehicle No 3', width: 100, editable: true,headerClassName:'head' },
    { field: 'MILLER_TRANSPORTER_ID', align:'center', headerAlign:'center',headerName: 'Miller/Transporter Id', width: 120, editable: true ,headerClassName:'head'},
    { field: 'MILLER_NAME',align:'center', headerAlign:'center', headerName: 'Miller/Transporter Name', width: 120, editable: true,headerClassName:'head' },
    { field: 'DeactivationDate',align:'center', headerAlign:'center', headerName: 'Deactivation Date',type:'Date', width: 100, editable: true,headerClassName:'head' },
    // { field: 'Deactivation_letterHead',align:'center', headerAlign:'center', headerName: 'Install Letterhead', width: 180, editable: false ,headerClassName:'head',},
    {
      field: 'download',
      headerName: 'Download LetterHead',
      headerAlign:'center',
      width: 5,
      editable: false,
      align:'center',
      headerClassName: 'head',
      renderCell: (params) => (
        <IconButton
          variant="contained"
          onClick={handleDownload(params.row.id)}
          sx={{color:'green'}}
        >
        <DownloadIcon/>
        </IconButton>
      ),
    },
    { field: 'Replace_DeviceIMEI_NO', headerAlign:'center',align:'center', headerName: 'Replace Device IMEI No', width: 120, editable: true,headerClassName:'head' },
    { field: 'Remark1', align:'center', headerAlign:'center',headerName: 'Remark 1', width: 100, editable: true ,headerClassName:'head'},
    { field: 'Remark2',align:'center', headerAlign:'center', headerName: 'Remark 2', width: 100, editable: true,headerClassName:'head' },
    { field: 'Remark3',align:'center', headerAlign:'center', headerName: 'Remark 3', width: 100, editable: true ,headerClassName:'head'},
  ];
const adminMaincolumn=[
   {field:'Entity_id',align:'center', headerAlign:'center', headerName: 'Entity ID', width: 120, editable: true,headerClassName:'head',sx:{fontFamily:'cursive'} },
    { field: 'district',align:'center', headerAlign:'center', headerName: 'District', width: 120, editable: true,headerClassName:'head',sx:{fontFamily:'cursive'} },
    { field: 'GPS_IMEI_NO',align:'center', headerAlign:'center', headerName: 'GPS IMEI NO', width: 100, editable: true,headerClassName:'head' },
     { field: 'SIM_NO', align: 'center', headerAlign: 'center', headerName: 'SIM NO', width: 100, editable: true, headerClassName: 'head' },
    { field: 'Device_Name', align: 'center', headerAlign: 'center', headerName: 'Device Name', width: 100, editable: true, headerClassName: 'head' },
    { field: 'Dealer_Name', align: 'center', headerAlign: 'center', headerName: 'Dealer Name', width: 100, editable: true, headerClassName: 'head' },
    { field: 'NewRenewal', align: 'center', headerAlign: 'center', headerName: 'New/Renewal', width: 100, editable: true, headerClassName: 'head' },
  { field: 'OTR', align: 'center', headerAlign: 'center', headerName: 'OTR', width: 50, editable: true, headerClassName: 'head' },
    { field: 'vehicle1',align:'center', headerAlign:'center', headerName: 'Vehicle No 1', width: 100, editable: true ,headerClassName:'head'},
    { field: 'vehicle2',align:'center', headerAlign:'center', headerName: 'Vehicle No 2', width: 100, editable: true,headerClassName:'head' },
    { field: 'vehicle3',align:'center', headerAlign:'center', headerName: 'Vehicle No 3', width: 100, editable: true,headerClassName:'head' },
    { field: 'MILLER_TRANSPORTER_ID', align:'center', headerAlign:'center',headerName: 'Miller/Transporter Id', width: 120, editable: true ,headerClassName:'head'},
    { field: 'MILLER_NAME',align:'center', headerAlign:'center', headerName: 'Miller/Transporter Name', width: 120, editable: true,headerClassName:'head' },
    { field: 'DeactivationDate',align:'center', headerAlign:'center', headerName: 'Deactivation Date',type:'Date', width: 100, editable: true,headerClassName:'head' },
    // { field: 'Deactivation_letterHead',align:'center', headerAlign:'center', headerName: 'Install Letterhead', width: 180, editable: false ,headerClassName:'head',},
    {
      field: 'download',
      headerName: 'Download LetterHead',
      headerAlign:'center',
      width: 5,
      editable: false,
      align:'center',
      headerClassName: 'head',
      renderCell: (params) => (
        <IconButton
          variant="contained"
          onClick={handleDownload(params.row.id)}
          sx={{color:'green'}}
        >
        <DownloadIcon/>
        </IconButton>
      ),
    },
  { field: 'Employee_Name', align: 'center', headerAlign: 'center', headerName: 'Employee Name', width: 130, editable: true, headerClassName: 'head' },
  { field: 'Device_Fault', align: 'center', headerAlign: 'center', headerName: 'Device Fault', width: 100, editable: true, headerClassName: 'head' },
  { field: 'Fault_Reason', align: 'center', headerAlign: 'center', headerName: 'Fault Reason', width: 100, editable: true, headerClassName: 'head' },
    { field: 'Replace_DeviceIMEI_NO', headerAlign:'center',align:'center', headerName: 'Replace Device IMEI No', width: 120, editable: true,headerClassName:'head' },
    { field: 'Remark1', align:'center', headerAlign:'center',headerName: 'Remark 1', width: 100, editable: true ,headerClassName:'head'},
    { field: 'Remark2',align:'center', headerAlign:'center', headerName: 'Remark 2', width: 100, editable: true,headerClassName:'head' },
    { field: 'Remark3',align:'center', headerAlign:'center', headerName: 'Remark 3', width: 100, editable: true ,headerClassName:'head'},
]

 const columns = auth.isSuperuser?[actionsColumn,updateColumn,...adminMaincolumn]:baseColumns;



  



  return (
    <>
      <Box m="9px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Deactivation" subtitle="Entry of Deactivation Device" />
{
 auth.isSuperuser &&  <Box>
            <NewExport />
          </Box>
} 
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
{auth.isSuperuser &&    <Button
                 sx={{
                  backgroundColor: '#1B1A55',
                  '&:hover': {
                    backgroundColor: '#1B1A55',
                    color: '#fff',
                    fontSize: "12px",
                    fontWeight: "bold",
                  },
                  color: '#fff',
                  fontSize: "12px",
                  fontWeight: "bold",
                  height: '30px',
                  margin: '25px 0px 0px 0px'
                }}
                 
                 type='submit'
                 onClick={dialogbox}
              ><UploadIcon fontSize='small'  />Bulk Upload
              </Button>
} 
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
          <Box m="0.1rem 0.2rem" sx={{overflowY: 'auto',height: '70vh', width: '100%'}}>
          {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : rows.length === 0 ? (
                
                  <Typography variant="body1">No data found</Typography>
                
            ) : ( 
              <DataGrid
                rowHeight={33}
                rows={rows}
                columns={columns}
                editMode="column"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
                 paginationMode="server"
                rowCount={rowCount} // total count of rows in backend
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={(model) => {
                  setPage(model.page);
                  setPageSize(model.pageSize);
                }}

                pageSizeOptions={[25, 50, 100]}
                loading={loading}
              />
            )}
            </Box>
          </Box>
        </Box>
     
            <UpdateDeactiveletter
               setids={ids}
               openPopup={openPopup}
               setOpenPopup={setOpenPopup}
            />
            <BulkUpload
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
            />

<Deletedialogbox
    setDeleteid={deleteId}
    deleteDialog={deleteDialog}
    setDeleteDialog={setDeleteDialog}
  />
    </>
  );
}







