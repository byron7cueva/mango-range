import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import { Exercise1 } from './pages/Exercise1';
import { Exercise2 } from './pages/Excercise2';

export const App = () => (
  <BrowserRouter>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/exercise1">Exercise1</Link>
        </li>
        <li>
          <Link to="/excercise2">Exercise2</Link>
        </li>
      </ul>
    </nav>
    <Switch>
      <Route path="/" exact component={Exercise1} />
      <Route path="/exercise1" exact component={Exercise1} />
      <Route path="/exercise2" exact component={Exercise2} />
    </Switch>
  </BrowserRouter>
)