const connection = require("../../config/db");

// Save household
const showDbUptime = async (payload) => {
  //Query
  let query = `SHOW GLOBAL STATUS LIKE "Uptime";`;

  //Execute query
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  showDbUptime,
};
