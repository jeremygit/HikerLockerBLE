import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthState = {
  Initializing: 0,
  Initialized: 1,
}

export default function AuthProvider({ children }) {
  
  const [state, setState] = useState(AuthState.Initializing);
  const [token, setToken] = useState(null);

  const login = useCallback(() => {
    const fakeToken = Math.random().toString(16).slice(2);
    setToken(fakeToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  useEffect(() => {
    setState(AuthState.Initialized);
  }, []);

  return (
    <AuthContext.Provider value={{
      state,
      token,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}