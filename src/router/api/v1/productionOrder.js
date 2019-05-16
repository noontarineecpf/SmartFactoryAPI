const moment = require("moment");
const constants = require("../../../utils/constants");
const db = require("../../../db");
const getProductionOrders = async (orgCode, productionDate,productionType) => {
	try {
		const sql = `SELECT PO.PRODUCTION_DATE,PO.PRODUCTION_LINE,WC.DESC_LOC AS PRODUCTION_LINE_NAME,
                  WC.PERSON_RESPONSIBLE,EI.DESC_LOC PERSON_NAME,PO.PRODUCTION_SHIFT,PO.PRODUCTION_NO, 
                  PO.EXTEND,PO.PRIORITY,PO.PRODUCT_CODE,PO.BRAND_CODE,PG.DESC_LOC AS PRODUCT_NAME,PO.LOT_NO,PO.SUB_LOT_NO,PO.JOB_ID,
                  (SELECT COUNT(1) FROM FM_RFIDTAG_INFO WHERE PRODUCTION_NO = PO.PRODUCTION_NO) AS TOTAL_QTY 
                  FROM FOOD.FD_PPD_PRODUCTION_ORDER PO ,FOOD.FD_PPD_WORK_CENTER WC , FOOD.FM_EMPLOYEE_INFO EI , STD.MAS_PRODUCT_GENERAL PG 
                  WHERE PO.PLANT_CODE = :PLANT_CODE AND 
                  PO.PRODUCTION_TYPE =:PRODUCTION_TYPE AND
                  PO.PRODUCTION_DATE = TO_DATE(:PRODUCTION_DATE,'${constants.SLASH_DMY}') AND 
                  PO.PLANT_CODE = WC.ORG_CODE AND 
                  PO.PRODUCTION_LINE = WC.WORK_CENTER AND 
                  WC.ORG_CODE = EI.PLANT_CODE AND 
                  WC.PERSON_RESPONSIBLE = EI.EMPLOYEE_ID AND 
                  PO.PRODUCT_CODE = PG.PRODUCT_CODE AND 
                  NVL(PO.CLOSE_FLAG,'N') <> 'Y' 
                  ORDER BY PO.PRODUCTION_DATE , PO.PRIORITY,PO.PRODUCTION_NO`;

		const params = {
			PLANT_CODE: orgCode,
			PRODUCTION_DATE: moment(productionDate).format(constants.SLASH_DMY),
			PRODUCTION_TYPE: productionType
		};
		console.log(params)
		let resultRows = await db.query(sql, params);
		return resultRows;
	} catch (error) {
		console.log(error);
	}
};

const getProductionOrderWithNo = async (plantCode, productionNo, productionDate, extend) => {
	try {
		const sql = `SELECT PO.PRODUCTION_LINE,PO.JOB_ID,PO.BRAND_CODE,PO.PRODUCT_CODE,
                CONCAT(CONCAT(PO.LOT_NO,'-'),PO.SUB_LOT_NO) AS LOT_NO,PO.PRODUCTION_SHIFT
                FROM FD_PPD_PRODUCTION_ORDER PO 
                WHERE PO.PLANT_CODE = :PLANT_CODE AND 
                PO.PRODUCTION_TYPE = '01' AND 
                PO.PRODUCTION_NO = :PRODUCTION_NO AND
                PO.PRODUCTION_DATE = TO_DATE(:PRODUCTION_DATE,'${constants.SLASH_DMY}') AND 
                PO.EXTEND = :EXTEND AND 
                NVL(PO.CLOSE_FLAG,'N') <> 'Y' 
                ORDER BY PO.PRODUCTION_DATE , PO.PRODUCTION_NO`;

		const params = {
			PLANT_CODE: plantCode,
			PRODUCTION_NO: productionNo,
			PRODUCTION_DATE: moment(productionDate).format(constants.SLASH_DMY),
			EXTEND: extend
		};
		let resultRows = await db.query(sql, params);
		console.log(resultRows);
		return resultRows[0];
	} catch (error) {
		throw error;
	}
};

module.exports = {
	getProductionOrders,
	getProductionOrderWithNo
};
