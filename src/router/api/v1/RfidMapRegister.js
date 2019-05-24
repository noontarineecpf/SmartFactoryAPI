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

const insertRfidMapRegister = async () => {
    try {
         const sql = `INSERT
       INTO FD_RFID_MAP_REGISTER
         (
           REGISTER_NO,
           RFID_NO,
           USER_CREATE,
           CREATE_DATE,
           LAST_USER_ID,
           LAST_UPDATE_DATE
         )
         VALUES
         (
           :REGISTER_NO,
           :RFID_NO,
           :USER_CREATE,
           SYSDATE,
           :LAST_USER_ID,
           SYSDATE
         )`;

        return sql;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getRfidRegister,
    insertRfidMapRegister
};