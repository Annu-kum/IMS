import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
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
import { InputLabel, InputAdornment, FormControl, MenuItem, Select, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const baseUrl = 'http://127.0.0.1:8000';
const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#1B1A55',    // Company branding color
    },
    secondary: {
      main: '#5F85DB',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

export default function LoginApp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuth();
  const [sessionYear, setSessionYear] = useState('');
  const [sessionOptions, setSessionOptions] = useState([]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/accounts/userlogin/`, {
        username,
        password,
        session_year: sessionYear,
      });

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
        navigate("/over");
      } else {
        navigate("/install");
      }

      setTimeout(() => {
        localStorage.removeItem("Token");
        setAuth({ isSuperuser: false });
        navigate("/");
      }, 60 * 60 * 1000);
      
    } catch (error) {
      toast.error("Invalid credentials");
      setUsername("");
      setPassword("");
      setSessionYear("");
    }
  };

  useEffect(() => {
    axios.get(`${baseUrl}/accounts/session-years/`)
      .then((res) => {
        if (res.data.length > 0) {
          setSessionOptions(res.data);
        }
      })
      .catch(() => {
        toast.error("Data not found");
      });
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid 
        container 
        sx={{ 
          height: '100vh',
          background: `linear-gradient(to right, #162447, #1f4068, #1b1a55)`
        }}
        justifyContent="center"
        alignItems="center"
      >
        <CssBaseline />
        
        <Grid item xs={11} sm={8} md={4}>
          <Paper 
            elevation={6} 
            sx={{ 
              p: 5, 
              borderRadius: 3, 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#FFFFFF'
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography 
              component="h1" 
              variant="h5" 
              sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}
            >
              Welcome Back
            </Typography>

            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Sign in to continue to IMS
            </Typography>

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
              
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  name="password"
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="session-year-label">Session Year</InputLabel>
                <Select
                  labelId="session-year-label"
                  id="sessionYear"
                  value={sessionYear}
                  onChange={(e) => setSessionYear(e.target.value)}
                >
                  {sessionOptions.map((s) => (
                    <MenuItem key={s.id} value={s.year}>
                      {s.year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.4, fontWeight: 'bold', borderRadius: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
