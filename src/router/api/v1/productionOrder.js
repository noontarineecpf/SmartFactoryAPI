const moment = require("moment");
const constants = require("../../../utils/constants");
const db = require("../../../db");
const getProductionOrders = async (orgCode, productionDate) => {

  try {
    const sql = `SELECT PO.PRODUCTION_DATE,PO.PRODUCTION_LINE,WC.DESC_LOC AS PRODUCTION_LINE_NAME,
                  WC.PERSON_RESPONSIBLE,EI.DESC_LOC PERSON_NAME,PO.PRODUCTION_SHIFT,PO.PRODUCTION_NO, 
                  PO.EXTEND,PO.PRIORITY,PO.PRODUCT_CODE,PO.BRAND_CODE,PG.DESC_LOC AS PRODUCT_NAME,PO.LOT_NO,PO.SUB_LOT_NO,
                  (SELECT COUNT(1) FROM FM_RFIDTAG_INFO WHERE PRODUCTION_NO = PO.PRODUCTION_NO) AS TOTAL_QTY 
                  FROM FOOD.FD_PPD_PRODUCTION_ORDER PO ,FOOD.FD_PPD_WORK_CENTER WC , FOOD.FM_EMPLOYEE_INFO EI , STD.MAS_PRODUCT_GENERAL PG 
                  WHERE PO.PLANT_CODE = :PLANT_CODE AND 
                  PO.PRODUCTION_TYPE = '01' AND 
                  PO.PRODUCTION_DATE = TO_DATE(:PRODUCTION_DATE,'${constants.SLASH_DMY}') AND 
                  PO.PLANT_CODE = WC.ORG_CODE AND 
                  PO.PRODUCTION_LINE = WC.WORK_CENTER AND 
                  WC.ORG_CODE = EI.PLANT_CODE AND 
                  WC.PERSON_RESPONSIBLE = EI.EMPLOYEE_ID AND 
                  PO.PRODUCT_CODE = PG.PRODUCT_CODE
                  ORDER BY PO.PRODUCTION_DATE , PO.PRIORITY,PO.PRODUCTION_NO`;

    const params = {
      PLANT_CODE: orgCode,
      PRODUCTION_DATE: moment(productionDate).format(constants.SLASH_DMY),
    };
    let resultRows = await db.query(sql, params);
    return resultRows;
  } catch (error) {
    console.log(error);
  }
};

