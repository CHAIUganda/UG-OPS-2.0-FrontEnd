import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Pusher from 'pusher-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UIfx from 'uifx';
import notificationSound from './when.mp3';

import App from './App';
import * as notificationActions from './redux/actions/notificationsActions';
import * as subscriptionLockActions from './redux/actions/subscriptionLockActions';

const mapStateToProps = (state) => ({
  email: state.auth.email,
  subscriptionLock: state.subscriptionLock
});

const matchDispatchToProps = {
  AddNotification: notificationActions.AddNotification,
  changeLock: subscriptionLockActions.changeLock
};

function MainApp({
  AddNotification,
  email,
  changeLock,
  subscriptionLock
}) {
  const beep = new UIfx({ asset: notificationSound });
  if (email && !subscriptionLock) {
    useEffect(() => {
      const handleNotifications = (data) => {
        toast(data.title);
        beep.play();
        AddNotification(data);
      };

      const pusher = new Pusher('afacc8c93d042f2ec024', {
        cluster: 'ap2',
        encrypted: true
      });
      const channel = pusher.subscribe('notifications');
      channel.bind(email, (data) => handleNotifications(data));
      changeLock(true);

      return function cleanUp() {
        if (channel) {
          channel.unbind(email);
          changeLock(false);
        }
      };
    }, []);
  }

  return (
    <>
      <ToastContainer />
      <App />
    </>
  );
}

MainApp.propTypes = {
  AddNotification: PropTypes.func,
  changeLock: PropTypes.func,
  email: PropTypes.string,
  subscriptionLock: PropTypes.bool
};

export default connect(mapStateToProps, matchDispatchToProps)(MainApp);
