const moment = require("moment");
const constants = require("../../../../utils/constants");
const panelConfig = require("../panelConfig");
const processDate = require("../processDate");
const productionOrders = require("../productionOrder");
const rfidTagInfos = require("../rfidTagInfo");
const stocks = require("../stock");

const getProductionOrders = async ctx => {
    try {
        const [config] = await panelConfig.getPanelConfig(ctx.params.panelId);
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
    const req = ctx.request.body;
    try {
        const [config] = await panelConfig.getPanelConfig(req.panelId);
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


const insertFmStock = async ctx => {
    const req = ctx.request.body;
    try {
        const [config] = await panelConfig.getPanelConfig(req.panelId);
        const stockDocType = config.STOCKDOCTYPE;
        const rfidTagInfo = await rfidTagInfos.getRfidTagInfos(req.plantCode,req.rfidNo);

        const params = {
            PLANT_CODE: req.plantCode,
            SHIFT_CODE: rfidTagInfo.SHIFT_CODE,
            LOT_NO: rfidTagInfo.LOT_NO,
            REMARK: req.rfidNo,
            STK_DOC_DATE: moment(req.productionDate).format(constants.SLASH_DMY),
            STK_DOC_TYPE: stockDocType,
            //STK_DOC_NO:,
            //STK_DOC_ITEM:,
            ORG_CODE: req.plantCode,
            USER_CREATE: req.userId,
            //PROCESS_CODE: ,
            //PRODUCT_GROUP: ,
            PRODUCT_CODE: rfidTagInfo.PRODUCT_CODE,
            //EXTRA_CODE:,
            STOCK_QTY: rfidTagInfo.STOCK_QTY,
            STOCK_WGH: rfidTagInfo.STOCK_WGH,
            TO_LOCATION: rfidTagInfo.LOCATION_CODE,
            MACHINE_NO: rfidTagInfo.PRODUCTION_LINE,
            REF_MACHINE_CODE: rfidTagInfo.PRODUCTION_LINE,
            BRAND_CODE: rfidTagInfo.BRAND_CODE,
            JOB_ID: rfidTagInfo.JOB_ID,
            PRODUCTION_NO: req.productionNo
          };

        const result = await stocks.insertFmStock(params);
        ctx.body = result;
        ctx.response.status = 200;


    } catch (error) {
        throw error;
    }

};

const updateFlagRfidTagInfo = async ctx => {
    const req = ctx.request.body;
    try {
        const [config] = await panelConfig.getPanelConfig(req.panelId);
        const locationCode = config.LOCATIONCODE;
       
        const params = {
            PLANT_CODE: req.PLANT_CODE,
            RFID_NO: req.RFID_NO,
            STK_DOC_NO: req.STK_DOC_NO,
            STK_DOC_DATE: moment(req.STK_DOC_DATE).format(constants.SLASH_DMY),
            STK_DOC_ITEM: req.STK_DOC_ITEM,
            LOCATION_CODE: locationCode,
            //EXTRA_CODE: ,
            LAST_USER_ID: req.LAST_USER_ID
        }; 
        
        const result = await rfidTagInfos.updateFlagRfidTagInfo(params);
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
    updateRfidTagInfo,
    insertFmStock,
    updateFlagRfidTagInfo
};