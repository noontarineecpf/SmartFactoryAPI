const db = require("../../../db");
const processDate = require("./ProcessDate");
const getProcessDate = async (orgCode, location) => {
	try {
		const sql = `SELECT PROCESS_DATE
        FROM FM_PROCESS_CONTROL
        WHERE PLANT_CODE = :orgCode
        AND PROCESS_CODE =
          (SELECT NVL(PROCESS_CODE, 'NA') AS PROCESS_CODE
          FROM FM_LOCATION_SETUP
          WHERE PLANT_CODE  = :orgCode
          AND LOCATION_CODE = :location
          )`;

		//const sql = `   select sessiontimezone from dual `;

		const params = {
			orgCode: orgCode,
			location: location
		};
		console.log(params);
		let resultRows = await db.query(sql, params);
		// console.log(resultRows);
		return resultRows[0].PROCESS_DATE;
	} catch (error) {
		console.log(error);
	}
};
module.exports = {
	getProcessDate
};
