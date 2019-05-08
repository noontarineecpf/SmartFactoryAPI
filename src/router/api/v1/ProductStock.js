const db = require("../../../db");
const getLotGroup = async (orgCode, productCode) => {
	try {
		const sql = `SELECT LOT_GROUP
    FROM MAS_PRODUCT_STOCK 
    WHERE ORG_CODE = :ORG_CODE
    AND PRODUCT_CODE = :PRODUCT_CODE`;
		const params = {
			ORG_CODE: orgCode,
			PRODUCT_CODE: productCode
		};
		let resultRows = await db.query(sql, params);

		if (resultRows.length == 0) throw new Error(`Not found lot group! \n${JSON.stringify(params)}`);
		return resultRows[0].LOT_GROUP;
	} catch (error) {
		throw error;
	}
};
module.exports = {
	getLotGroup
};
