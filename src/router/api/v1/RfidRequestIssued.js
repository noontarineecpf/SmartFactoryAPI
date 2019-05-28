const constants = require("../../../utils/constants");
const db = require("../../../db");

const getCheckBalanceRfid = async (plantCode, documentDate,brandCode,locationCode,rfidType) => {
  try {
    const sql = `SELECT MAS.RFID_TYPE AS SLRFID_TYPE,
              MAS.DESC_ENG AS SLRFID_TYPE_NAME_ENG,
              MAS.DESC_LOC AS SLRFID_TYPE_NAME_LOC,
              SUM(RF.RECEIVE_QTY) AS RFBAL_QTY,
              SUM(RF.RECEIVE_WGH) AS RFBAL_WGH,
              NVL(A.REQUEST_QTY, 0) AS RFREQUEST_QTY,
              SUM(RF.RECEIVE_QTY) - NVL(A.REQUEST_QTY, 0) AS NET_QTY
              FROM FM_RFIDTAG_INFO RF,
              GD2_FM_MAS_RFIDTAG MAS,
              (SELECT DT.RFID_TYPE,
              (SUM(NVL(DT.REQUEST_QUANTITY, 0)) - SUM(NVL(DT.ACTUAL_QUANTITY, 0))) AS REQUEST_QTY
              FROM FD_RFID_REQUEST_ISSUED DT
              WHERE DT.PLANT_CODE = :PLANT_CODE
              AND DT.DOCUMENT_DATE >= TO_DATE(:DOCUMENT_DATE, '${constants.SLASH_DMY}')
              AND DT.BRAND_CODE = :BRAND_CODE
              AND DT.LOCATION_CODE = :LOCATION_CODE
              AND DT.RFID_TYPE = :RFID_TYPE
              AND NVL(DT.CLOSE_FLAG, 'N') <> 'Y'
              AND (NVL(DT.REQUEST_QUANTITY, 0) - NVL(DT.ACTUAL_QUANTITY, 0)) > 0
              GROUP BY DT.RFID_TYPE
              ) A
              WHERE RF.RFID_TYPE = MAS.RFID_TYPE
              AND RF.BRAND_CODE = :BRAND_CODE
              AND RF.PLANT_CODE = :PLANT_CODE
              AND NVL(RF.RFID_FLAG, 'N') = 'Y'
              AND RF.LOCATION_CODE = :LOCATION_CODE
              AND RF.RFID_TYPE = A.RFID_TYPE(+)
              GROUP BY MAS.RFID_TYPE,
              A.REQUEST_QTY,
              MAS.DESC_ENG, MAS.DESC_LOC
              ORDER BY MAS.RFID_TYPE`;

    const params = {
      PLANT_CODE: plantCode,
      DOCUMENT_DATE: moment(documentDate).format(constants.SLASH_DMY),
      BRAND_CODE: brandCode,
      LOCATION_CODE: locationCode,
      RFID_TYPE: rfidType
    };
    let resultRows = await db.query(sql, params);
    return resultRows;
  } catch (error) {
    throw error;
  }
};

const getMaxExtend = async (plantCode, documentDate, productionLine, productionNo, requestType) => {
  try {
    const sql = `SELECT MAX(NVL(DT.REQUEST_EXTEND, 0)) AS STK_DOC_ITEM
                 FROM FD_RFID_REQUEST_ISSUED DT 
                 WHERE DT.PLANT_CODE = :PLANT_CODE
                 AND DT.DOCUMENT_DATE = TO_DATE(: DOCUMENT_DATE, '${constants.SLASH_DMY}')
                 AND DT.REQUEST_UL = :REQUEST_UL 
                 AND DT.REQUEST_NO = :REQUEST_NO
                 AND DT.REQUEST_TYPE = :REQUEST_TYPE`;

    const params = {
      PLANT_CODE: plantCode,
      DOCUMENT_DATE: moment(documentDate).format(constants.SLASH_DMY),
      REQUEST_UL: productionLine,
      REQUEST_NO: productionNo,
      REQUEST_TYPE: requestType
    };
    let resultRows = await db.query(sql, params);
    return resultRows;
  } catch (error) {
    throw error;
  }
};


const insertRfidRequestIssued = async params => {
  try {
    let sql = `INSERT
       INTO FD_RFID_REQUEST_ISSUED
         (
           PLANT_CODE,
           REQUEST_TYPE,
           REQUEST_NO,
           DOCUMENT_DATE,
           REQUEST_EXTEND,
           REQUEST_UL,
           BRAND_CODE,
           PRODUCT_CODE,
           LOCATION_CODE,
           LOCK_NO,
           ISSUED_STATION,
           JOB_ID,
           RFID_TYPE,
           REQUEST_QUANTITY,
           REQUEST_WEIGHT,
           CONFIRM_QUANTITY,
           CONFIRM_WEIGHT,
           ACTUAL_QUANTITY,
           ACTUAL_WEIGHT,
           UNIT_CODE_QUANTITY,
           UNIT_CODE_WEIGHT,
           PRODUCTION_NO,
           USER_CREATE,
           CREATE_DATE,
           LAST_USER_ID,
           LAST_UPDATE_DATE,
           CONFIRM_DATE,
           SHIFT_CODE,
           GRADE_CODE,
           QUEUE_IN_NO,
           LOT_NO
         )
         VALUES
         (
           :PLANT_CODE,
           :REQUEST_TYPE,
           :REQUEST_NO,
           TO_DATE(: DOCUMENT_DATE, '${constants.SLASH_DMY}'), ,
           :REQUEST_EXTEND,
           :REQUEST_UL,
           :BRAND_CODE,
           :PRODUCT_CODE,
           :LOCATION_CODE,
           :LOCK_NO,
           :ISSUED_STATION,
           :JOB_ID,
           :RFID_TYPE,
           :REQUEST_QUANTITY,
           :REQUEST_WEIGHT,
           :CONFIRM_QUANTITY,
           :CONFIRM_WEIGHT,
           :ACTUAL_QUANTITY,
           :ACTUAL_WEIGHT,
           :UNIT_CODE_QUANTITY,
           :UNIT_CODE_WEIGHT,
           :PRODUCTION_NO,
           :USER_CREATE,
           SYSDATE,
           :LAST_USER_ID,
           SYSDATE,
           SYSDATE,
           :SHIFT_CODE,
           :LOT_NO
         )`;

    const result = await db.execute(sql, params);
    console.log(result);

    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getCheckBalanceRfid,
  getMaxExtend,
  insertRfidRequestIssued
};
