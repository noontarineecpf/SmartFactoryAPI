const db = require("../../../db");
const getRfidRegister = async () => {
    try {
        const sql = `SELECT NVL(MAX(REGISTER_NO),0)+1 AS REGISTER_NO 
                    FROM FD_RFID_MAP_REGISTER`;
        
        let resultRows = await db.query(sql);
        return resultRows;
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    getRfidRegister
};