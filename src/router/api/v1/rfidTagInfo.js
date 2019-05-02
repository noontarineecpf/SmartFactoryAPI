const moment = require("moment");
const constants = require("../../../utils/constants");
const db = require("../../../db");

const setRfidTagInfos = async (params) => {
  
  try {
    let sql = `INSERT
       INTO FM_RFIDTAG_INFO
         (
           PLANT_CODE,
           RFID_NO,
           RFID_TYPE,
           PRODUCTION_NO,
           PRODUCTION_LINE,
           JOB_ID,
           BRAND_CODE,
           PRODUCT_CODE,
           LOT_NO,
           SHIFT_CODE,
           RECEIVE_DATE,
           PRODUCTION_DATE,
           LOCATION_CODE,
           USER_CREATE,
           CREATE_DATE,
           LAST_USER_ID,
           LAST_UPDATE_DATE,
           SUPERVISOR_CODE
         )
         VALUES
         (
           :plantCode,
           :rfidNo,
           :rfidType,
           :prdNo,
           :prdLine,
           :jobId,
           :brandCode,
           :prdCode,
           :lotNo,
           :shiftCode,
           TO_DATE(:productionDate,'${constants.SLASH_DMY}'),
           TO_DATE(:productionDate,'${constants.SLASH_DMY}'),
           :locationCode,
           :userId,
           SYSDATE,
           :userId,
           SYSDATE,
           :supervisorCode
         )`;

    console.log(params);
    let resultrows = await db.query(sql, params);
    return true;
  } catch (err) {
    return false;
  }
};




module.exports = {
  setRfidTagInfos
};