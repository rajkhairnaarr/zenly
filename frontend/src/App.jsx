import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import Journal from './pages/Journal';
import MeditationLibrary from './pages/MeditationLibrary';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [backendPort, setBackendPort] = useState(5001);
  const [backendConnected, setBackendConnected] = useState(false);
  
  // Try to connect to backend on different ports
  useEffect(() => {
    const findBackendPort = async () => {
      for (let port = 5001; port < 5020; port++) {
        try {
          console.log(`Trying to connect to backend on port ${port}...`);
          const response = await fetch(`http://localhost:${port}/api`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            timeout: 1000
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log(`Connected to backend on port ${port}`, data);
            setBackendPort(port);
            setBackendConnected(true);
            // Set the port in localStorage for components to use
            localStorage.setItem('backendPort', port);
            break;
          }
        } catch (err) {
          console.log(`Failed to connect on port ${port}:`, err.message);
        }
      }
    };
    
    findBackendPort();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {!backendConnected && (
            <div className="bg-yellow-100 p-2 text-center text-yellow-800">
              Connecting to backend server...
            </div>
          )}
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/mood" element={
                <PrivateRoute>
                  <MoodTracker />
                </PrivateRoute>
              } />
              <Route path="/journal" element={
                <PrivateRoute>
                  <Journal />
                </PrivateRoute>
              } />
              <Route path="/meditations" element={
                <PrivateRoute>
                  <MeditationLibrary />
                </PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute adminOnly={true}>
                  <AdminPanel />
                </PrivateRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 