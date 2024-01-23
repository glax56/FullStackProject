const { formatSeconds } = require("../utils/formatTime");
const { showDbUptime } = require("../queries/db/dbQueries");

const getDbMeta = async (req, res) => {
  try {
    console.log(`[${req.url}] -  Getting server/db health ... `);
    const results = await showDbUptime();
    const dbMetaData = { upTime: formatSeconds(results[0].Value) };
    res
      .status(200)
      .send({ message: "Database connection healthy", data: dbMetaData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch meta" });
  }
};

module.exports = {
  getDbMeta,
};
