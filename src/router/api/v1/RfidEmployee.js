const db = require("../../../db");
const getRfidEmployee = async (rfidNo, password) => {
	// console.log("getLoginByRFID");
	try {
		const sql = `SELECT EL.PASSWORD , EL.EMPLOYEE_ID , EI.DESC_LOC EMP_NAME_LOC , EI.DESC_ENG EMP_NAME_ENG ,EL.RFID_NO 
    FROM FD_RFID_EMPLOYEE_LOGIN EL , FM_EMPLOYEE_INFO EI 
    WHERE EL.EMPLOYEE_ID = EI.EMPLOYEE_ID
    AND (EL.RFID_NO = :RFID_NO
    OR EL.PASSWORD =:PASSWORD)`;

		// const req = ctx.params;
		const params = {
			RFID_NO: rfidNo,
			PASSWORD: password
		};

		let resultRows = await db.query(sql, params);
		// console.log(resultRows.length);
		if (resultRows.length == 0) {
			throw new Error("ไม่พบข้อมูล RFID NO นี้");
			// ctx.response.status = 404;
			// ctx.body = "ไม่พบข้อมูล RFID NO นี้";
		} else {
			return resultRows;
			// ctx.body = JSON.stringify(resultRows);
		}
	} catch (error) {
		throw error;
	}
};

// const getLoginByPassword = async ctx => {
// 	console.log("getLoginByPassword");
// 	try {
// 		const sql = `SELECT EL.RFID_NO , EL.EMPLOYEE_ID , EI.DESC_LOC EMP_NAME_LOC , EI.DESC_ENG EMP_NAME_ENG
//                   FROM FD_RFID_EMPLOYEE_LOGIN EL , FM_EMPLOYEE_INFO EI
//                   WHERE EL.PASSWORD = :PASSWORD AND
//                   EL.EMPLOYEE_ID = EI.EMPLOYEE_ID`;

// 		const req = ctx.params;
// 		const params = {
// 			PASSWORD: req.password
// 		};

// 		let resultRows = await db.query(sql, params);
// 		console.log(resultRows.length);
// 		if (resultRows.length == 0) {
// 			ctx.response.status = 404;
// 			ctx.body = "ไม่พบข้อมูลของ Password นี้";
// 		} else {
// 			ctx.body = JSON.stringify(resultRows);
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
module.exports = {
	getRfidEmployee
	// getLoginByRFID,
	// getLoginByPassword
};
