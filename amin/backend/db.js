const sql = require("mssql/msnodesqlv8");

const config = {
  server: "localhost\\SQLEXPRESS",
  database: "web_dat_ve",
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

const poolPromise = sql.connect(config);

module.exports = {
  sql,
  poolPromise,
};
