import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLocation, useNavigate, Location } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';

// Define the type for the history context
type HistoryContextType = Location[];

// Create the history context with an initial empty array
const HistoryContext = createContext<HistoryContextType>([]);

// Define the props for HistoryProvider
interface HistoryProviderProps {
  children: ReactNode;
}

const HistoryProvider: React.FC<HistoryProviderProps> = ({ children }) => {
  const [history, setHistory] = useState<HistoryContextType>([]);
  const location = useLocation();

  useEffect(() => {
    setHistory(prevHistory => {
      // Only add the new location if it's different from the last location in the history stack
      if (prevHistory.length === 0 || location.pathname !== prevHistory[prevHistory.length - 1].pathname) {
        console.log('History: ', [...prevHistory, location]);
        return [...prevHistory, location];
      }
      return prevHistory;
    });
  }, [location]);

  return (
    <HistoryContext.Provider value={history}>
      {children}
    </HistoryContext.Provider>
  );
};


export { HistoryProvider, HistoryContext };
