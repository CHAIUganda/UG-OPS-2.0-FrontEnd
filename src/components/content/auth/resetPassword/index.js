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

import { BASE_URL } from '../../../../config';
import * as authActions from '../../../../redux/actions/authActions';

const matchDispatchToProps = {
  logUserIn: authActions.logUserIn
};

const mapStateToProps = () => ({ });

function ResetPassword(props) {
  const { logUserIn } = props;
  const [email, setEmail] = useState('aoboth@clintonhealthaccess.org');
  const [password, setPassword] = useState('123456');
  const [confirmPass, setConfirmPass] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');

  const loginSuccess = (token) => {
    axios.defaults.headers.common = { token };
    const apiRoute = `${BASE_URL}auth/getLoggedInUser`;
    axios.get(apiRoute)
      . then((res) => {
        const {
          department,
          fName,
          gender,
          internationalStaff,
          lName,
          position
        } = res.data;

        const userObject = {
          email,
          token,
          gender,
          internationalStaff,
          department,
          firstName: fName,
          lastName: lName,
          Position: position
        };
        logUserIn(userObject);
      })
      .catch((err) => {
        setSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSpinner(true);
    setError('');
    axios.post(`${BASE_URL}auth/login`, {
      email,
      password
    })
      .then((res) => {
        setSpinner(false);
        if (res && res.data && res.data.token) {
          loginSuccess(res.data.token);
        } else {
          setError('Sorry! Error in response');
        }
      })
      .catch((err) => {
        setSpinner(false);
        if (err && err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message);
        }
      });
  };

  const handleChange = (event) => {
    setError('');
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else {
      setConfirmPass(value);
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
        <h3 className="signInHeading">Reset Password</h3>
        {error && <div className="errorFeedback"> {error} </div>}
        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>email @ </InputGroupText>
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
              <InputGroupText>New Password</InputGroupText>
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

        <FormGroup>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Confirm New Password</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="password"
              type="password"
              value={confirmPass}
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

ResetPassword.propTypes = {
  logUserIn: PropTypes.func
};

export default connect(mapStateToProps, matchDispatchToProps)(ResetPassword);
