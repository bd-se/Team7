import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './Router';
import './styles/tailwind.css';

ReactDOM.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
  document.getElementById('root')
);