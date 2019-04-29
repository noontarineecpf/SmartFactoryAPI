const db = require("../../../db");
const getLocations = async ctx => {
	try {
		const sql = `SELECT LOCATION_CODE,PROCESS_CODE,DESC_ENG,DESC_LOC  
                        FROM FOOD.FM_LOCATION_SETUP 
                        WHERE PLANT_CODE  = '407010'`;
		let resultRows = await db.query(sql);
		ctx.body = JSON.stringify(resultRows);
	} catch (error) {
		console.log(error);
	}
};
module.exports = {
	getLocations
};