const db = require("../../../db");
const getPanelConfig = async (panelId) => {
    try {
        const sql = `select 
        MAX(DECODE(panel_key,'ProgramCode',panel_Value)) AS ProgramCode,
        MAX(DECODE(panel_key,'LocationCode',panel_Value)) AS LocationCode
        from Fd_Panel_Config  where panel_id=:panelId`;

        const params = {
            panelId: panelId
        };

        let resultRows = await db.query(sql, params);
        console.log(resultRows);
        return resultRows;
    } catch (error) {
        console.log(error);
    }
};



module.exports = {
    getPanelConfig
};