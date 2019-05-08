const db = require("../../../db");
const getLocations = async (plantCode) => {
	try {
		const sql = `SELECT LOCATION_CODE,PROCESS_CODE,DESC_ENG,DESC_LOC  
                        FROM FOOD.FM_LOCATION_SETUP 
                        WHERE PLANT_CODE=:plantCode`;
		const params = {
			plantCode: plantCode
		};

		let resultRows = await db.query(sql, params);
		return resultRows;
	} catch (error) {
		console.log(error);
	}

};
module.exports = {
	getLocations
};