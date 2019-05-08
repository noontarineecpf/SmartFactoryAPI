const db = require("../../../db");
const productStock = require("./ProductStock");
const string_helper = require("../../../utils/string_helper");
const moment = require("moment");
const getLotNo = async (plantCode, productCode, documentDate, queueNo) => {
	try {
		const lotGroup = await productStock.getLotGroup(plantCode, productCode);
		const sql = `SELECT
                    PLANT_CODE,
                    LOT_GROUP,
                    EXTEND,
                    EXT_SIZE,
                    IN_EXT_SIZE,
                    CONSTANT_VALUE,
                    DATA_TYPE,
                    NVL(INPUT_FORMAT,'') INPUT_FORMAT, 
                    NVL(OUTPUT_FORMAT,'') OUTPUT_FORMAT,
                    LOT_TYPE,
                    DESCRIPTION,
                    OTHER_VALUE,
                    STRING_CONDITION,
                    MSG_VALUE,
                    SPECIFIC_FORMAT,
                    NVL(EXTEND_NAME, 'NA') EXTEND_NAME,
                    SELECT_COMMAND,
                    SELECT_COLUMN,
                    SELECT_FILTER
                    FROM FD_LOT_GROUP_INFO
                    WHERE PLANT_CODE = :PLANT_CODE
                    AND LOT_GROUP = :LOT_GROUP
                    ORDER BY EXTEND ASC`;
		const params = {
			PLANT_CODE: plantCode,
			LOT_GROUP: lotGroup
		};
		let resultRows = await db.query(sql, params);
		let lotNo = "";
		if (resultRows.length == 0) throw new Error(`Not found lot group! \n${JSON.stringify(params)}`);

		const estNo = await getEstNo(plantCode);
		resultRows.forEach(el => {
			if (el.EXTEND == null) {
				throw new Error("EXTEND is null");
			}
			if (el.EXT_SIZE == null) {
				throw new Error("EXT_SIZE is null");
			}
			if (el.IN_EXT_SIZE == null) {
				throw new Error("IN_EXT_SIZE is null");
			}

			switch (el.LOT_TYPE) {
				case "CMD":
					lotNo += estNo;
					break;
				case "INPUT1":
					lotNo += queueNo;
					break;
				case "CONS":
					lotNo += el.CONSTANT_VALUE.toString();
					break;
				case "PARAMETER":
					let currentDate;
					if (el.STRING_CONDITION == null) {
						currentDate = moment(documentDate);
					}
					switch (el.DATA_TYPE) {
						case "DATE":
							if (el.SPECIFIC_FORMAT == "JULIAN") {
								const julian = currentDate
									.dayOfYear()
									.toString()
									.padStart(3, "0");
								lotNo += julian;
								console.log("JULIAN", julian);
							} else {
								const outputDate = currentDate.format("YY");

								switch (el.OUTPUT_FORMAT.toUpperCase()) {
									case "Y":
										lotNo += outputDate.substring(0, 1);
										break;
									default:
										lotNo += outputDate;
										break;
								}
							}
							break;
					}
					break;
				default:
					break;
			}
		});
		return lotNo;
	} catch (error) {
		throw error;
	}
};

const getEstNo = async plantCode => {
	try {
		const sql = `select est_no from fm_mas_org_config where org_code=:org_code`;
		const params = {
			org_code: plantCode
		};
		let resultRows = await db.query(sql, params);
		return resultRows[0].EST_NO;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	getLotNo
};
