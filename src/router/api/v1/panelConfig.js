const db = require("../../../db");
const getPanelConfig = async (panelId) => {
    try {
        const sql = `select 
        MAX(DECODE(panel_key,'ProgramCode',panel_Value)) AS ProgramCode,
        MAX(DECODE(panel_key,'LocationCode',panel_Value)) AS LocationCode,
        MAX(DECODE(panel_key,'RfidType',panel_Value)) AS RfidType,
        MAX(DECODE(panel_key,'StockDocType',panel_Value)) AS StockDocType,
        MAX(DECODE(panel_key,'ModuleCode',panel_Value)) AS ModuleCode,
        MAX(DECODE(panel_key,'Prefix',panel_Value)) AS Prefix
        from Fd_Panel_Config  where panel_id=:panelId`;

        const params = {
            panelId: panelId
        };

        let resultRows = await db.query(sql, params);
        //console.log(resultRows);
        return resultRows;
    } catch (error) {
        console.log(error);
    }
};



module.exports = {
    getPanelConfig
};