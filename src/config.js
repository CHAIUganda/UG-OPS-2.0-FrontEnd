export const BASE_URL = 'http://45.79.187.217:3040/';

// axios.defaults.headers.common = { token: tokenToSet };

export const returnStatusClass = (status) => {
  if (status.includes('Pending')) {
    return 'pending';
  } if (status.includes('Cancelled')) {
    return 'cancelled';
  } if (status.includes('Planned')) {
    return 'planned';
  } if (status.includes('Declined')) {
    return 'rejected';
  } if (status.includes('Approved')) {
    return 'approved';
  } if (status.includes('Taken')) {
    return 'taken';
  } if (status.includes('Not')) {
    return 'nottaken';
  }

  return '';
};
