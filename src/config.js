require('dotenv').config();

export const BASE_URL = 'https://ugtest.clintonhealthaccess.org:3041/';
// export const BASE_URL = 'https://ugtest.clintonhealthaccess.org:3041/';
// export const BASE_URL = `http://${process.env.BACKEND_IP}:${process.env.BACKEND_PORT}/`;
// debugger;

export const returnStatusClass = (status) => {
  if (status === 'approvedWords') {
    return 'approvedWords';
  } if (status === 'rejectedWords') {
    return 'rejectedWords';
  } if (status.toLowerCase().includes('pending')) {
    return 'pending';
  } if (status.toLowerCase().includes('cancelled')) {
    return 'cancelled';
  } if (status.toLowerCase().includes('planned')) {
    return 'planned';
  } if (status.toLowerCase().includes('declined')) {
    return 'rejected';
  } if (status.toLowerCase().includes('approved')) {
    return 'approved';
  } if (status.toLowerCase().includes('taken')) {
    return 'taken';
  } if (status.toLowerCase().includes('not')) {
    return 'nottaken';
  } if (status.includes('to be saved')) {
    return 'pending';
  } if (status.toLowerCase().includes('active')) {
    return 'approved';
  } if (status.toLowerCase().includes('archive')) {
    return 'rejected';
  }

  return '';
};

// axios.defaults.headers.common = { token: tokenToSet };

/*
const turnOffNotification = () => {
  axios.defaults.headers.common = { token };
  const endPoint = `${BASE_URL}leaveApi/supervisorHandleLeave`;
  axios.post(endPoint, manageLeaveObject)
    .then((res) => {})
    .catch((err) => {
      if (err && err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
    });
};
*/
