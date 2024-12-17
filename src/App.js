import React, { useEffect } from 'react';
import Routes from './pages/route/Routes';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getOngoingSmsDutyDtls } from './store/slice/smsDutySlice';
import { getOngoingRollingDutyDtls } from './store/slice/rollingDutySlice';

axios.defaults.baseURL="http://localhost:8080"

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOngoingSmsDutyDtls());
    dispatch(getOngoingRollingDutyDtls());
  }, [dispatch])

  return (
    <Routes />
  );
}

export default App;
