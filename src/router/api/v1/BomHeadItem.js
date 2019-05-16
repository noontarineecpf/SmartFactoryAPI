const db = require("../../../db");
const getBomHeadItems = async (orgCode, bomUsage, componentMaterial) => {
    try {
        const sql = `SELECT BH.ORG_CODE,BH.BOM_USAGE,BH.BOM_CODE,BH.OUTPUT_QUANTITY,
                    BH.OUTPUT_UNIT_QUANTITY,BH.OUTPUT_WEIGHT,BH.OUTPUT_UNIT_WEIGHT
                    FROM FD_PPD_BOM_ITEM BI , FD_PPD_BOM_HEAD BH 
                    WHERE BH.ORG_CODE = :ORG_CODE 
                    AND BH.BOM_USAGE =:BOM_USAGE 
                    AND BI.COMPONENT_MATERIAL =:COMPONENT_MATERIAL 
                    AND BI.MAIN_PRODUCT_FLAG = 'Y' 
                    AND BI.CANCEL_FLAG = 'N'       
                    AND BH.BOM_CODE = BI.BOM_CODE 
                    AND BH.ALTERNATIVE_BOM = BI.ALTERNATIVE_BOM
                    ORDER BY BOM_CODE`;
        console.log(sql);
//000000000023030899
        const params = {
            ORG_CODE: orgCode,
            BOM_USAGE: bomUsage,
            COMPONENT_MATERIAL: componentMaterial
        };
        console.log(sql);
        console.log(params);
        let resultRows = await db.query(sql, params);
        return resultRows;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getBomHeadItems
};