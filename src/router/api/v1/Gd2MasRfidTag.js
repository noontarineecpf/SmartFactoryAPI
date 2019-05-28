const db = require("../../../db");
const getMaxRequest = async rfidType => {
    try {
        const sql = `SELECT MAS.RFID_TYPE,
  NVL(MAS.MAX_REQUEST_QTY, 0)   AS MAX_REQUEST_QTY,
  MAS.DESC_LOC AS RFID_TYPE_LOC , MAS.DESC_ENG AS RFID_TYPE_ENG
FROM GD2_FM_MAS_RFIDTAG MAS
WHERE MAS.RFID_TYPE = :RIFD_TYPE`;
        const params = {
            RIFD_TYPE: rfidType
        };

        let resultRows = await db.query(sql, params);
        return resultRows;
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    getMaxRequest
};
