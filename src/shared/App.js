import './App.css';
import React from 'react';

import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../redux/configStore';

import PostList from '../pages/PostList';
import Login from '../pages/Login';
import Signup from '../pages/Signup'
import Header from '../components/Header';
import PostWrite from '../pages/PostWrite';
import Permit from './Permit';
import PostDetail from '../pages/PostDetail';
import Search from './Search';
import Notification from '../pages/Notification';

import { Grid } from '../elements';
import { Button } from '../elements';

import { apiKey } from './firebase';

import { useDispatch } from 'react-redux';
import { actionCreators as userActions } from '../redux/modules/user'

function App() {
  const dispatch = useDispatch();
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;
  
  React.useEffect(() => {
    if (is_session) {
      dispatch(userActions.loginCheckFB());
    }
  })

  return (
    <React.Fragment>
      <Grid>
        <Header />
        <ConnectedRouter history={history}>
          <Route path="/" exact component={PostList} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/write" exact component={PostWrite} />
          <Route path="/post/:id" exact component={PostDetail} />
          <Route path="/search" exact component={Search} />
          <Route path="/notification" exact component={Notification} />
        </ConnectedRouter>
      </Grid>
      <Permit>
        <Button is_float text="+" _onClick={() => {history.push('/write')}}></Button>
      </Permit>
    </React.Fragment>
  );
}

export default App;



