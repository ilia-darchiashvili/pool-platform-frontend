import React, { useState, useEffect } from 'react';
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
  const [ fullTimeString, setFullTimeString ] = useState();

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

  const getTimeString = (value, name) => {
    if (value > 1) {
      return name + 's';
    }

    return name;
  }

  const secondsToEvent = () => {
    const eventDate = new Date(2024, 2, 3, 11, 0);
    const currentDate = new Date();
    const diffInMilliseconds = eventDate.getTime() - currentDate.getTime();
    
    const diffInSeconds = Math.floor(diffInMilliseconds/1000);

    const day = Math.floor(diffInSeconds/(24*60*60));
    const hour = Math.floor(diffInSeconds/(60*60)) - day*24;
    const minute = Math.floor(diffInSeconds/60) - day*24*60 - hour*60;
    const second = diffInSeconds - day*24*60*60 - hour*60*60 - minute*60;

    const dayString = getTimeString(day, Object.keys({day}));
    const hourString = getTimeString(hour, Object.keys({hour}));
    const minuteString = getTimeString(minute, Object.keys({minute}));
    const secondString = getTimeString(second, Object.keys({second}));

    const generatedFullTimeString = `${day > 0 ? (day + ' ' + dayString + ' : ') : ''}
                                    ${day > 0 || hour > 0 ? (hour + ' ' + hourString + ' : ') : ''}
                                    ${day > 0 || hour > 0 || minute > 0 ? (minute + ' ' + minuteString + ' : ') : ''}
                                    ${day > 0 || hour > 0 || minute > 0 || second > 0 ? (second + ' ' + secondString) : ''}`;
    
    if (eventDate > currentDate) {
      setFullTimeString(generatedFullTimeString);
    } else {
      setFullTimeString();
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => secondsToEvent(), 1000);

    return () => clearInterval(intervalId);
  });

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
        {fullTimeString && (
          <div style={{position: 'fixed', top: '80px', left: '16px', color: 'white'}}>
            <div style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '4px'}}>Time To Next Event</div>
            <div style={{color: 'orange'}}>{fullTimeString}</div>
            <div style={{fontSize: '18px', fontWeight: 'bold', marginTop: '4px'}}>Leaderbet National League - Round 1</div>
            <div>4 Feb 2024, 11:00</div>
          </div>
        )}
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
