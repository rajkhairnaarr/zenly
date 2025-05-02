import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

const Navbar = () => {
  const { user, logout, isGuest } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update current page in navigation
  useEffect(() => {
    setNavigation(
      navigation.map(item => ({
        ...item,
        current: item.href === location.pathname
      }))
    );
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [navigation, setNavigation] = useState([
    { name: 'Dashboard', href: '/', current: true },
    { name: 'Mood Tracker', href: '/mood', current: false },
    { name: 'Journal', href: '/journal', current: false },
    { name: 'Meditations', href: '/meditations', current: false },
    { name: 'About Us', href: '/about', current: false },
  ]);

  useEffect(() => {
    if (user?.role === 'admin') {
      if (!navigation.some(item => item.name === 'Admin Panel')) {
        setNavigation([...navigation, { name: 'Admin Panel', href: '/admin', current: false }]);
      }
    }
  }, [user]);

  const navbarClasses = `fixed w-full z-50 transition-all duration-300 ${
    scrolled 
      ? 'bg-white shadow-md py-2' 
      : 'bg-white/90 backdrop-blur-sm py-4'
  }`;

  return (
    <Disclosure as="nav" className={navbarClasses}>
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link 
                    to="/" 
                    className="text-2xl font-bold text-primary-600 transition-all duration-300 hover:text-primary-800 relative group"
                  >
                    Zenly
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-all duration-300 relative ${
                        item.current
                          ? 'text-primary-600 font-semibold'
                          : 'text-gray-500 hover:text-primary-600'
                      }`}
                    >
                      {item.name}
                      <span 
                        className={`absolute -bottom-1 left-0 h-0.5 bg-primary-500 transition-all duration-300 ${
                          item.current ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      ></span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {isGuest && (
                  <span className="mr-3 text-xs px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full font-medium animate-pulse">
                    Guest Mode
                  </span>
                )}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 hover:ring-2 hover:ring-primary-300">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center transition-all duration-300 hover:bg-primary-200">
                        <span className="text-primary-600 font-medium text-base">
                          {user?.name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {isGuest && (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/login"
                                className={`${
                                  active ? 'bg-primary-50 text-primary-700' : ''
                                } block w-full px-4 py-2 text-left text-sm transition-colors duration-150 font-medium text-gray-700`}
                              >
                                Sign in
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/register"
                                className={`${
                                  active ? 'bg-primary-50 text-primary-700' : ''
                                } block w-full px-4 py-2 text-left text-sm transition-colors duration-150 font-medium text-gray-700`}
                              >
                                Register
                              </Link>
                            )}
                          </Menu.Item>
                          <div className="border-t border-gray-100 my-1"></div>
                        </>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? 'bg-primary-50 text-primary-700' : ''
                            } block w-full px-4 py-2 text-left text-sm transition-colors duration-150 font-medium text-gray-700`}
                          >
                            {isGuest ? 'Exit Guest Mode' : 'Sign out'}
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-primary-50 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-300">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Transition
            as={Fragment}
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-150 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={`block py-2 pl-3 pr-4 text-base font-medium transition-all duration-200 ${
                      item.current
                        ? 'border-l-4 border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-l-4 border-transparent text-gray-500 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {user?.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.name}
                      {isGuest && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full animate-pulse">
                          Guest
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {isGuest && (
                    <>
                      <Disclosure.Button
                        as={Link}
                        to="/login"
                        className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
                      >
                        Sign in
                      </Disclosure.Button>
                      <Disclosure.Button
                        as={Link}
                        to="/register"
                        className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
                      >
                        Register
                      </Disclosure.Button>
                    </>
                  )}
                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200"
                  >
                    {isGuest ? 'Exit Guest Mode' : 'Sign out'}
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;