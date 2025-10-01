import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import SignupForm from './pages/signup';
import Forget from './pages/forget';
import Lessons from './pages/Lessons';
import Dashboard from './pages/Dashboard';
import SuperDashboard from './pages/SuperDashboard';
import CreateAdmin from './pages/CreateAdmin';
import ManageUser from './pages/ManageUser';
import ManageExam from './pages/ManageExam';
import ManageQuestion from './pages/ManageQuestion';
import CreateQuestion from './pages/CreateQuestion';
import ManageLesson from './pages/ManageLesson';
import CreateExam from './pages/CreateExam';
import PurchasedLessons from './pages/PurchasedLessons';
import Exams from './pages/Exams';
import StartExam from './pages/StartExam';
import ShowScore from './pages/ShowScore';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
  <>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path='/forget' element={<Forget/>} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />  
          <Route path="/super-dashboard" element={<ProtectedRoute><SuperDashboard /></ProtectedRoute>} />  
          <Route path="/create-admin" element={<ProtectedRoute><CreateAdmin /></ProtectedRoute>} />  
          <Route path="/manage-user" element={<ProtectedRoute><ManageUser /></ProtectedRoute>} />  
          <Route path="/manage-exam" element={<ProtectedRoute><ManageExam /></ProtectedRoute>} />  
          <Route path="/manage-question" element={<ProtectedRoute><ManageQuestion /></ProtectedRoute>} />  
          <Route path="/create-question" element={<ProtectedRoute><CreateQuestion /></ProtectedRoute>} />  
          <Route path="/manage-lesson" element={<ProtectedRoute><ManageLesson /></ProtectedRoute>} />  
          <Route path="/create-exam" element={<ProtectedRoute><CreateExam /></ProtectedRoute>} />  
          <Route path="/purchased-lessons" element={<ProtectedRoute><PurchasedLessons /></ProtectedRoute>} />  
          <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />  
          <Route path="/start-exam" element={<ProtectedRoute><StartExam /></ProtectedRoute>} />  
          <Route path="/show-score" element={<ProtectedRoute><ShowScore /></ProtectedRoute>} />   
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />   
          <Route path="/reset-password" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />   
        </Routes>
      </AuthProvider>
    </Router>
   </>
  )
}

export default App
