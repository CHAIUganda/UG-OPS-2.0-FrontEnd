const getDatesInBetween = (startDate, endDate) => {
  const dates = [];
  let currentDate = startDate;

  // eslint-disable-next-line func-names
  const addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};

export default getDatesInBetween;
