const moment = require("moment");
const constants = require("../../../utils/constants");
const db = require("../../../db");

const getStock = async (plantCode, stkDocType,productionNo,productionDate) => {

  try {
    const sql = `SELECT STK_DOC_NO , STK_DOC_ITEM 
    FROM FM_STOCK
    WHERE PLANT_CODE = :PLANT_CODE AND STK_DOC_TYPE = :STK_DOC_TYPE
    AND PRODUCTION_NO = :PRODUCTION_NO
    AND STK_DOC_DATE = TO_DATE(:PRODUCTION_DATE,'${constants.SLASH_DMY}')
    ORDER BY STK_DOC_DATE , STK_DOC_NO , STK_DOC_ITEM DESC `;

    const params = {
      PLANT_CODE: plantCode,
      STK_DOC_TYPE: stkDocType,
      PRODUCTION_NO: productionNo,
      PRODUCTION_DATE: moment(productionDate).format(constants.SLASH_DMY)
    };
    let resultRows = await db.query(sql, params);

    return resultRows;
  } catch (error) {
    throw error;
  }
};



const insertFmStock = async (params) => {

    try {
        let sql = `INSERT
        INTO FM_STOCK
          (
            PLANT_CODE,
            SHIFT_CODE,
            LOT_NO,
            REMARK,
            STK_DOC_DATE,
            STK_DOC_TYPE,
            STK_DOC_NO,
            STK_DOC_ITEM,
            ORG_CODE,
            USER_CREATE,
            CREATE_DATE,
            PROCESS_CODE,
            CLASSIFIED_TYPE,
            PRODUCT_GROUP,
            PRODUCT_CODE,
            MEDICINE_CODE,
            GRADE_CODE,
            EXTRA_CODE,
            TRANSACTION_FLAG,
            STOCK_QTY,
            STOCK_WGH,
            TO_LOCATION,
            TO_LOCK_NO,
            MACHINE_NO,
            REF_MACHINE_CODE,
            MACHINE_TYPE,
            BRAND_CODE,
            JOB_ID,
            PRODUCTION_NO
          )
          VALUES
          (
            :PLANT_CODE,
            :SHIFT_CODE,
            :LOT_NO,
            :REMARK,
            TO_DATE(:STK_DOC_DATE,'${constants.SLASH_DMY}'),
            :STK_DOC_TYPE,
            :STK_DOC_NO,
            :STK_DOC_ITEM,
            :ORG_CODE,
            :USER_CREATE,
            SYSDATE,
            :PROCESS_CODE,
            :CLASSIFIED_TYPE,
            :PRODUCT_GROUP,
            :PRODUCT_CODE,
            '000',
            '00',
            :EXTRA_CODE,
            'Y',
            :STOCK_QTY,
            :STOCK_WGH,
            :TO_LOCATION,
            '00000',
            :MACHINE_NO,
            :REF_MACHINE_CODE,
            :'MP',
            :BRAND_CODE,
            :JOB_ID,
            :PRODUCTION_NO
          )`;
  
      const result = await db.execute(sql, params);
      console.log(result);
  
      return true;
    } catch (error) {
      throw error;
    }
  };

  module.exports = {
    insertFmStock,
    getStock
  };