const moment = require("moment");
const constants = require("../../../../utils/constants");
const panelConfig = require("../PanelConfig");
const processDate = require("../ProcessDate");
const productionOrder = require("../ProductionOrder");
const rfidTagInfo = require("../RfidTagInfo");
const stock = require("../Stock");
const locationSetup = require("../LocationSetUp");
const classifiedType = require("../ClassifiedType");
const extra = require("../ExtraCode");
const controlRunning = require("../ControlRunning");

const getProductionOrders = async ctx => {
	try {
		const [config] = await panelConfig.getPanelConfig(ctx.params.panelId);
		const locationCode = config.LOCATIONCODE;
		const productionDate = await processDate.getProcessDate(ctx.params.plantCode, locationCode);
		const resultRows = await productionOrder.getProductionOrders(ctx.params.plantCode, productionDate);

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
		const productionOrderData = await productionOrder.getProductionOrderWithNo(req.plantCode, req.productionNo, req.productionDate, req.extend);

		const params = {
			plantCode: req.plantCode,
			rfidNo: req.rfidNo,
			rfidType: rfidType,
			prdNo: req.productionNo,
			prdLine: productionOrderData.PRODUCTION_LINE,
			jobId: productionOrderData.JOB_ID,
			brandCode: productionOrderData.BRAND_CODE,
			prdCode: productionOrderData.PRODUCT_CODE,
			lotNo: productionOrderData.LOT_NO,
			shiftCode: productionOrderData.PRODUCTION_SHIFT,
			productionDate: moment(req.productionDate).format(constants.SLASH_DMY),
			locationCode: locationCode,
			userId: req.userId,
			supervisorCode: req.supervisorCode
		};

		const result = await rfidTagInfo.insertRfidTagInfo(params);
		ctx.body = result;
		ctx.response.status = 200;
	} catch (error) {
		throw error;
	}
};

const getRfidTagInfos = async ctx => {
	try {
		const resultRows = await rfidTagInfo.getRfidTagInfos(ctx.params.plantCode, ctx.params.rfidNo);
		console.log(resultRows);
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

		const result = await rfidTagInfo.updateRfidTagInfo(params);
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
		const [rfidTagInfo] = await rfidTagInfo.getRfidTagInfos(req.plantCode, req.rfidNo);
		const [location] = await locationSetup.getLocations(req.plantCode);
		const classifiedTypeSetUp = await classifiedType.getClassifiedType(rfidTagInfo.PRODUCT_CODE);
		const extraCode = await extra.getExtraCode(req.plantCode, rfidTagInfo.LOT_NO, rfidTagInfo.PRODUCTION_DATE, "", req.userId);
		const dataStock = await stock.getStock(req.plantCode, config.STOCKDOCTYPE, req.productionNo, req.productionDate);

		let docNo;
		let stkDocItem;
		if (dataStock.length == 0) {
			docNo = await controlRunning.getControlRunning(config.MODULECODE, req.plantCode, config.STOCKDOCTYPE, config.STOCKDOCTYPE, config.STOCKDOCTYPE, req.productionDate, req.userId, config.PREFIX);
			stkDocItem = 1;
		} else {
			const row = dataStock[0];
			//console.log(row.STK_DOC_NO);

			docNo = row.STK_DOC_NO;
			stkDocItem = row.STK_DOC_ITEM + 1;
		}

		const params = {
			PLANT_CODE: req.plantCode,
			SHIFT_CODE: rfidTagInfo.SHIFT_CODE,
			LOT_NO: rfidTagInfo.LOT_NO,
			REMARK: req.rfidNo,
			STK_DOC_DATE: moment(req.productionDate).format(constants.SLASH_DMY),
			STK_DOC_TYPE: config.STOCKDOCTYPE,
			STK_DOC_NO: docNo,
			//STK_DOC_ITEM:,
			ORG_CODE: req.plantCode,
			USER_CREATE: req.userId,
			PROCESS_CODE: location.PROCESS_CODE,
			CLASSIFIED_TYPE: classifiedTypeSetUp.CLASSIFIED_TYPE,
			PRODUCT_GROUP: classifiedTypeSetUp.PRODUCT_GROUP,
			PRODUCT_CODE: rfidTagInfo.PRODUCT_CODE,
			EXTRA_CODE: extraCode,
			STOCK_QTY: rfidTagInfo.STOCK_QTY,
			STOCK_WGH: rfidTagInfo.STOCK_WGH,
			TO_LOCATION: config.LOCATIONCODE,
			MACHINE_NO: rfidTagInfo.PRODUCTION_LINE,
			REF_MACHINE_CODE: rfidTagInfo.PRODUCTION_LINE,
			BRAND_CODE: rfidTagInfo.BRAND_CODE,
			JOB_ID: rfidTagInfo.JOB_ID,
			PRODUCTION_NO: req.productionNo
		};

		const result = await stock.insertFmStock(params);
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

		const result = await rfidTagInfo.updateFlagRfidTagInfo(params);
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