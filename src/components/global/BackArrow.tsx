import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBack from '@mui/icons-material/ArrowBack';

const BackArrow = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <button onClick={handleBack}>
      <ArrowBack /> Back
    </button>
  );
};

export default BackArrow;
