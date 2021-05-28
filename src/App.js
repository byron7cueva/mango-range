import './css/main.css';
import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { Exercise1 } from './pages/Exercise1';
import { Exercise2 } from './pages/Excercise2';
import { Layout } from './components/Layout';

export const App = () => (
  <BrowserRouter> 
    <Layout>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/exercise1" />
        </Route>
        { /* Provide a localhost:8080/exercise1 */}
        <Route path="/exercise1" exact component={Exercise1} />
        { /* Provide a localhost:8080/exercise2 */ }
        <Route path="/exercise2" exact component={Exercise2} />
      </Switch>
    </Layout>
  </BrowserRouter>
)