const moment = require("moment");
const constants = require("../../../../utils/constants");
const panelConfig = require("../panelConfig");
const processDate = require("../processDate");
const productionOrders = require("../productionOrder");
const rfidTagInfos = require("../rfidTagInfo");


const getProductionOrders = async ctx => {
    try {
        const [config] = await panelConfig.getPanelConfig(ctx.params.panelId);
        const locationCode = config.LOCATIONCODE;
        const productionDate = await processDate.getProcessDate(ctx.params.plantCode, locationCode);
        const resultRows = await productionOrders.getProductionOrders(ctx.params.plantCode, productionDate);
        ctx.body = JSON.stringify(resultRows);
    } catch (error) {
        console.log(error);

    }
};

const setRfidTagInfo = async ctx => {
    console.log(ctx.request.body);
    const req = ctx.request.body;
    try {
        const [config] = await panelConfig.getPanelConfig(req.panelId);
        const locationCode = config.LOCATIONCODE;
        const rfidType = config.RFIDTYPE;
        const [productionorderWithNo] = await productionOrders.getProductionOrderWithNo(req.plantCode, req.productionNo, req.productionDate, req.extend);
        
       const params = {
            plantCode: req.plantCode,
            rfidNo: req.rfidNo,
            rfidType: rfidType,
            prdNo: req.productionNo,
            prdLine: productionorderWithNo.PRODUCTION_LINE,
            jobId: productionorderWithNo.JOB_ID,
            brandCode: productionorderWithNo.BRAND_CODE,
            prdCode: productionorderWithNo.PRODUCT_CODE,
            lotNo: productionorderWithNo.LOT_NO,
            shiftCode: productionorderWithNo.PRODUCTION_SHIFT,
            productionDate: moment(req.productionDate).format(constants.SLASH_DMY),
            locationCode: locationCode,
            userId: req.userId,
            supervisorCode: req.supervisorCode
        };

        ctx.body = await rfidTagInfos.setRfidTagInfos(params);
      
    } catch (error) {
        console.log(error);
    }

};





module.exports = {
    getProductionOrders ,
    setRfidTagInfo
};