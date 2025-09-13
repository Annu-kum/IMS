import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const allowedRoutesForNonAdmin = [
  "/install",
  "/deinstall",
  "/reinstall",
  "/report",
];

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('Token');
  const { auth } = useAuth();
  const location = useLocation();

  if (!token) {
    // Not logged in at all
    return <Navigate to="/" />;
  }

  if (!auth.isSuperuser && !allowedRoutesForNonAdmin.includes(location.pathname)) {
    // Non-admin trying to access restricted route
    return <Navigate to="/over" />;
  }

  // Either admin or allowed non-admin
  return children;
};

export default PrivateRoute;

