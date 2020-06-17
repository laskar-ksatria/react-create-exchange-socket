import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './views/Login';
import Main from './views/Main';

function App() {
  return (
    <div className="App">
      <Router>
      <h1>App</h1>
      <Switch>
        <Route path="/" exact>
          <Login />
        </Route>
        <Route path="/main">
          <Main />
        </Route>
      </Switch>
      </Router>
    </div>
  );
}

export default App;
