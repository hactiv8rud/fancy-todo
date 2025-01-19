function getExpiredAt(milliseconds) {
  let time = new Date();
  time.setMilliseconds(time.getMilliseconds() + milliseconds);
  return time;
}

module.exports = getExpiredAt;