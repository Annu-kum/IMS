import { Navigate } from 'react-router-dom';
import {useAuth}  from  './AuthContext';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('Token'); // Example check for authentication
  const {auth} = useAuth();

  if(token && auth.isSuperuser){
   return <Navigate to="/over"/>
}
  return children;
};


export default PublicRoute;
