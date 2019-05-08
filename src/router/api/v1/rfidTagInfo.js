const constants = require("../../../utils/constants");
const db = require("../../../db");

const getRfidTagInfos = async (plantCode, rfidNo) => {
	try {
		const sql = `SELECT RI.RFID_NO,RI.PRODUCTION_DATE,RI.PRODUCTION_NO,RI.PRODUCTION_LINE,WC.DESC_LOC,WC.DESC_ENG,
        RI.SUPERVISOR_CODE,EI.DESC_LOC AS EMP_NAME_LOC,EI.DESC_ENG AS EMP_NAME_ENG,
        RI.PRODUCT_CODE,RI.BRAND_CODE,PG.DESC_LOC AS PRODUCT_NAME_LOC,
        PG.DESC_ENG AS PRODUCT_NAME_ENG,RI.LOT_NO, 
        RI.SHIFT_CODE,NVL(RI.RECEIVE_QTY,0) AS RECEIVE_QTY,NVL(RI.RECEIVE_WGH,0) AS RECEIVE_WGH,
        NVL(RI.STOCK_QTY,0) AS STOCK_QTY,NVL(STOCK_WGH,0) AS STOCK_WGH, RI.LOCATION_CODE ,RI.JOB_ID
        FROM FM_RFIDTAG_INFO RI , FD_PPD_WORK_CENTER WC , FM_EMPLOYEE_INFO EI , MAS_PRODUCT_GENERAL PG 
        WHERE RI.PLANT_CODE = :PLANT_CODE AND 
        RI.RFID_NO = :RFID_NO AND 
        RI.PLANT_CODE = WC.ORG_CODE AND 
        RI.PRODUCTION_LINE = WC.WORK_CENTER AND 
        RI.PLANT_CODE = EI.PLANT_CODE AND 
        RI.SUPERVISOR_CODE = EI.EMPLOYEE_ID AND 
        RI.PRODUCT_CODE = PG.PRODUCT_CODE`;

		const params = {
			PLANT_CODE: plantCode,
			RFID_NO: rfidNo
		};
		let resultRows = await db.query(sql, params);

		if (resultRows.length == 0) {
			throw new Error("ไม่พบ rfid no นี้");
		}

		return resultRows;
	} catch (error) {
		throw error;
	}
};

const insertRfidTagInfo = async params => {
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

		const result = await db.execute(sql, params);
		console.log(result);

		return true;
	} catch (error) {
		throw error;
	}
};

const updateRfidTagInfo = async params => {
	try {
		let sql = `UPDATE FM_RFIDTAG_INFO
    SET  RECEIVE_QTY = :STOCK_QTY,
    RECEIVE_WGH = :STOCK_WGH,
    STOCK_QTY = :STOCK_QTY,
    STOCK_WGH = :STOCK_WGH,
    LAST_USER_ID = :LAST_USER_ID,
    LAST_UPDATE_DATE = SYSDATE
    WHERE PLANT_CODE = :PLANT_CODE AND 
    RFID_NO = :RFID_NO`;

		console.log(params);
		const result = await db.execute(sql, params);

		if (result.rowsAffected && result.rowsAffected === 1) {
			return true;
		} else {
			throw new Error("not found!");
		}
	} catch (error) {
		throw error;
	}
};

const updateRfidFlag = async () => {
  try {
  let sql = `UPDATE FM_RFIDTAG_INFO 
  SET RFID_FLAG = 'Y',
  LAST_USER_ID = :LAST_USER_ID,
  LAST_UPDATE_DATE = SYSDATE
  WHERE PLANT_CODE = :PLANT_CODE 
  AND RFID_NO = :RFID_NO`;
  
  return sql;
  // console.log(params);
  // const result = await db.execute(sql, params);
  
  // if (result.rowsAffected && result.rowsAffected === 1) {
  // return true;
  // } else {
  // throw new Error("not found!");
  // }
  } catch (error) {
  throw error;
  }
  };

module.exports = {
	insertRfidTagInfo,
	getRfidTagInfos,
	updateRfidTagInfo,
	updateRfidFlag
};
