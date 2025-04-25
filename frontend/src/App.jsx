import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  // Try to connect to backend on different ports
  useEffect(() => {
    const findBackendPort = async () => {
      for (let port = 5001; port < 5020; port++) {
        try {
          setConnectionAttempts(prev => prev + 1);
          console.log(`Trying to connect to backend on port ${port}...`);
          const response = await fetch(`http://localhost:${port}/api`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
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
      
      // If we've tried all ports and still not connected, try again in 5 seconds
      if (!backendConnected && connectionAttempts < 10) {
        setTimeout(findBackendPort, 5000);
      }
    };
    
    findBackendPort();
  }, [backendConnected, connectionAttempts]);

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          {!backendConnected && (
            <div className="bg-orange-100 p-3 text-center text-orange-800 shadow-md">
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-orange-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting to backend server... (Attempt {connectionAttempts}/10)
              </div>
              <div className="text-sm mt-1">Please make sure the backend server is running.</div>
            </div>
          )}
          <Navbar />
          <main className="container mx-auto px-4 py-8 flex-grow">
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
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 