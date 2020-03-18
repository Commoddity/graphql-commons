import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    zIndex: 1000,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    alignItems: 'center',
    border: 5,
    padding: theme.spacing(2),
    textAlign: 'center'
  },
  avatar: {
    zIndex: 1000,
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    width: '120px',
    height: '120px',
    backgroundColor: '#29c0a8'
  },
  form: {
    zIndex: 1000,
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    textAlign: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#29c0a8'
  },
  accountCircle: {
    width: '100px',
    height: '100px',
    color: 'white'
  },
  button: {
    margin: '1em'
  }
}));

const LOGIN_USER = gql`
  mutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      id
    }
  }
`;

const Login = (props) => {
  const [state, setState] = useState({
    email: '',
    password: '',
    errors: {
      email: 'Email is not valid.',
      password: 'Password must be 5 characters long!'
    },
    invalid: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [
    loginUser,
    { loading: loginLoading, error: loginError, data: loginData }
  ] = useMutation(LOGIN_USER);

  const history = useHistory();

  useEffect(() => {
    if (props.loggedInStatus) {
      history.push('/');
    }
  });

  useEffect(() => {
    if (loginError) {
      const errorMessage = loginError.toString().split('error: ')[1];
      setState((prevState) => ({
        ...prevState,
        invalid: errorMessage
      }));
    } else if (!loginLoading && loginData) {
      props.handleLogin(loginData.loginUser.id);
      history.push('/');
    }
  }, [loginData, loginError]);

  const handleChange = (event) => {
    const { name, value } = event;
    let errors = state.errors;

    switch (name) {
      case 'email':
        errors.email =
          value.length === 0 || !validEmailRegex.test(value)
            ? 'Email is not valid.'
            : '';
        break;
      case 'password':
        errors.password =
          value.length === 0 || value.length < 5
            ? 'Password must be 5 characters long!'
            : '';
        break;
      default:
        break;
    }
    setState((prevState) => ({
      ...prevState,
      [name]: value,
      errors,
      invalid: ''
    }));
  };

  const validEmailRegex = RegExp(
    // eslint-disable-next-line
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  const { email, password, errors, invalid } = state;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (validateForm(state.errors)) {
      loginUser({
        variables: { email: email, password: password }
      });
    }
  };

  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <PersonIcon className={classes.accountCircle} />
      </Avatar>
      <Typography variant="h4">Login</Typography>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={state.email}
          onChange={(e) => handleChange(e.target)}
        />
        {submitted && errors.email.length > 0 && (
          <span className="error">{errors.email}</span>
        )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => handleChange(e.target)}
        />
        {submitted && errors.password.length > 0 && (
          <span className="error">{errors.password}</span>
        )}
        {submitted && invalid.length > 0 && (
          <span className="error">{invalid}</span>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          LOGIN
        </Button>
        <Grid container justify="center">
          <Grid item>
            <Link
              href="#"
              variant="body2"
              component={RouterLink}
              to="/signup-page"
            >
              {'Not a member? Sign up'}
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default Login;
