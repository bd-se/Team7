// Import Tailwind CSS
// Import Hero component
import Hero from './components/Hero';
import './styles/tailwind.css';
      <Hero />
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Game from './pages/Game';
import Profile from './pages/Profile';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" component={Landing} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/game" component={Game} />
        <Route path="/profile" component={Profile} />
      </Routes>
    </Router>
  );
};

export default AppRouter;