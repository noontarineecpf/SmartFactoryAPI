const db = require("../../../db");
const getDocumentTypeConfig = async (plantCode, docType) => {
    try {
        const sql = `SELECT TRANSACTION_TYPE ,
  NVL(USE_MACHINE_FLAG,'N') AS USE_MACHINE_FLAG
FROM FD_DOCUMENT_TYPE_CONFIG
WHERE PLANT_CODE  = :PLANT_CODE
AND DOCUMENT_TYPE =: DOCUMENT_TYPE `;

        const params = {
            PLANT_CODE: plantCode,
            DOCUMENT_TYPE: docType
        };

        let resultRows = await db.query(sql, params);
        if (resultRows.length == 0) {
            throw new Error("ไม่พบ DocumentType นี้");
        } else {
            return resultRows;
        }
    } catch (error) {
        throw error;
    }
};


module.exports = {
    getDocumentTypeConfig
};
