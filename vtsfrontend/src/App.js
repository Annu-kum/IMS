// import logo from './logo.svg';
import './App.css';
import {Routes,Route,Link as RouterLink, BrowserRouter } from 'react-router-dom';
import  LoginApp  from './Components/account/Signin';
import MainLayout from './Components/Dashboard/Dashboards';
import ChangePassword from './Components/account/ChangePassword';
import OverallCarts from './Components/Dashboard/Pages/OverallCarts';
import PrivateRoute from './Components/account/Privatelogin';
import PublicRoute from './Components/account/PublicRoute';
import { Link } from '@mui/material';
import axios from 'axios'; 
import { AuthProvider } from "./Components/account/AuthContext";


const App=()=> {
  
  return (
<AuthProvider>
    <Routes>
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <LoginApp />
          </PublicRoute>
        } 
      />
      <Route 
        path="/*" 
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        } 
      />
    </Routes>
</AuthProvider>
  );
}

export default App;
