import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from 'react-router-dom';

import Header from './components/UI/Header';
import LandingPage from './components/BuyerPage';
import Register from './components/Authentication/Register';
import Login from './components/Authentication/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Seller from './components/Seller/Seller';
import Product from './components/Seller/Product';
import SellerRoute from './components/SellerRoute';
import BuyerRoute from './components/BuyerRoute';
import LogoutAll from './components/Authentication/LogoutAll';

const App = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [authorized, setAuthorized] = useState(token);
  console.log(authorized, token);

  return (
    <div className='h-full'>
      <Router>
        <Header
          className='display-block'
          authorized={authorized}
          role={role}
          setAuthorized={setAuthorized}
        ></Header>
        <Switch>
          <Route path='/register'>
            <Register
              authorized={authorized}
              role={role}
              setAuthorized={setAuthorized}
            ></Register>
          </Route>
          <Route path='/login'>
            <Login
              authorized={authorized}
              role={role}
              setAuthorized={setAuthorized}
            ></Login>
          </Route>
          <Route path='/logout/all'>
            <LogoutAll
              authorized={authorized}
              role={role}
              setAuthorized={setAuthorized}
            ></LogoutAll>
          </Route>
          <BuyerRoute exact path='/' component={LandingPage} />
          <SellerRoute exact path='/seller' component={Seller} />
          <ProtectedRoute exact path='/product/:id' component={Product} />

          {/* <Route path="/account">
            <ProtectedRoute
              authorized={authorized}
              setAuthorized={setAuthorized}
            ></ProtectedRoute>
          </Route> */}
        </Switch>
      </Router>
    </div>
  );
};

export default App;
