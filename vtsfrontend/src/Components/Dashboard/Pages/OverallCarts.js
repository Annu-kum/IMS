import {useEffect,useState,React} from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
// import Grid from '@mui/material/Grid';
import {  Typography } from '@mui/material';
import DehazeIcon from '@mui/icons-material/Dehaze';
import api from '../../account/BaseApi';
import {useMediaQuery} from '@mui/material';





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
    
    const token = localStorage.getItem("Token");
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`,
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? 'blue' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

const fetchData = () => {
  api.get("/installation/dashboard/summary/", { headers })
    .then((res) => {
      const d = res.data;

      // INSTALLATION
      setCount(d.installation.total);
      setInstallnew(d.installation.new);
      setInstallrenewal(d.installation.renewal);

      setTodayinstall(d.installation.today_total);
      setTodaynewinstall(d.installation.today_new);
      setTodayrenewalinstall(d.installation.today_renewal);

      setYesterdayinstall(d.installation.yesterday_total);
      setYesterdaynewinstall(d.installation.yesterday_new);
      setYesterdayrenewalinstall(d.installation.yesterday_renewal);

      // DEACTIVATION
      setDcount(d.deactivation.total);
      setdeactivatenew(d.deactivation.new);
      setDeactivaterenewal(d.deactivation.renewal);

      setDtodaycount(d.deactivation.today_total);
      setdeactivatenewToday(d.deactivation.today_new);
      setDeactivaterenewalToday(d.deactivation.today_renewal);

      setDcountyesterday(d.deactivation.yesterday_total);
      setdeactivatenewyesterday(d.deactivation.yesterday_new);
      setDeactivaterenewalyesterday(d.deactivation.yesterday_renewal);

      // REACTIVATION
      setRcount(d.reactivation.total);
      setreactivatenew(d.reactivation.new);
      setReactivaterenewal(d.reactivation.renewal);

      setRtodaycount(d.reactivation.today_total);
      setreactivatenewToday(d.reactivation.today_new);
      setReactivaterenewalToday(d.reactivation.today_renewal);

      setRcountyesterday(d.reactivation.yesterday_total);
      setreactivatenewyesterday(d.reactivation.yesterday_new);
      setReactivaterenewalyesterday(d.reactivation.yesterday_renewal);

      // OTR
      setOcount(d.otr.total);
      setOTRnew(d.otr.new);
      setOTRrenewal(d.otr.renewal);

      setOtodaycount(d.otr.today_total);
      setOTRnewToday(d.otr.today_new);
      setOTRrenewalToday(d.otr.today_renewal);

      setOcountyesterday(d.otr.yesterday_total);
      setOTRnewyesterday(d.otr.yesterday_new);
      setOTRrenewalyesterday(d.otr.yesterday_renewal);
    })
    .catch((err) => console.error("Dashboard error:", err));
};


      useEffect(() => {
        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 120000); // Poll every 120 seconds
    
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
