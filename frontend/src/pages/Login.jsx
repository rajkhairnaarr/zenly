import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showAdminInfo, setShowAdminInfo] = useState(false);

  const { login, error, clearError, guestLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearError();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleGuestLogin = () => {
    guestLogin();
    navigate('/');
  };

  const toggleAdminInfo = () => {
    setShowAdminInfo(!showAdminInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg hover-lift">
        <div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back to Zenly
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={onChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="flex flex-col space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <button
            onClick={handleGuestLogin}
            className="btn btn-outline w-full"
          >
            Continue as Guest
          </button>
          
          <div className="text-sm text-center mt-4">
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 