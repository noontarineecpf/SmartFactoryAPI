const db = require("../../../db");

const getLocationByWorkCenter = async (plantCode, workCenter) => {
    try {
        const sql = `SELECT MAS.WORK_CENTER AS SLPRODUCTION_LINE,
                    MAS.DESC_LOC AS SLPRODUCTION_LINE_NAME ,
                    LS.LOCATION_CODE ,
                    LS.DESC_LOC
                    FROM FD_PPD_WORK_CENTER MAS ,
                    FM_LOCATION_SETUP LS
                    WHERE MAS.LOCATION_CODE      = LS.LOCATION_CODE
                    AND MAS.ORG_CODE             = LS.PLANT_CODE
                    AND MAS.ORG_CODE             = :PLANT_CODE
                    AND LS.PLANT_CODE            = :PLANT_CODE
                    AND MAS.WORK_CENTER          = :WORK_CENTER
                    AND MAS.WORK_CENTER_CATEGORY = 'W'
                    ORDER BY MAS.WORK_CENTER`;

        const params = {
            PLANT_CODE: plantCode,
            WORK_CENTER: workCenter
        };
        let resultRows = await db.query(sql, params);
        return resultRows;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getLocationByWorkCenter
};
