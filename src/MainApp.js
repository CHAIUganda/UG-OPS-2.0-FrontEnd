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

const mapStateToProps = (state) => ({
  email: state.auth.email
});

const matchDispatchToProps = {
  AddNotification: notificationActions.AddNotification
};

function MainApp({ AddNotification, email }) {
  // debugger;
  const beep = new UIfx({ asset: notificationSound });
  if (email) {
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

      return function cleanUp() {
        if (channel) {
          channel.unbind('ugops2');
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
  email: PropTypes.string
};

export default connect(mapStateToProps, matchDispatchToProps)(MainApp);
