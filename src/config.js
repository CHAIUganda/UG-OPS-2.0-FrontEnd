export const BASE_URL = 'http://45.79.187.217:3040/';

// axios.defaults.headers.common = { token: tokenToSet };

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
