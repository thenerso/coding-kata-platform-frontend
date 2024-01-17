import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { useLocation, Location } from 'react-router-dom';

// Define the type for the history context
type HistoryContextType = Location[];

// Define the type for the context value, including the removeCurrentEntry method
interface HistoryContextValue {
  history: HistoryContextType;
  removeCurrentEntry: () => void;
}

// Create the history context with an initial empty array and a placeholder for removeCurrentEntry
const HistoryContext = createContext<HistoryContextValue>({ history: [], removeCurrentEntry: () => {} });

// Define the props for HistoryProvider
interface HistoryProviderProps {
  children: ReactNode;
}

const HistoryProvider: React.FC<HistoryProviderProps> = ({ children }) => {
  const [history, setHistory] = useState<HistoryContextType>([]);
  const location = useLocation();

  const removeCurrentEntry = () => {
    setHistory((prevHistory) => prevHistory.slice(0, -1));
  };

  useEffect(() => {
    setHistory(prevHistory => {
      // Only add the new location if it's different from the last location in the history stack
      if (prevHistory.length === 0 || location.pathname !== prevHistory[prevHistory.length - 1].pathname) {
        return [...prevHistory, location];
      }
      return prevHistory;
    });
  }, [location]);

  // Provide both history and removeCurrentEntry in the context value
  const contextValue = { history, removeCurrentEntry };

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
};

export { HistoryProvider, HistoryContext };
