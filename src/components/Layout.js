import React from 'react';

import { Link } from 'react-router-dom';

export const Layout = (props) => (
  <>
    <nav className="menu">
      <ul>
        <li>
          <Link to="/exercise1">Exercise1</Link>
        </li>
        <li>
          <Link to="/exercise2">Exercise2</Link>
        </li>
      </ul>
    </nav>
    { props.children }
  </>
);