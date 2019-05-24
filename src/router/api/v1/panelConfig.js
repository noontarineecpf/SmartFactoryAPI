const db = require("../../../db");
const getPanelConfig = async panelId => {
	try {
		const sql = `select 
        PROGRAM_CODE AS ProgramCode,
        MAX(DECODE(panel_key,'LocationCode',panel_Value)) AS LocationCode,
		MAX(DECODE(panel_key,'RfidType',panel_Value)) AS RfidType,
		MAX(DECODE(panel_key, 'ProductionType', panel_Value)) AS ProductionType,
        MAX(DECODE(panel_key,'StockDocType',panel_Value)) AS StockDocType,
        MAX(DECODE(panel_key,'ModuleCode',panel_Value)) AS ModuleCode,
		MAX(DECODE(panel_key,'Prefix',panel_Value)) AS Prefix,
		MAX(DECODE(panel_key, 'BomUsage', panel_Value)) AS BomUsage,
		MAX(DECODE(panel_key, 'DocRequestType', panel_Value)) AS DocRequestType
		from Fd_Panel_Config  where panel_id= :panelId
		GROUP BY PROGRAM_CODE`;

		const params = {
			panelId: panelId
		};

		let resultRows = await db.query(sql, params);
		
		return resultRows;
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	getPanelConfig
};
