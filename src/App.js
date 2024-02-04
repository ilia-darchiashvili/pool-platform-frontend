import React, { useState, useEffect } from 'react';
import {
  // BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
  useLocation
} from 'react-router-dom';

import ReactGA from 'react-ga';

import NewPlayer from './players/pages/NewPlayer';
import Players from './players/pages/Players';
import PlayerStats from './players/pages/PlayerStats';
import Matches from './matches/pages/Matches';
import NewMatch from './matches/pages/NewMatch';
import CompareStats from './compare/pages/CompareStats';
import Auth from './users/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import NextEvent from './shared/components/NextEvent/NextEvent';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const nextEventInfoPathnames = ['/players', '/matches'];

const App = () => {
  const { token, login, logout, userId, isManager } = useAuth();
  const location = useLocation();
  const [ showNextEvent, setShowNextEvent ] = useState();

  const loggedOutRoutes = (
    <Routes>
      <Route path="/" element={<Navigate to="/players" />} />
      <Route path="/players" element={<Players />} />
      <Route path="/players/:playerId/stats" element={<PlayerStats />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/compare" element={<CompareStats />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
  const loggedInRoutes = (
    <Routes>
      <Route path="/" element={<Navigate to="/players" />} />
      <Route path="/players" element={<Players />} />
      <Route path="/players/:playerId/stats" element={<PlayerStats />} />
      <Route path="/players/new" element={<NewPlayer />} />
      <Route path="/players/:playerId" element={<NewPlayer />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/matches/new" element={<NewMatch />} />
      <Route path="/matches/:matchId" element={<NewMatch />} />
      <Route path="/compare" element={<CompareStats />} />
      <Route path="/auth" element={<Navigate to="/" />} />
    </Routes>
  )

  let routes;
  if (token) {
    routes = loggedInRoutes;
  } else {
    routes = loggedOutRoutes;
  }

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);
  }, []);

  useEffect(() => {
    if (!!location && nextEventInfoPathnames.includes(location.pathname)) {
      setShowNextEvent(true);
    } else {
      setShowNextEvent(false);
    }
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        isManager: isManager,
        login: login,
        logout: logout
      }}
    >
      {/* <Router> */}
        <MainNavigation />
        <main>
          {showNextEvent && <NextEvent />}
          {routes}
        </main>
        <div className="general-info-container center">
          <i className="fa fa-exclamation-circle"></i>
          <span className="general-info-label">Stats have been counted since 2023</span>
        </div>
      {/* </Router> */}
    </AuthContext.Provider>
  );
};

export default App;
