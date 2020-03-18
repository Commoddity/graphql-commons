import React, { useEffect, useState, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import Home from 'views/HomePage/Home.js';
import ProfilePage from 'views/ProfilePage/ProfilePage.js';
import LoginPage from 'views/LoginPage/LoginPage.js';
import SignupPage from 'views/SignupPage/SignupPage.js';
import WatchListPage from 'views/WatchListPage/WatchListPage.js';
import LoadingSpinner from 'views/LoadingSpinner/LoadingSpinner.js';
import Header from 'views/Header/Header';

import { flattenUserRelations } from './helpers/dataParsingHelpers';

const MAIN_PAGE_DATA = gql`
  {
    bills {
      parliamentary_session_id {
        id
      }
      id
      code
      title
      description
      introduced_date
      summary_url
      page_url
      full_text_url
      passed
      categories {
        id
      }
    }
    categories {
      id
      name
      uclassify_class
    }
  }
`;

const USER_DATA_QUERY = gql`
  query Users($id: Int!) {
    user(id: $id) {
      id
      first_name
      last_name
      username
      email
      phone_number
      postal_code
      email_notification
      sms_notification
      bills {
        id
      }
      categories {
        id
      }
    }
  }
`;

export default function App(props) {
  const [user, setUser] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const { loading: mainLoading, error: mainError, data: mainData } = useQuery(
    MAIN_PAGE_DATA
  );
  const [
    getUser,
    { loading: userLoading, error: userError, data: userData }
  ] = useLazyQuery(USER_DATA_QUERY);

  useEffect(() => {
    if (!userLoading && userData) {
      const user = userData ? flattenUserRelations(userData.user) : undefined;
      const loggedInStatus = userData ? true : false;
      setUser(user);
      setLoggedIn(loggedInStatus);
    }
  }, [userData]);

  // loginStatus();
  const loginStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_COMMONS_API}/logged_in`
      );
      if (response.data.logged_in) {
        handleLogin(response.data);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error occurred on loginStatus:', error);
    }
  };

  const handleProfileUpdate = async (user) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_COMMONS_API}/users/${user.id}`,
        {
          user
        }
      );
      if (res.data.status === 200) {
        // back end is only returning the user data and their categories, keep the old
        // user_bills (aka watchlist)
        // Other option is to have the API server return the user's bill
        setUser((prev) => ({ ...res.data.user, bills: prev.bills }));
      } else {
        console.error(
          `Error occurred on handleProfileUpdate: ${res.data.errors}`
        );
      }
    } catch (error) {
      console.error(`Error occurred on handleProfileUpdate: ${error}`);
    }
  };

  // const updateWatchList = (bills) => {
  //   setUser((prev) => ({
  //     ...prev,
  //     bills
  //   }));
  // };

  // Login/logout handlers
  const handleLogin = (data) => {
    getUser({
      variables: { id: data.id }
    });
  };

  const handleLogout = async () => {};

  if (mainLoading)
    return (
      <div
        style={{
          minHeight: '100vh',
          minWidth: '100vw',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  if (mainError) return `Error! ${mainError.message}`;

  if (mainData)
    return (
      <div>
        <Router>
          <Fragment>
            <Header
              color="transparent"
              brand="Commons"
              fixed
              changeColorOnScroll={{
                height: 200,
                color: 'white'
              }}
              user={user}
              loggedIn={loggedIn}
              handleLogout={handleLogout}
              {...props}
            />
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Home
                    {...props}
                    bills={mainData.bills}
                    categories={mainData.categories}
                    handleLogout={handleLogout}
                    loggedInStatus={loggedIn}
                    user={user}
                  />
                )}
              />
              <Route
                path="/login-page"
                render={() => (
                  <LoginPage
                    handleLogin={handleLogin}
                    loggedInStatus={loggedIn}
                  />
                )}
              />
              <Route
                path="/signup-page"
                render={(props) => (
                  <SignupPage
                    {...props}
                    categories={mainData.categories}
                    handleLogin={handleLogin}
                    loggedInStatus={loggedIn}
                  />
                )}
              />
              <Route
                path="/watch-list"
                render={(props) => (
                  <WatchListPage
                    {...props}
                    user={user}
                    bills={mainData.bills}
                    categories={mainData.categories}
                    handleLogin={handleLogin}
                    loggedInStatus={loggedIn}
                  />
                )}
              />
              <Route
                path="/user/:id"
                render={() => (
                  <ProfilePage
                    user={user}
                    handleProfileUpdate={handleProfileUpdate}
                    categories={mainData.categories}
                    loggedInStatus={loggedIn}
                  />
                )}
              />
            </Switch>
          </Fragment>
          )
        </Router>
      </div>
    );
}
