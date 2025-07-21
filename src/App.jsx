import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StatusPage from './pages/StatusPage';
import Login from './pages/Login';
import ManageIncidents from './pages/ManageIncidents';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<StatusPage />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
        <Route 
          path="/manages" 
          element={
            <ProtectedRoute>
              <ManageIncidents />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;