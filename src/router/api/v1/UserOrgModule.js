const db = require("../../../db");
const getOrg = async ctx => {
	const req = ctx.request.body;
	try {
		const sql = `select distinct a.org_code,b.org_name_loc,b.org_name_eng 
                        from mas_user_org_module a,mas_org b
                        where a.org_code = b.org_code
                        and a.user_id =:user_id
                        and b.cancel_flag <>'Y'
                        and a.module_code=:module_code`;

		const params = {
			module_code: req.module_code,
			user_id: req.user_id
		};
		let resultRows = await db.query(sql, params);
		ctx.body = JSON.stringify(resultRows);
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	getOrg
};
