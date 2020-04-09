import React, { useState } from 'react';
// prettier-ignore
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner
} from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { BASE_URL } from '../../../../config';
import * as authActions from '../../../../redux/actions/authActions';
import './signin.css';

const matchDispatchToProps = {
  logUserIn: authActions.logUserIn
};

const mapStateToProps = () => ({ });

function SignIn(props) {
  const { logUserIn } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [spinner, setSpinner] = useState(false);
  const [loginError, setLoginError] = useState('');

  const loginSuccess = (token) => {
    axios.defaults.headers.common = { token };
    const apiRoute = `${BASE_URL}auth/getLoggedInUser`;
    axios.get(apiRoute)
      . then((res) => {
        console.log(res.data);
        debugger;
        const {
          department,
          fName,
          gender,
          internationalStaff,
          lName,
          position,
          leaveDetails,
          _id,
          supervisorDetails
        } = res.data;

        const userObject = {
          ...res.data,
          email,
          token,
          gender,
          internationalStaff,
          department,
          firstName: fName,
          lastName: lName,
          Position: position,
          leaveDetails,
          id: _id,
          supervisor: supervisorDetails
        };
        logUserIn(userObject);
        setSpinner(false);
      })
      .catch((err) => {
        setSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setLoginError(err.response.data.message);
        } else {
          setLoginError(err.message);
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSpinner(true);
    setLoginError('');
    axios.post(`${BASE_URL}auth/login`, {
      email,
      password
    })
      .then((res) => {
        if (res && res.data && res.data.token) {
          Cookies.set('token', res.data.token);
          loginSuccess(res.data.token);
        } else {
          setSpinner(false);
          setLoginError('Sorry! Error in response');
        }
      })
      .catch((err) => {
        setSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setLoginError(err.response.data.message);
        } else {
          setLoginError(err.message);
        }
      });
  };

  const loginAs = (email2Set) => {
    setEmail(email2Set);
  };

  const handleChange = (event) => {
    setLoginError('');
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const buttonText = () => {
    if (spinner) {
      return (
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
      );
    }
    return 'Submit';
  };

  return (
    <div className="SigninFormStyle">
      <Form onSubmit={handleSubmit}>
        <h3 className="signInHeading">Sign In</h3>
        <p className="signInAs">HR, sys admin, supervisor (Ssebale Paul): <span className="submitButton pointerCursor" onClick={() => loginAs('spaul@clintonhealthaccess.org')}>set as Paul</span></p>
        <p className="signInAs">sys admin, supervisor, national (Oboth Abel): <span className="submitButton pointerCursor" onClick={() => loginAs('aoboth@clintonhealthaccess.org')}>set as Abel</span></p>
        <p className="signInAs">expat (Vanessa Karungi): <span className="submitButton pointerCursor" onClick={() => loginAs('vkarungi@clintonhealthaccess.org')}>set as Vanessa</span></p>
        <p>Just click submit to preview</p>
        {loginError && <div className="errorFeedback"> {loginError} </div>}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>@ </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="email@clintonhealthaccess.org"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>***</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={handleChange}
              required
              name="password"
            />
          </InputGroup>
        </FormGroup>
        <button className="submitButton" type="submit">
          {buttonText()}
        </button>
      </Form>
    </div>
  );
}

SignIn.propTypes = {
  logUserIn: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(SignIn);
