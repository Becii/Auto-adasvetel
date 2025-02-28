import React, { createContext, useState, useContext, useEffect } from 'react';

// Kontextus létrehozása
const ThemeContext = createContext();

// Kontextus provider komponens
export const ThemeProvider = ({ children }) => {
  // Ellenőrizzük, hogy van-e mentett téma beállítás a localStorage-ban
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme);

  // Téma váltás függvény
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Téma változásakor frissítjük a localStorage-t és a body class-t
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Érték objektum, amit átadunk a provider-nek
  const value = {
    darkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook a téma kontextus használatához más komponensekben
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;