const setInsertRfid = async ctx => {
  console.log(ctx.request.body);

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
         NULL,
         :brandCode,
         :prdCode,
         NULL,
         :shiftCode,
         TO_DATE(:productionDate,'dd/MM/yyyy'),
         TO_DATE(:productionDate,'dd/MM/yyyy'),
         NULL,
         :userId,
         SYSDATE,
         :userId,
         SYSDATE,
         :supervisorCode
       )`;
    console.log(sql);
    const req = ctx.request.body;
    const params = {
      plantCode: req.plantCode,
      rfidNo: req.rfidNo,
      rfidType: req.rfidType,
      prdNo: req.prdNo,
      prdLine: req.prdLine,
      brandCode: req.brandCode,
      prdCode: req.prdCode,
      shiftCode: req.shiftCode,
      productionDate: req.productionDate,
      userId: req.userId,
      supervisorCode: req.supervisorCode
    };
    console.log(params);
    let resultrows = await db.query(sql, params);
    ctx.body = true;
  } catch (err) {
    ctx.response.status = 400;
    ctx.body = err.message;
  }
};

const getRfidTagInfos = async ctx => {
  console.log("getRfidTagInfos");
  try {
    const sql = `SELECT RI.RFID_NO,RI.PRODUCTION_DATE,RI.PRODUCTION_NO,RI.PRODUCTION_LINE,WC.DESC_LOC,WC.DESC_ENG,
        RI.SUPERVISOR_CODE,EI.DESC_LOC,EI.DESC_ENG,RI.PRODUCT_CODE,RI.BRAND_CODE,PG.DESC_LOC,PG.DESC_ENG,RI.LOT_NO, 
        RI.SHIFT_CODE,NVL(RI.RECEIVE_QTY,0) AS RECEIVE_QTY,NVL(RI.RECEIVE_WGH,0) AS RECEIVE_WGH,
        NVL(RI.STOCK_QTY,0) AS STOCK_QTY,NVL(STOCK_WGH,0) AS STOCK_WGH
        FROM FM_RFIDTAG_INFO RI , FD_PPD_WORK_CENTER WC , FM_EMPLOYEE_INFO EI , MAS_PRODUCT_GENERAL PG 
        WHERE RI.PLANT_CODE = :plantCode AND 
        RI.RFID_NO = :rfidNo AND 
        RI.PLANT_CODE = WC.ORG_CODE AND 
        RI.PRODUCTION_LINE = WC.WORK_CENTER AND 
        RI.PLANT_CODE = EI.PLANT_CODE AND 
        RI.SUPERVISOR_CODE = EI.EMPLOYEE_ID AND 
        RI.PRODUCT_CODE = PG.PRODUCT_CODE`;

    const req = ctx.params;
    const params = {
      plantCode: req.plantCode,
      rfidNo: req.rfidNo
    };
    let resultRows = await db.query(sql, params);

    console.log(resultRows.length);
    //ctx.body = JSON.stringify(resultRows);

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

const setUpdateWghInRfid = async ctx => {
  // console.log(ctx.request.body);

  try {
    let sql = `UPDATE FM_RFIDTAG_INFO
         SET  RECEIVE_QTY = :stkQty,
         RECEIVE_WGH = :stkWgh,
         STOCK_QTY = :stkQty,
         STOCK_WGH = :stkWgh,
         LAST_USER_ID = :userId,
         LAST_UPDATE_DATE = SYSDATE
         WHERE PLANT_CODE = :plantCode AND 
         RFID_NO = :rfidNo`;

    const req = ctx.request.body;
    const params = {
      plantCode: req.plantCode,
      rfidNo: req.rfidNo,
      stkQty: req.stkQty,
      stkWgh: req.stkWgh,
      userId: req.userId
    };
    console.log(params);
    let resultrows = await db.query(sql, params);
    ctx.body = true;
  } catch (err) {
    ctx.response.status = 400;
    ctx.body = err.message;
  }
};

const setInsertStock = async ctx => {
  // console.log(ctx.request.body);

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
            :plantCode,
            :shiftCode,
            :lotNo,
            :remark,
            TO_DATE(:stockDate,'YYYYMMDD'),
            :stkDocType,
            :stkDocNo,
            :stkDocItem,
            :plantCode,
            :userId,
            SYSDATE,
            :processCode,
            :classifiedType,
            :productGroup,
            :productCode,
            '000',
            '00',
            :extraCode,
            'Y',
            :stkQty,
            :stkWgh,
            :locationCode,
            '00000',
            :productionLine,
            :productionLine,
            'MP',
            :brandCode,
            :jobId,
            :productionNo
          )`;

    const req = ctx.request.body;
    const params = {
      plantCode: req.plantCode,
      shiftCode: req.shiftCode,
      lotNo: req.lotNo,
      remark: req.remark,
      stockDate: req.stockDate,
      stkDocType: req.stkDocType,
      stkDocNo: req.stkDocNo,
      stkDocItem: req.stkDocItem,
      userId: req.userId,
      processCode: req.processCode,
      classifiedType: req.classifiedType,
      productGroup: req.productGroup,
      productCode: req.productCode,
      extraCode: req.extraCode,
      stkQty: req.stkQty,
      stkWgh: req.stkWgh,
      locationCode: req.locationCode,
      productionLine: req.productionLine,
      brandCode: req.brandCode,
      jobId: req.jobId,
      productionNo: req.productionNo
    };
    console.log(params);
    let resultrows = await db.query(sql, params);
    ctx.body = true;
  } catch (err) {
    ctx.response.status = 400;
    ctx.body = err.message;
  }
};

module.exports = {
  getProductionOrders,
  setInsertRfid,
  getRfidTagInfos,
  setUpdateWghInRfid,
  setInsertStock
};