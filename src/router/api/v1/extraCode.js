const db = require("../../../db");
// const fetch = require("node-fetch");
// const request = require("request-promise");

const getExtraCode = async (plantCode, lotNo, documentDate, farmCode, userId) => {
	try {
		const sql = `SELECT EXTRA_CODE 
    FROM FM_EXTRA_CODE 
    WHERE PLANT_CODE = :PLANT_CODE 
    AND LOT_NO = :LOT_NO`;
		const params = {
			PLANT_CODE: plantCode,
			LOT_NO: lotNo
		};
		let resultRows = await db.query(sql, params);
		if (resultRows.length == 0) {
			let extraCode = await getMaxExtraCode(plantCode);
			if (extraCode == null) {
				extraCode = 1;
			} else {
				// extraCode += 1;
			}
			await createExtraCode(plantCode, extraCode, lotNo, documentDate, farmCode, userId);
			return extraCode;
		} else {
			return resultRows[0].EXTRA_CODE;
		}
	} catch (error) {
		throw error;
	}
	// const conn = await db.getConnection();
	// try {
	// 	const sql = `SELECT MAX(EXTRA_CODE) AS EXTRA_CODE
	//   FROM FM_EXTRA_CODE
	//   WHERE PLANT_CODE = :PLANT_CODE
	//   AND LOT_NO = :LOT_NO`;
	// 	const params = {
	// 		PLANT_CODE: plantCode,
	// 		LOT_NO: lotNo
	// 	};
	// 	let result = await conn.execute(sql, params);
	// 	const extra = result.rows[0];
	// 	if (extra.EXTRA_CODE == null) {
	// 		console.log(extra);
	// 		extraCode = 1;
	// 		await createExtraCode(plantCode, extraCode, lotNo, documentDate, farmCode, userId);
	// 	}
	// 	await conn.commit();
	// 	return extraCode;
	// } catch (error) {
	// 	console.log(error);
	// } finally {
	// 	conn.close();
	// }
};

const getMaxExtraCode = async plantCode => {
	try {
		const sql = `SELECT MAX(EXTRA_CODE) AS EXTRA_CODE
    FROM FM_EXTRA_CODE 
    WHERE PLANT_CODE = :PLANT_CODE`;
		const params = {
			PLANT_CODE: plantCode
		};
		let resultRows = await db.query(sql, params);
		return resultRows[0].EXTRA_CODE;
	} catch (error) {
		throw error;
	}
};

const createExtraCode = async (plantCode, extraCode, lotNo, documentDate, farmCode, userId) => {
	const conn = await db.getConnection();

	try {
		const sql = `INSERT INTO 
    FM_EXTRA_CODE(PLANT_CODE,EXTRA_CODE,LOT_NO,RECEIVE_DATE,PRODUCTION_DATE,USER_CREATE,CREATE_DATE,ORIGIN,VENDOR_CODE)
    VALUES(:PLANT_CODE,:EXTRA_CODE,:LOT_NO,:RECEIVE_DATE,:PRODUCTION_DATE,:USER_CREATE,SYSDATE,:ORIGIN,:VENDOR_CODE)
    `;
		const date = new Date(documentDate);
		const params = {
			PLANT_CODE: plantCode,
			EXTRA_CODE: extraCode,
			LOT_NO: lotNo,
			RECEIVE_DATE: date,
			PRODUCTION_DATE: date,
			USER_CREATE: userId,
			ORIGIN: farmCode,
			VENDOR_CODE: farmCode
		};
		const resultRows = await conn.insert(sql, params);
		console.log("resultRows-->", resultRows);
		conn.commit();

		// let resultRows = await db.query(sql, params);
		return resultRows;
	} catch (error) {
		throw error;
	} finally {
		conn.close();
	}
};
module.exports = {
	getExtraCode
};
