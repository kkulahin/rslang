const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  today.setTime(today.getTime() - today.getTimezoneOffset() * 60000);
  return today;
};

const getDateFromSeconds = (seconds) => {
  const day = new Date(seconds * 1000);
  day.setTime(day.getTime() + day.getTimezoneOffset() * 60000);
  return day;
};

const getTodaySeconds = () => {
  const today = getToday();
  const todaySec = Math.ceil(today.getTime() / 1000);
  return todaySec;
};

const getTodayMs = () => {
  const today = getToday();
  return today.getTime();
};

const checkDayDifference = (date1, date2) => {
  const newDate1 = new Date(date1.getTime());
  const newDate2 = new Date(date2.getTime());
  newDate1.setHours(0, 0, 0, 0);
  newDate2.setHours(0, 0, 0, 0);
  const diff = (newDate2 - newDate1) / 1000 / 60 / 60 / 24;
  return diff;
};

const checkDayDifferenceAbs = (date1, date2) => Math.abs(checkDayDifference(date1, date2));

export {
  getToday, getTodaySeconds,
  getTodayMs, getDateFromSeconds,
  checkDayDifference, checkDayDifferenceAbs,
};
