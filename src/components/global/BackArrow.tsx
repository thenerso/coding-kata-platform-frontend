import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
// import {createBrowserHistory} from 'history';

const BackArrow = () => {
    const navigate = useNavigate();
    // const history = createBrowserHistory();

  const handleBack = () => {
    // console.log('history', history);
    navigate(-1);
  };

  return (
    <Button color="info" onClick={() => handleBack()} startIcon={<ArrowBack />}>
      Back
    </Button>
  );
};

export default BackArrow;
