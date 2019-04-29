const db = require("../../../db");
const getLoginByPassword = async ctx => {
    console.log("getLoginByPassword");
    try {
        const sql = `SELECT EL.RFID_NO , EL.EMPLOYEE_ID , EI.DESC_LOC EMP_NAME_LOC , EI.DESC_ENG EMP_NAME_ENG 
                    FROM FD_RFID_EMPLOYEE_LOGIN EL , FM_EMPLOYEE_INFO EI 
                    WHERE EL.PASSWORD = :password AND 
                    EL.EMPLOYEE_ID = EI.EMPLOYEE_ID`;

        const req = ctx.params;
        const params = {
            password: req.password
        };

        let resultRows = await db.query(sql, params);
        console.log(resultRows.length);
        if (resultRows.length == 0) {
            ctx.response.status = 404;
            ctx.body = "ไม่พบข้อมูลของ Password นี้";
        } else {
            ctx.body = JSON.stringify(resultRows);
        }

    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    getLoginByPassword
};