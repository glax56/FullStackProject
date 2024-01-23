const formatSeconds = (numerOfSecs) => {
  const days = Math.floor(numerOfSecs / (3600 * 24));
  const hours = Math.floor((numerOfSecs % (3600 * 24)) / 3600);
  const minutes = Math.floor((numerOfSecs % 3600) / 60);
  const seconds = numerOfSecs % 60;

  return `${days} days, ${hours} hrs, ${minutes} mins, ${seconds} secs`;
};

module.exports = { formatSeconds };
