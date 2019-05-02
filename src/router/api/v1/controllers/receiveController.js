const moment = require("moment");
const constants = require("../../../../utils/constants");
const panelConfig = require("../panelConfig");
const processDate = require("../processDate");
const productionOrders = require("../productionOrder");


const getProductionOrders = async ctx => {
    try {
        console.log(ctx.params.panelId);
        const [config] = await panelConfig.getPanelConfig(ctx.params.panelId);
        console.log(config.LOCATIONCODE);
        console.log(config.LOCATIONCODE);
        const locationCode = config.LOCATIONCODE;
        console.log(locationCode);
        const productionDate = await processDate.getProcessDate(ctx.params.plantCode, locationCode);
        const resultRows = await productionOrders.getProductionOrders(ctx.params.plantCode, productionDate);
        ctx.body = JSON.stringify(resultRows);
    } catch (error) {
        console.log(error);

    }
};

/*const setRfidTagInfo = async ctx => {
    console.log(ctx.request.body);
    try {
        const config = await panelConfig.getPanelConfig(ctx.params.panelId);
        const locationCode = config.LocationCode;
        const rfidType = config.rfidType;
        const productionorderWithNo = await productionOrders.getProductionOrderWithNo(ctx.params.plantCode, ctx.params.productionNo, ctx.params.productionDate, ctx.params.extend);
        const {
            plantCode,
            rfidNo
        } = ctx.request.body

        const params = {
            plantCode: req.plantCode,
            rfidNo: productionorderWithNo.rfidNo,
            rfidType: rfidType,
            prdNo: ctx.params.productionNo,
            prdLine: productionorderWithNo.,
            jobId: brandCode: req.brandCode,
            prdCode: req.prdCode,
            lotNo: ,
            shiftCode: req.shiftCode,
            productionDate: req.productionDate,
            locationCode: locationCode,
            userId: req.userId,
            supervisorCode: req.supervisorCode
        };

        ctx.body = await rfidInfo.setRfidTagInfo(params);
    } catch (error) {
        console.log(error);
    }

};

*/



module.exports = {
    getProductionOrders //,
    //setRfidTagInfo
};