import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { HistoryContext } from "./HistoryProvider";
// import {createBrowserHistory} from 'history';

const BackArrow: React.FC = () => {
    const navigate = useNavigate();
    const history = useContext(HistoryContext);
  
    const handleBack = () => {
      // Find the last unique location
      for (let i = history.length - 2; i >= 0; i--) {
        if (history[i].pathname !== history[history.length - 1].pathname) {
          navigate(history[i].pathname);
          return;
        }
      }
      navigate('/'); // Fallback if no unique history entry is found
    };
  
    return (
      <Button color="info" onClick={handleBack} startIcon={<ArrowBack />}>
        Back
      </Button>
    );
  };

export default BackArrow;
