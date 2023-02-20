import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes
} from 'react-router-dom';

import NewPlayer from './players/pages/NewPlayer';
import Players from './players/pages/Players';
import PlayerStats from './players/pages/PlayerStats';
import Matches from './matches/pages/Matches';
import NewMatch from './matches/pages/NewMatch';
import CompareStats from './compare/pages/CompareStats';
import Auth from './users/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
  const { token, login, logout, userId, isManager } = useAuth();

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
      <Route path="/matches" element={<Matches />} />
      <Route path="/matches/new" element={<NewMatch />} />
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
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
