import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Pusher from 'pusher-js';

import App from './App';
import * as notificationActions from './redux/actions/notificationsActions';

const mapStateToProps = (state) => ({
  email: state.auth.email
});

const matchDispatchToProps = {
  AddNotification: notificationActions.AddNotification
};

function MainApp({ AddNotification, email }) {
  useEffect(() => {
    const pusher = new Pusher('afacc8c93d042f2ec024', {
      cluster: 'ap2',
      encrypted: true
    });
    const channel = pusher.subscribe('notifications');
    channel.bind('ugops2', (data) => {
      if (email.trim() === data.staffEmail.trim()) {
        AddNotification(data);
      }
    });
  }, []);

  return (
    <App />
  );
}

MainApp.propTypes = {
  AddNotification: PropTypes.func,
  email: PropTypes.string
};

export default connect(mapStateToProps, matchDispatchToProps)(MainApp);
