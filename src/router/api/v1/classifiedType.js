const db = require("../../../db");
// const fetch = require("node-fetch");
// const request = require("request-promise");

const getClassifiedType = async ProductCode => {
	try {
		const sql = `SELECT CLASSIFIED_TYPE,PRODUCT_GROUP FROM FM_CLASSIFIED_TYPE_SETUP WHERE PRODUCT_CODE =:PRODUCT_CODE`;
		const params = {
			PRODUCT_CODE: ProductCode
		};
		let resultRows = await db.query(sql, params);
		return resultRows[0];
	} catch (error) {
		console.log(error);
	}
};
module.exports = {
	getClassifiedType
};
