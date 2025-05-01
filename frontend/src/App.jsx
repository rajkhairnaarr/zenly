import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
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
import AboutUs from './pages/AboutUs';
import OnboardingPage from './pages/OnboardingPage';
import { 
  EnergeticExperience, 
  AnxiousExperience, 
  DepressedExperience, 
  LethargicExperience,
  SadExperience,
  LonelyExperience,
  BoredExperience,
  ChillExperience,
  GlobalStyles
} from './components/MoodExperiences';

// Inner component to access AuthContext
function AppContent() {
  const { loading, backendError, retryBackend, error } = useContext(AuthContext);

  // Display a generic loading indicator while AuthContext is loading the user
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {backendError && (
          <div className="bg-red-100 p-4 text-center text-red-800 shadow-md border border-red-300 rounded-md m-4">
            <div className="flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Connection Error</span>
            </div>
            <p className="text-sm mb-3">{error || 'Unable to connect to the backend server.'}</p>
            <button 
              onClick={retryBackend}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-150 ease-in-out"
            >
              Retry Connection
            </button>
          </div>
        )}
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            
            {/* Mood Experience Routes */}
            <Route path="/energetic" element={<EnergeticExperience />} />
            <Route path="/anxious" element={<AnxiousExperience />} />
            <Route path="/depressed" element={<DepressedExperience />} />
            <Route path="/lethargic" element={<LethargicExperience />} />
            <Route path="/sad" element={<SadExperience />} />
            <Route path="/lonely" element={<LonelyExperience />} />
            <Route path="/bored" element={<BoredExperience />} />
            <Route path="/chill" element={<ChillExperience />} />
            
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
  );
}

function App() {
  return (
    <AuthProvider>
      <GlobalStyles />
      <AppContent />
    </AuthProvider>
  );
}

export default App; 