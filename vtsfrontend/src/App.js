import './App.css';
import {Routes,Route } from 'react-router-dom';
import  LoginApp  from './Components/account/Signin';
import MainLayout from './Components/Dashboard/Dashboards';
import PrivateRoute from './Components/account/Privatelogin';
import PublicRoute from './Components/account/PublicRoute'; 
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
