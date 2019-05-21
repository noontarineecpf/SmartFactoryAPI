const db = require("../../../db");
const getBomHeadItems = async (orgCode, bomUsage, componentMaterial) => {
    try {
        const sql = `SELECT BH.ORG_CODE,
        BH.BOM_USAGE, BH.BOM_CODE, BC.BRAND_CODE, PG.DESC_LOC, PG.DESC_ENG, BH.OUTPUT_QUANTITY,
        BH.OUTPUT_UNIT_QUANTITY, UC.DESC_LOC AS UNIT_QTY_LOC_NAME, UC.DESC_ENG AS UNIT_QTY_ENG_NAME,
        BH.OUTPUT_WEIGHT, BH.OUTPUT_UNIT_WEIGHT, UC2.DESC_LOC AS UNIT_WGH_LOC_NAME, UC2.DESC_ENG AS UNIT_WGH_ENG_NAME
        FROM FD_PPD_BOM_ITEM BI, FD_PPD_BOM_HEAD BH, FM_BRAND_INFO BC,
        MAS_PRODUCT_GENERAL PG, MAS_UNIT_CODE UC, MAS_UNIT_CODE UC2
        WHERE BH.ORG_CODE = :ORG_CODE
        AND BH.BOM_USAGE = :BOM_USAGE
        AND BI.COMPONENT_MATERIAL = :COMPONENT_MATERIAL
        AND BI.MAIN_PRODUCT_FLAG = 'Y'
        AND BI.CANCEL_FLAG = 'N'
        AND BH.BOM_CODE = BI.BOM_CODE
        AND BH.ALTERNATIVE_BOM = BI.ALTERNATIVE_BOM
        AND BH.ORG_CODE = BC.PLANT_CODE
        AND BH.BOM_CODE = BC.PRODUCT_CODE
        AND BH.BOM_CODE = PG.PRODUCT_CODE
        AND BH.OUTPUT_UNIT_QUANTITY = UC.UNIT_CODE
        AND BH.OUTPUT_UNIT_WEIGHT = UC2.UNIT_CODE
        ORDER BY BH.BOM_CODE `;

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