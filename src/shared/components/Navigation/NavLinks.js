import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import Button from '../FormElements/Button';
import './NavLinks.css';

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <>
      <ul className="nav-links">
        <li>
          <NavLink to="/players">
            Players
          </NavLink>
        </li>
        <li>
          <NavLink to="/matches">
            Matches
          </NavLink>
        </li>
        <li>
          <NavLink to="/compare">
            Compare
          </NavLink>
        </li>
        {auth?.isLoggedIn && auth?.isManager && (
          <>
            <li>
              <NavLink to="/players/new">
                Add Player
              </NavLink>
            </li>
            <li>
              <NavLink to="/matches/new">
                Add Match
              </NavLink>
            </li>
            <li>
              <NavLink to="/">
                <Button onClick={auth.logout}>&#x2713;</Button>
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </>
  )
};

export default NavLinks;
