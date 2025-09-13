import {useEffect,useState,React} from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
// import Grid from '@mui/material/Grid';
import {  Typography } from '@mui/material';
import axios from 'axios';
import DehazeIcon from '@mui/icons-material/Dehaze';




import {useMediaQuery} from '@mui/material';


const baseUrl = 'http://127.0.0.1:8000/'


const DashboardCard = ({ title, total, newCount, renewal }) => (
  <Paper elevation={3} style={{ padding: '16px', textAlign: 'center' }}>
      <Typography fontSize={'14px'}  fontWeight="bolder" textAlign={'left'} ><DehazeIcon fontSize='8px' sx={{padding:'0px 5px 0px 0px',color:'#6A73DC'}}/>{title}</Typography>
      <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <Box>
              <Typography variant="h6" fontWeight="bolder">{total}</Typography>
              <Typography style={{ fontSize: '12px', color: '#000' }}>Total</Typography>
          </Box>
          <Box>
              <Typography variant="h6" fontWeight="bolder">{newCount}</Typography>
              <Typography style={{ fontSize: '12px', color: 'green' }}>New</Typography>
          </Box>
          <Box>
              <Typography variant="h6" fontWeight="bolder">{renewal}</Typography>
              <Typography style={{ fontSize: '12px', color: 'red' }}>Renewal</Typography>
          </Box>
      </Box>
  </Paper>
);




