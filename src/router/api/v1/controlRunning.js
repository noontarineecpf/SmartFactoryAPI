const db = require("../../../db");
const constants = require("../../../utils/string_helper");
const string_helper = require("../../../utils/string_helper");
const moment = require("moment");
// const fetch = require("node-fetch");
// const request = require("request-promise");

const getControlRunning = async (moduleCode, orgCode, controlDocumentType, controlType, documentType, currentDate, userId, otherControl = "") => {
	try {
		const sql = `SELECT SEQ_CONTROL_PREFIX_DOCUMENT, SEQ_CONTROL_PREFIX_DATE, SEQ_CONTROL_PREFIX_MONTH,
    SEQ_CONTROL_PREFIX_YEAR, PREFIX_DOCUMENT, CONTROL_PREFIX_DATE, CONTROL_PREFIX_MONTH, CONTROL_PREFIX_YEAR,
    SEQ_CONTROL_RUN_NUMBER, CONTROL_RUN_NUMBER, RUN_NUMBER
    FROM MAS_CONTROL_RUNNING
    WHERE ORG_CODE =:ORG_CODE
    AND MODULE_CODE =:MODULE_CODE
    AND CONTROL_DOCTYPE =:CONTROL_DOCTYPE
    AND CONTROL_TYPE =:CONTROL_TYPE
    AND DOCUMENT_TYPE =:DOCUMENT_TYPE
    AND OTHER_CONTROL =:OTHER_CONTROL
    AND START_EFFECTIVE_DATE <=TO_DATE(:START_EFFECTIVE_DATE,'${constants.DASH_YMD}')
    AND END_EFFECTIVE_DATE >= TO_DATE(:END_EFFECTIVE_DATE,'${constants.DASH_YMD}')`;

		const date = moment(currentDate).format(constants.DASH_YMD);
		// const month = moment(currentDate).format("MM");
		// const day = moment(currentDate).format("DD");
		// console.log(month, day);
		// console.log("date", date);
		const params = {
			ORG_CODE: orgCode,
			MODULE_CODE: moduleCode,
			CONTROL_DOCTYPE: controlDocumentType,
			CONTROL_TYPE: controlType,
			DOCUMENT_TYPE: documentType,
			OTHER_CONTROL: otherControl,
			START_EFFECTIVE_DATE: date,
			END_EFFECTIVE_DATE: date
		};
		let running = "";
		let resultRows = await db.query(sql, params);
		// console.log(resultRows);
		if (resultRows.length > 0) {
			const row = resultRows[0];
			const seqOfPrefix = ["", "", "", "", ""];
			if (row.PREFIX_DOCUMENT != null) {
				seqOfPrefix[row.SEQ_CONTROL_PREFIX_DOCUMENT] = row.PREFIX_DOCUMENT;
			}
			if (row.CONTROL_PREFIX_DATE != null) {
				const day = moment(currentDate).format("DD");
				seqOfPrefix[row.SEQ_CONTROL_PREFIX_DATE] = day;
			}
			if (row.CONTROL_PREFIX_MONTH != null) {
				const month = moment(currentDate).format("MM");
				// console.log("month", month);
				switch (parseInt(month)) {
					case 10:
						seqOfPrefix[row.SEQ_CONTROL_PREFIX_MONTH] = "A";
						break;
					case 11:
						seqOfPrefix[row.SEQ_CONTROL_PREFIX_MONTH] = "B";
						break;

					case 12:
						seqOfPrefix[row.SEQ_CONTROL_PREFIX_MONTH] = "C";
						break;
					default:
						seqOfPrefix[row.SEQ_CONTROL_PREFIX_MONTH] = month;
						break;
				}
			}
			if (row.CONTROL_PREFIX_YEAR != null) {
				const yy = moment(currentDate).format(row.CONTROL_PREFIX_YEAR.toString());
				seqOfPrefix[row.SEQ_CONTROL_PREFIX_YEAR] = yy;
			}
			if (row.CONTROL_RUN_NUMBER != null) {
				row.RUN_NUMBER += 1;
				seqOfPrefix[row.SEQ_CONTROL_RUN_NUMBER] = row.RUN_NUMBER.toString().padStart(row.CONTROL_RUN_NUMBER, "0");
				// console.log("running", row.RUN_NUMBER.toString().padStart(row.CONTROL_RUN_NUMBER, "0"));
			}
			// console.log(seqOfPrefix);
			// running = seqOfPrefix.join("");
			running = string_helper.stringConcat(seqOfPrefix);
			
			// console.log("running", running);
		} else {
			throw new Error(`Not found data at control running! ${JSON.stringify(params)}`);
		}
		await updateControlRunning(moduleCode, orgCode, controlDocumentType, controlType, documentType, currentDate, userId, otherControl);
		return running;
	} catch (error) {
		throw error;
	}
};

const updateControlRunning = async (moduleCode, orgCode, controlDocumentType, controlType, documentType, currentDate, userId, otherControl = "") => {
	try {
		const sql = `UPDATE MAS_CONTROL_RUNNING
    SET RUN_NUMBER=RUN_NUMBER+1,
    LAST_USER_ID=:LAST_USER_ID,
    LAST_UPDATE_DATE=SYSDATE
    WHERE ORG_CODE =:ORG_CODE
    AND MODULE_CODE =:MODULE_CODE
    AND CONTROL_DOCTYPE =:CONTROL_DOCTYPE
    AND CONTROL_TYPE =:CONTROL_TYPE
    AND DOCUMENT_TYPE =:DOCUMENT_TYPE
    AND OTHER_CONTROL =:OTHER_CONTROL
    AND START_EFFECTIVE_DATE <=TO_DATE(:START_EFFECTIVE_DATE,'${constants.DASH_YMD}')
    AND END_EFFECTIVE_DATE >= TO_DATE(:END_EFFECTIVE_DATE,'${constants.DASH_YMD}')`;
		const date = moment(currentDate).format(constants.DASH_YMD);
		const params = {
			ORG_CODE: orgCode,
			MODULE_CODE: moduleCode,
			CONTROL_DOCTYPE: controlDocumentType,
			CONTROL_TYPE: controlType,
			DOCUMENT_TYPE: documentType,
			OTHER_CONTROL: otherControl,
			START_EFFECTIVE_DATE: date,
			END_EFFECTIVE_DATE: date,
			LAST_USER_ID: userId
		};
		let resultRows = await db.query(sql, params);

		return resultRows;
	} catch (error) {
		throw error;
	}
};
module.exports = {
	getControlRunning
};
