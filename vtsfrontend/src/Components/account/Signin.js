import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import { InputLabel } from '@mui/material';
import { InputAdornment } from '@mui/material';
import {FormControl} from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
// Define a default theme

const baseUrl='http://127.0.0.1:8000'
const defaultTheme = createTheme();

export default function LoginApp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuth(); // access the context

  const handleClickShowPassword = () => setShowPassword((show) => !show);

 

    
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/accounts/userlogin/`, {
        username,
        password,
      });
  // Store token and is_superuser separately in localStorage
      localStorage.setItem("Token", response.data.Token);
       const whoamiRes = await axios.get(`${baseUrl}/accounts/whoiam/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('Token')}`,
        },
      });
       
      setAuth({
        isSuperuser: whoamiRes.data.is_superuser,
      });
     
   toast.success("Login successfully");
       if (whoamiRes.data.is_superuser) {
        navigate("/over"); // Change this to your actual admin route
      } else {
        navigate("/install");
      }
  // Set a timeout for token expiration (30 minutes)
      setTimeout(() => {
        localStorage.removeItem("Token");
        setAuth({ isSuperuser: false });
        navigate("/");
      }, 60 * 60 * 1000); // 1 hr
    } catch (error) {
      toast.error("Invalid password");
      setUsername("");
      setPassword("");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
    <Grid container component="main" sx={{ height: '100vh', background: `linear-gradient(${'#262828'},${'#5F85DB'},${'#262828'})` }}>
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Box}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
                     backgroundColor: '#fff',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          margin: 'auto',
      
          
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#1B1A55' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography style={{ fontWeight: 'bolder', fontSize: '18px' }}>
          IMS
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              fullWidth
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: '#1B1A55' }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
             
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  </ThemeProvider>
  );
}

