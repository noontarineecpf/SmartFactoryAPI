const moment = require("moment");
const constants = require("../../../../utils/constants");
const panelConfig = require("../panelConfig");
const processDate = require("../processDate");
const productionOrders = require("../productionOrder");
const rfidTagInfos = require("../rfidTagInfo");


const getProductionOrders = async ctx => {
    try {
        const config = await panelConfig.getPanelConfig(ctx.params.panelId);
        const locationCode = config.LOCATIONCODE;
        const productionDate = await processDate.getProcessDate(ctx.params.plantCode, locationCode);
        const resultRows = await productionOrders.getProductionOrders(ctx.params.plantCode, productionDate);

        ctx.body = JSON.stringify(resultRows);
    } catch (error) {
        ctx.response.status = 400;
        console.log(error);

    }
};

const insertRfidTagInfo = async ctx => {
    console.log(ctx.request.body);
    const req = ctx.request.body;
    try {
        const config = await panelConfig.getPanelConfig(req.panelId);
        const locationCode = config.LOCATIONCODE;
        const rfidType = config.RFIDTYPE;
        const productionorderWithNo = await productionOrders.getProductionOrderWithNo(req.plantCode, req.productionNo, req.productionDate, req.extend);

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

        const result = await rfidTagInfos.insertRfidTagInfo(params);
        ctx.body = result;
        ctx.response.status = 200;


    } catch (error) {
        throw error;
    }

};

const getRfidTagInfos = async ctx => {
    try {
        const resultRows = await rfidTagInfos.getRfidTagInfos(ctx.params.plantCode, ctx.params.rfidNo);
        ctx.body = JSON.stringify(resultRows);
    } catch (error) {
        console.log(error);

    }
};

const updateRfidTagInfo = async ctx => {
    const req = ctx.request.body;
    try {

        const params = {
            PLANT_CODE: req.PLANT_CODE,
            RFID_NO: req.RFID_NO,
            STOCK_QTY: req.STOCK_QTY,
            STOCK_WGH: req.STOCK_WGH,
            LAST_USER_ID: req.LAST_USER_ID
        };

        const result = await rfidTagInfos.updateRfidTagInfo(params);
        ctx.body = result;
        ctx.response.status = 200;

    } catch (error) {
        throw error;

    }

};


module.exports = {
    getProductionOrders,
    insertRfidTagInfo,
    getRfidTagInfos,
    updateRfidTagInfo
};