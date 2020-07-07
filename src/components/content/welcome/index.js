/**
 *  This file handles the okta authentication. Modify with care.
 *
 */

import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as authActions from '../../../redux/actions/authActions';
import * as notificationActions from '../../../redux/actions/notificationsActions';
import CommonSpinner from '../../common/spinner';
import { BASE_URL } from '../../../config';

import chai from '../../../assets/img/chai.svg';
import './welcome.css';

const mapStateToProps = () => ({ });

const matchDispatchToProps = {
  logUserIn: authActions.logUserIn,
  setInitialNotifications: notificationActions.setInitialNotifications
};

function Welcome({
  logUserIn,
  setInitialNotifications,
}) {
  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState('');

  const setUpUser = (tokenToSet) => {
    setSpinner(true);
    setError('');
    axios.defaults.headers.common = { token: tokenToSet };
    const apiRoute = `${BASE_URL}auth/getLoggedInUser`;
    axios.get(apiRoute)
      . then((res) => {
        const {
          department,
          fName,
          gender,
          internationalStaff,
          lName,
          position,
          email,
          _id,
          leaveDetails,
          supervisorDetails,
          notifications
        } = res.data;

        const userObject = {
          ...res.data,
          email,
          token: tokenToSet,
          gender,
          internationalStaff,
          department,
          firstName: fName,
          lastName: lName,
          Position: position,
          id: _id,
          leaveDetails,
          supervisor: supervisorDetails
        };
        setInitialNotifications(notifications);
        logUserIn(userObject);
        setSpinner(false);
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

  useEffect(() => {
    debugger;
    if (authState.isAuthenticated) {
      authService.getUser().then((info) => {
        setUserInfo(info);
        const { accessToken } = authState;
        setUpUser(`Bearer ${accessToken}`);
      });
    }
  }, [authState, authService]); // Update if authState changes

  if (error) {
    return (
      <div className="setContentInline contentbgColor welcome">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (spinner) {
    return (
      <div className="setContentInline contentbgColor welcome">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info text-center" role="alert">
              <div><CommonSpinner /></div>
              <p>Getting things ready for you.....</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (authState.isPending) {
    return (
      <div className="setContentInline contentbgColor welcome">
        <div className="row">
          <div className="col-12">
            Pending...
          </div>
        </div>
      </div>
    );
  }

  if (authState.isAuthenticated && !userInfo) {
    return (
      <div className="setContentInline contentbgColor welcome">
        <div className="row">
          <div className="col-12">
            Loading user information...
          </div>
        </div>
      </div>
    );
  }

  if (authState.isAuthenticated && userInfo) {
    return (
      <div className="setContentInline contentbgColor welcome">
        <div className="row">
          <div className="col-12">
            <div className="imageDiv">
              <img src={chai} alt="logo" className="img-fluid"/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="setContentInline contentbgColor welcome">
      <div className="row">
        <div className="col-12">
          Please Login in to continue.
        </div>
      </div>
    </div>
  );
}

Welcome.propTypes = {
  logUserIn: PropTypes.func,
  setInitialNotifications: PropTypes.func,
};

export default connect(mapStateToProps, matchDispatchToProps)(Welcome);


/*
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights
 reserved.
 * The Okta software accompanied by this notice is provided pursuant
 to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// import { useOktaAuth } from '@okta/okta-react';
// import React, { useState, useEffect } from 'react';
// // import { Button, Header } from 'semantic-ui-react';

// const Welcome = () => {
//   const { authState, authService } = useOktaAuth();
//   const [userInfo, setUserInfo] = useState(null);

//   useEffect(() => {
//     debugger;
//     if (!authState.isAuthenticated) {
//       // When user isn't authenticated, forget any user info
//       setUserInfo(null);
//     } else {
//       authService.getUser().then((info) => {
//         setUserInfo(info);
//         console.log(info);
//         console.log(info.email);
//       });
//     }
//   }, [authState, authService]); // Update if authState changes

//   if (authState.isPending) {
//     return (
//       <div>Loading...</div>
//     );
//   }

//   // if (!authState.isAuthenticated) {
//   //   return <div>Authenticating...</div>
//   // }

//   if (authState.isAuthenticated && !userInfo) {
//     return <div>Loading user information...</div>;
//   }

//   if (authState.isAuthenticated && userInfo) {
//     return (
//       <div>
//         <p> Welcome back, {userInfo.name} !</p>
//       </div>
//     );
//   }

//   return (
//     <div></div>
//   );
// };
// export default Welcome;
