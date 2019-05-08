//ConnectDB
const oracledb = require("oracledb");
const dbConfig = require("./dbConfig");

const query = async (queryString, paramVal) => {
  process.env.UV_THREADPOOL_SIZE = 10;
  process.env.ORA_SDTZ = "UTC";

  if (queryString) {
    //console.log(queryString)
    oracledb.outFormat = oracledb.OBJECT;

    const pool = await oracledb.createPool(dbConfig);
    const conn = await pool.getConnection();
    try {
      let executeResult;
      if (paramVal) {
        executeResult = await conn.execute(queryString, paramVal);
      } else {
        executeResult = await conn.execute(queryString);
      }
      await conn.commit();
      return executeResult.rows;
    } catch (err) {
      console.log("Db Con " + err.toString() + "   " + queryString);
      throw err;
    } finally {
      await conn.close();
      await pool.close();
    }
  }
  //console.log(executeResult)
};

const execute = async (queryString, paramVal,autoCommit=true) => {
  process.env.UV_THREADPOOL_SIZE = 10;
  process.env.ORA_SDTZ = "UTC";

  if (queryString) {
    oracledb.outFormat = oracledb.OBJECT;
    oracledb.autoCommit = autoCommit;

    const conn = await pool.getConnection();
    try {
      let executeResult;
      if (paramVal) {
        executeResult = await conn.execute(queryString, paramVal);
      } else {
        executeResult = await conn.execute(queryString);
      }
      return executeResult;
    } catch (err) {
      console.log("Db Con " + err.toString() + "   " + queryString);
      throw err;
    } finally {
      await conn.close();
    }
  }
  //console.log(executeResult)
};

module.exports = {
  query,
  execute
};