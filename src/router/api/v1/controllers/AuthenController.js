const rfidEmployee = require("../RfidEmployee");

const authentication = async ctx => {
	try {
		const {rfidNo, password} = ctx.request.body;
		const result = await rfidEmployee.getRfidEmployee(rfidNo, password);
		ctx.body = JSON.stringify(result);
	} catch (error) {
		throw error;
		// ctx.response.status = 400;
		// console.log(error);
	}
};

module.exports = {
	authentication
};