export default function OverallCarts() {
  // ------------------------------Installation------------------
   // states of install
  const [count, setCount] = useState(0); 
  const[installnew, setInstallnew]=useState(0);
  const[installrenewal,setInstallrenewal]=useState(0);
   // state of today install
  const[todayinstall,setTodayinstall]=useState(0);
  const[todaynewinstall,setTodaynewinstall]=useState(0);
  const[todayrenewalinstall,setTodayrenewalinstall]=useState(0);
   // state of yesterday install
  const[yesterdayinstall,setYesterdayinstall]=useState(0);
  const[yesterdaynewinstall,setYesterdaynewinstall]=useState(0);
  const[yesterdayrenewalinstall,setYesterdayrenewalinstall]=useState(0);
  // ---------------------------Deactivation----------------------
   //state of Deactivation
   const[Dcount,setDcount]=useState(0);
   const[deactivtenew,setdeactivatenew]=useState(0);
   const[deactivteRenewal,setDeactivaterenewal]=useState(0);
   //state of today deactivate
   const[Dtodaycount,setDtodaycount]=useState(0);
   const[deactivtenewToday,setdeactivatenewToday]=useState(0);
   const[deactivteRenewalToday,setDeactivaterenewalToday]=useState(0);
    //state of yesterday deactivate
   const[Dcountyesterday,setDcountyesterday]=useState(0);
   const[deactivtenewTesterday,setdeactivatenewyesterday]=useState(0);
   const[deactivteRenewalyesterday,setDeactivaterenewalyesterday]=useState(0);
   
  //  -------------------Reactivation-----------------------------

    //state of Reactivation
   const[Rcount,setRcount]=useState(0);
   const[reactivtenew,setreactivatenew]=useState(0);
   const[reactivteRenewal,setReactivaterenewal]=useState(0);
   //state of today reactivation
   const[Rtodaycount,setRtodaycount]=useState(0);
   const[reactivtenewToday,setreactivatenewToday]=useState(0);
   const[reactivteRenewalToday,setReactivaterenewalToday]=useState(0);
    //state of yesterday Reactivate
   const[Rcountyesterday,setRcountyesterday]=useState(0);
   const[reactivtenewTesterday,setreactivatenewyesterday]=useState(0);
   const[reactivteRenewalyesterday,setReactivaterenewalyesterday]=useState(0);


    //  -------------------OTR-----------------------------

    //state of OTR
    const[Ocount,setOcount]=useState(0);
    const[OTRnew,setOTRnew]=useState(0);
    const[OTRRenewal,setOTRrenewal]=useState(0);
    //state of today OTR
    const[Otodaycount,setOtodaycount]=useState(0);
    const[OTRnewToday,setOTRnewToday]=useState(0);
    const[OTRRenewalToday,setOTRrenewalToday]=useState(0);
     //state of yesterday OTR
    const[Ocountyesterday,setOcountyesterday]=useState(0);
    const[OTRnewTesterday,setOTRnewyesterday]=useState(0);
    const[OTRRenewalyesterday,setOTRrenewalyesterday]=useState(0);



    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? 'blue' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));
      const fetchData=()=>{
         
// -------------------------------Installation-----------------------------
      
        axios.get(`${baseUrl}/installation/total/count/`)
          .then(response => {
            setCount(response.data.count);
          })
          .catch(error => {
            console.error('There was an error fetching the count!', error);
          });
     

   
        axios.get(`${baseUrl}/installation/total/new-count/`)
          .then(response => {
            setInstallnew(response.data.count);
          })
          .catch(error => {
            console.error('There was an error fetching the count!', error);
          });
   
     
        axios.get(`${baseUrl}/installation/total/renewal-count/`)
          .then(response => {
            setInstallrenewal(response.data.count);
          })
          .catch(error => {
            console.error('There was an error fetching the count!', error);
          });
   
    
        axios.get(`${baseUrl}/installation/date/today-count/`)
          .then(response => {
            setTodayinstall(response.data.count);
          })
          .catch(error => {
            console.error('There was an error fetching the count!', error);
          });
    
    
        axios.get(`${baseUrl}/installation/today-new-count/`)
          .then(response => {
            setTodaynewinstall(response.data.count);
          })
          .catch(error => {
            console.error('There was an error fetching the count!', error);
          });
    
     
        axios.get(`${baseUrl}/installation/today-renewal-count/`)
          .then(response => {
            setTodayrenewalinstall(response.data.count);
          })
          .catch(error => {
            console.error('There was an error fetching the count!', error);
          });
  

   
        axios.get(`${baseUrl}/installation/yesterday-count/`)
          .then(response => {
            setYesterdayinstall(response.data.count);
          })
          .catch(error => {
            console.error('There was an error fetching the count!', error);
          });
    
        axios.get(`${baseUrl}/installation/yesterday-new-count/`)
          .then(response => {
            setYesterdaynewinstall(response.data.count);
          })
          .catch(error => {
            console.error('There was an error fetching the count!', error);
          });
      

        axios.get(`${baseUrl}/installation/yesterday-renewal-count/`)
          .then(response => {
            setYesterdayrenewalinstall(response.data.count);
          })
          .catch(error => {
            console.error('There was an error fetching the count!', error);
          });
     
// ------------------------------------Deactivation-------------------------------
     
        axios.get(`${baseUrl}/deactivation/total/count/`)
        .then(response=>{
          setDcount(response.data.count);
        }).catch(error=>{
          console.error('There was an error fetching the count!', error);
        })
    
        axios.get(`${baseUrl}/deactivation/total/new-count/`)
        .then(response=>{
          setdeactivatenew(response.data.count)
        }).catch(error=>{
          console.error('There was an error fetching the count!', error);
        })
     
        axios.get(`${baseUrl}/deactivation/total/renewal-count/`)
        .then(response=>{
          setDeactivaterenewal(response.data.count)
        }).catch(error=>{
          console.error('There was an error fetching the count!', error);
        })
     
        axios.get(`${baseUrl}/deactivation/date/today-count/`)
        .then(response=>{
          setDtodaycount(response.data.count)
        }).catch(error=>{
          console.error('There was an error fetching the count!', error);
        })
      
        axios.get(`${baseUrl}/deactivation/today-new-count/`)
        .then(response=>{
          setdeactivatenewToday(response.data.count)
        }).catch(error=>{
          console.error('There was an error fetching the count!', error);
        })
     
        axios.get(`${baseUrl}/deactivation/today-renewal-count/`)
        .then(response=>{
          setDeactivaterenewalToday(response.data.count)
        }).catch(error=>{
          console.error('There was an error fetching the count!', error);
        })
     
        axios.get(`${baseUrl}/deactivation/yesterday-count/`)
        .then(response=>{
          setDcountyesterday(response.data.count)
        }).catch(error=>{
          console.error('There was an error fetching the count!', error);
        })
      
        axios.get(`${baseUrl}/deactivation/yesterday-new-count/`)
        .then(response=>{
          setdeactivatenewyesterday(response.data.count)
        }).catch(error=>{
          console.error('There was an error fetching the count!', error);
        })
     
        axios.get(`${baseUrl}/deactivation/yesterday-renewal-count/`)
        .then(response=>{
          setDeactivaterenewalyesterday(response.data.count)
        }).catch(error=>{
          console.error('There was an error fetching the count!', error);
        })
      
// -----------------------------------Reactivation---------------------------------
      
        axios.get(`${baseUrl}/reactivation/total/count/`)
        .then(response=>{
          setRcount(response.data.count)
        }).catch((error)=>{
                console.log(error)
        })
     
        axios.get(`${baseUrl}/reactivation/total/new-count/`)
        .then(response=>{
          setreactivatenew(response.data.count)
        }).catch((error)=>{
                console.log(error)
        })
     
        axios.get(`${baseUrl}/reactivation/total/renewal-count/`)
        .then(response=>{
          setReactivaterenewal(response.data.count)
        }).catch((error)=>{
                console.log(error)
        })
      
        axios.get(`${baseUrl}/reactivation/date/today-count/`)
        .then(response=>{
          setRtodaycount(response.data.count)
        }).catch((error)=>{
                console.log(error)
        })
     
        axios.get(`${baseUrl}/reactivation/today-new-count/`)
        .then(response=>{
          setreactivatenewToday(response.data.count)
        }).catch((error)=>{
                console.log(error)
        })
     
        axios.get(`${baseUrl}/reactivation/today-renewal-count/`)
        .then(response=>{
          setReactivaterenewalToday(response.data.count)
        }).catch((error)=>{
                console.log(error)
        })
      
        axios.get(`${baseUrl}/reactivation/yesterday-count/`)
        .then(response=>{
          setRcountyesterday(response.data.count)
        }).catch((error)=>{
                console.log(error)
        })
     
        axios.get(`${baseUrl}/reactivation/yesterday-new-count/`)
        .then(response=>{
          setreactivatenewyesterday(response.data.count)
        }).catch((error)=>{
                console.log(error)
        })
     
        axios.get(`${baseUrl}/reactivation/yesterday-renewal-count/`)
        .then(response=>{
          setReactivaterenewalyesterday(response.data.count)
        }).catch((error)=>{
                console.log(error)
        })
     
     

// ----------------------------------OTR----------------------------
    


  axios.get(`${baseUrl}/otrdetails/total-otr`)
  .then(response=>{
    setOcount(response.data.count)
  }).catch((error)=>{
          console.log(error)
  })

  axios.get(`${baseUrl}/otrdetails/total-new-otr/`)
  .then(response=>{
    setOTRnew(response.data.count)
  }).catch((error)=>{
          console.log(error)
  })

  axios.get(`${baseUrl}/otrdetails/total-renewal-otr/`)
  .then(response=>{
    setOTRrenewal(response.data.count)
  }).catch((error)=>{
          console.log(error)
  })

  axios.get(`${baseUrl}/otrdetails/today-otr/`)
  .then(response=>{
    setOtodaycount(response.data.count)
  }).catch((error)=>{
          console.log(error)
  })

  axios.get(`${baseUrl}/otrdetails/today-new-otr/`)
  .then(response=>{
    setOTRnewToday(response.data.count)
  }).catch((error)=>{
          console.log(error)
  })

  axios.get(`${baseUrl}/otrdetails/today-renewal-otr/`)
  .then(response=>{
    setOTRrenewalToday(response.data.count)
  }).catch((error)=>{
          console.log(error)
  })

  axios.get(`${baseUrl}/otrdetails/yesterday-otr/`)
  .then(response=>{
    setOcountyesterday(response.data.count)
  }).catch((error)=>{
          console.log(error)
  })

  axios.get(`${baseUrl}/otrdetails/yesterday-new-otr/`)
  .then(response=>{
    setOTRnewyesterday(response.data.count)
  }).catch((error)=>{
          console.log(error)
  })



     axios.get(`${baseUrl}/otrdetails/yesterday-renewal-otr/`)
     .then(response=>{
      setOTRrenewalyesterday(response.data.count)
    }).catch((error)=>{
            console.log(error)
    })
  }

      useEffect(() => {
        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 60000); // Poll every 60 seconds
    
        return () => clearInterval(interval); // Cleanup on unmount
      }, []);
    

