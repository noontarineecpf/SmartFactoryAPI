const db = require("../../../db");
const getLoginByRFID = async ctx => {
  console.log("getLoginByRFID");
  try {
    const sql = `SELECT EL.PASSWORD , EL.EMPLOYEE_ID , EI.DESC_LOC EMP_NAME_LOC , EI.DESC_ENG EMP_NAME_ENG 
                    FROM FD_RFID_EMPLOYEE_LOGIN EL , FM_EMPLOYEE_INFO EI 
                    WHERE EL.RFID_NO = :rfidNo AND 
                    EL.EMPLOYEE_ID = EI.EMPLOYEE_ID`;

    const req = ctx.params;
    const params = {
      rfidNo: req.rfidNo
    };

    let resultRows = await db.query(sql, params);
    console.log(resultRows.length);
    if (resultRows.length == 0) {
      ctx.response.status = 404;
      ctx.body = "ไม่พบข้อมูล RFID NO นี้";
    } else {
      ctx.body = JSON.stringify(resultRows);
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getLoginByRFID
};