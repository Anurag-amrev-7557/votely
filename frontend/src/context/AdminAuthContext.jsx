import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

// Master credentials for testing
const MASTER_EMAIL = 'admin@votely.com';
const MASTER_PASSWORD = 'admin123';

export const AdminAuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin token exists in localStorage
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken);
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Check against master credentials
      if (email === MASTER_EMAIL && password === MASTER_PASSWORD) {
        const token = 'admin-token-' + Date.now(); // Generate a simple token
        localStorage.setItem('adminToken', token);
        setIsAdmin(true);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Export the hook as a named export
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === null) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}; 