const isNonMobile = useMediaQuery("(min-width:600px)");

return (
  <>
 
    <Typography 
      variant='h5'
      color={'#283770'}
        fontWeight="600"
        sx={{ m: "0 0 5px 8px" }}
        style={{textDecorationLine:'underline',textUnderlineOffset:9,}}
    >
        Dashboard
    </Typography>

    {/* Header Section */}

    {/* Table Section */}
    <Box m={'5px'} sx={{height:'80vh',margin: '50px 8px 10px 8px' }}>
        <Grid 
            container 
            spacing={2} 
            columns={10} 
            justifyContent="center"  // Center horizontally
            alignItems="center" 
            backgroundColor="#F0F8FF" 
                // Center vertically
        >
            {/* Row 1 */}
            <Grid  xs={12} md={3} margin={'12px 0px 0px 0px'} >
                <DashboardCard title="Install" total={count} newCount={installnew} renewal={installrenewal} />
            </Grid>
            <Grid  xs={12} md={3}  margin={'12px 0px 0px 0px'}>
                <DashboardCard title="Today Install" total={todayinstall} newCount={todaynewinstall} renewal={todayrenewalinstall} />
            </Grid>
            <Grid  xs={12} md={3}  margin={'12px 0px 0px 0px'}>
                <DashboardCard title="Yesterday Install" total={yesterdayinstall} newCount={yesterdaynewinstall} renewal={yesterdayrenewalinstall} />
            </Grid>

            {/* Row 2 */}
            <Grid  xs={12} md={3}>
                <DashboardCard title="Deactivate" total={Dcount} newCount={deactivtenew} renewal={deactivteRenewal} />
            </Grid>
            <Grid  xs={12} md={3}>
                <DashboardCard title="Today Deactivate" total={Dtodaycount} newCount={deactivtenewToday} renewal={deactivteRenewalToday} />
            </Grid>
            <Grid  xs={12} md={3}>
                <DashboardCard title="Yesterday Deactivate" total={Dcountyesterday} newCount={deactivtenewTesterday} renewal={deactivteRenewalyesterday} />
            </Grid>

            {/* Row 3 */}
            <Grid  xs={12} md={3}>
                <DashboardCard title="Reactivate" total={Rcount} newCount={reactivtenew} renewal={reactivteRenewal} />
            </Grid>
            <Grid  xs={12} md={3}>
                <DashboardCard title="Today Reactivate" total={Rtodaycount} newCount={reactivtenewToday} renewal={reactivteRenewalToday} />
            </Grid>
            <Grid  xs={12} md={3}>
                <DashboardCard title="Yesterday Reactivate" total={Rcountyesterday} newCount={reactivtenewTesterday} renewal={reactivteRenewalyesterday} />
            </Grid>

            {/* Row 4 */}
            <Grid  xs={12} md={3}>
                <DashboardCard title="OTR" total={Ocount} newCount={OTRnew} renewal={OTRRenewal} />
            </Grid>
            <Grid  xs={12} md={3}>
                <DashboardCard title="Today OTR" total={Otodaycount} newCount={OTRnewToday} renewal={OTRRenewalToday} />
            </Grid>
            <Grid  xs={12} md={3}>
                <DashboardCard title="Yesterday OTR" total={Ocountyesterday} newCount={OTRnewTesterday} renewal={OTRRenewalyesterday} />
            </Grid>
        </Grid>
    </Box>

  </>
);

}
