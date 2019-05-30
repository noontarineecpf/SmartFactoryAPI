const db = require("../../../../db");
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
const rfidMapRegister = require("../RfidMapRegister");
const bomHeadItem = require("../BomHeadItem");
const docTypeConfig = require("../DocumentTypeConfig");
const masRfidTag = require("../Gd2MasRfidTag");
const rfidRequestIssued = require("../RfidRequestIssued");
const workCenter = require("../WorkCenter");


const getProductionOrders = async ctx => {
	try {
		const [config] = await panelConfig.getPanelConfig(ctx.params.panelId);
		const locationCode = config.LOCATIONCODE;
		const productionType = config.PRODUCTIONTYPE;
		const productionDate = await processDate.getProcessDate(ctx.params.plantCode, locationCode);
		const resultRows = await productionOrder.getProductionOrders(ctx.params.plantCode, productionDate, productionType);

		ctx.body = JSON.stringify(resultRows);
		ctx.response.status = 200;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

const insertRfidTagInfo = async ctx => {
	const req = ctx.request.body;
	try {
		const [config] = await panelConfig.getPanelConfig(req.panelId);
		const locationCode = config.LOCATIONCODE;
		const rfidType = config.RFIDTYPE;
		const productionDate = await processDate.getProcessDate(req.plantCode, locationCode);
		const productionOrderData = await productionOrder.getProductionOrderWithNo(req.plantCode, req.productionNo, productionDate, req.extend);

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
			productionDate: moment(productionDate).format(constants.SLASH_DMY),
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
		if (resultRows.length == 0) {
			throw new Error("ไม่พบ rfid no นี้");

		} else {
			const row = resultRows[0];
			if (row.RFID_FLAG == 'Y') {
				throw new Error("RFID NO นี้มีการบันทึกเข้าระบบเรียบร้อยแล้ว กรุณาสแกน RFID NO อีกครั้ง");

			}
		}
		ctx.body = JSON.stringify(resultRows);
		ctx.response.status = 200;
	} catch (error) {
		console.log(error);
		throw error;
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
	const conn = await db.getConnection();
	const {
		plantCode,
		panelId,
		rfidNo,
		productionNo,
		userId
	} = ctx.request.body;
	try {
		const [config] = await panelConfig.getPanelConfig(panelId);
		const [rfid] = await rfidTagInfo.getRfidTagInfos(plantCode, rfidNo);
		const [location] = await locationSetup.getLocations(plantCode);
		const classifiedTypeSetUp = await classifiedType.getClassifiedType(rfid.PRODUCT_CODE);
		const extraCode = await extra.getExtraCode(plantCode, rfid.LOT_NO, rfid.PRODUCTION_DATE, "", userId);
		const productionDate = await processDate.getProcessDate(plantCode, rfid.LOCATION_CODE);
		const stockData = await stock.getStock(plantCode, config.STOCKDOCTYPE, productionNo, productionDate);

		let docNo;
		let stkDocItem;
		if (stockData.length == 0) {
			docNo = await controlRunning.getControlRunning(config.MODULECODE, plantCode, config.STOCKDOCTYPE, config.STOCKDOCTYPE, config.STOCKDOCTYPE, productionDate, userId, config.PREFIX);
			stkDocItem = 1;
		} else {
			const row = stockData[0];
			docNo = row.STK_DOC_NO;
			stkDocItem = row.STK_DOC_ITEM + 1;
		}

		const params = {
			PLANT_CODE: plantCode,
			SHIFT_CODE: rfid.SHIFT_CODE,
			LOT_NO: rfid.LOT_NO,
			REMARK: rfidNo,
			STK_DOC_DATE: moment(rfid.PRODUCTION_DATE).format(constants.SLASH_DMY),
			STK_DOC_TYPE: config.STOCKDOCTYPE,
			STK_DOC_NO: docNo,
			STK_DOC_ITEM: stkDocItem,
			ORG_CODE: plantCode,
			USER_CREATE: userId,
			PROCESS_CODE: location.PROCESS_CODE,
			CLASSIFIED_TYPE: classifiedTypeSetUp.CLASSIFIED_TYPE,
			PRODUCT_GROUP: classifiedTypeSetUp.PRODUCT_GROUP,
			PRODUCT_CODE: rfid.PRODUCT_CODE,
			MEDICINE_CODE: "000",
			GRADE_CODE: "00",
			EXTRA_CODE: extraCode,
			TRANSACTION_FLAG: "Y",
			STOCK_QTY: rfid.STOCK_QTY,
			STOCK_WGH: rfid.STOCK_WGH,
			TO_LOCATION: config.LOCATIONCODE,
			TO_LOCK_NO: "00000",
			MACHINE_NO: rfid.PRODUCTION_LINE,
			REF_MACHINE_CODE: rfid.PRODUCTION_LINE,
			MACHINE_TYPE: "MP",
			BRAND_CODE: rfid.BRAND_CODE,
			JOB_ID: rfid.JOB_ID,
			PRODUCTION_NO: productionNo
		};
		//INSERT FM_STOCK
		const stockSql = await stock.insertFmStock();
		await conn.execute(stockSql, params);
		//UPDATE RFID FLAG
		const rfidSql = await rfidTagInfo.updateRfidFlag();

		const rfidParams = {
			PLANT_CODE: plantCode,
			RFID_NO: rfidNo,
			LAST_USER_ID: userId
		};

		const result = await conn.execute(rfidSql, rfidParams);
		if (result.rowsAffected && result.rowsAffected === 1) {
			await conn.commit();
			ctx.body = true;
			ctx.response.status = 200;
		} else {
			throw new Error("not found!");
		}
	} catch (error) {
		await conn.rollback();
		throw error;
	} finally {
		await conn.close();
	}
};

const getRfidRegister = async ctx => {
	try {
		const resultRows = await rfidMapRegister.getRfidRegister();

		ctx.body = JSON.stringify(resultRows);
		ctx.response.status = 200;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

const insertRfidMapRegister = async ctx => {
	const conn = await db.getConnection();
	const {
		userId,
		rfidNo
	} = ctx.request.body;
	console.log(ctx.request.body);
	try {
		const [rfidRegister] = await rfidMapRegister.getRfidRegister();
		console.log(rfidNo[0]);

		for (var i in rfidNo) {
			const params = {
				REGISTER_NO: rfidRegister.REGISTER_NO,
				RFID_NO: rfidNo[i],
				USER_CREATE: userId,
				LAST_USER_ID: userId
			};
			console.log(params);

			const registerSql = await rfidMapRegister.insertRfidMapRegister();
			console.log(registerSql);
			await conn.execute(registerSql, params);
			console.log("object");
		}

		await conn.commit();
		ctx.body = true;
		ctx.response.status = 200;

	} catch (error) {
		await conn.rollback();
		throw error;
	} finally {
		await conn.close();
	}
};

const getBomHeadItems = async ctx => {
	try {
		const [config] = await panelConfig.getPanelConfig(ctx.params.panelId);
		const bomUsage = config.BOMUSAGE;
		const resultRows = await bomHeadItem.getBomHeadItems(ctx.params.orgCode, bomUsage, ctx.params.componentMaterial);

		ctx.body = JSON.stringify(resultRows);
		ctx.response.status = 200;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
 
const insertRequestIssued = async ctx => {
	const req = ctx.request.body;
	try {
		const [config] = await panelConfig.getPanelConfig(req.panelId);
		const docRequestType = config.DOCREQUESTTYPE;
		//const [documentTypeConfig] = await docTypeConfig.getDocumentTypeConfig(req.plantCode, docRequestType);

		const issuedStation = await workCenter.getLocationByWorkCenter(req.plantCode, config.ISSUEDSTATION);
		if (issuedStation.length == 0) {
			throw new Error("ไม่พบข้อมูลจุดจ่าย (ข้อมูลสายการผลิต)");
		} 

		const row = issuedStation[0];
		const issuedLocationCode = row.LOCATION_CODE;
		const productionDate = await processDate.getProcessDate(req.plantCode, issuedLocationCode);

		const balanceReceive = await rfidTagInfo.getCheckBalanceReceive(req.plantCode, req.rmCode, config.RFIDTYPE);
		if (balanceReceive.length == 0) {
			throw new Error("สินค้านี้ไม่มียอดสินค้าคงเหลือสำหรับเบิก");
		}

		const row1 = balanceReceive[0];
		if (req.requestQty > row1.SLBALANCE_QTY) {
			throw new Error("ปริมาณสินค้าที่เบิกมากกว่าปริมาณสินค้าคงเหลือ");
		}
		const rfidTypeRequest = await masRfidTag.getMaxRequest(config.RFIDTYPE);
		if (rfidTypeRequest.length == 0) {
			throw new Error("ไม่พบข้อมูล Master ตาราง GD2_FM_MAS_RFIDTAG ที่ RFID_TYPE " & config.RFIDTYPE);
		} 

		const row2 = rfidTypeRequest[0];
		if (config.MAXREQUESTFLAG == 'N') {
			if (row2.MAX_REQUEST_QTY == 0) {
				throw new Error("ไม่ได้กำหนดปริมาณการเบิกต่อครั้งของประเภทภาชนะ(MAX_REQUEST_QTY.GD2_FM_MAS_RFIDTAG");
			} else {
				if (req.requestQty > row2.MAX_REQUEST_QTY) {
					throw new Error("ไม่สามารถขอเบิกเกินปริมาณที่กำหนด (สามารถขอเบิกได้สูงสุด = )" & row2.MAX_REQUEST_QTY);
				}
			}
		}

		const requestIssued = await rfidRequestIssued.getCheckBalanceRfid(req.plantCode, productionDate, req.rmBrandCode, issuedLocationCode, config.RFIDTYPE);
		let netQty = 0;
		if (requestIssued.length == 0) {
			throw new Error("ไม่มียอดคงเหลือในสต็อค RFID");
		} else {
			const row3 = requestIssued[0];
			if (row3.RFBAL_QTY !== null && row3.RFREQUEST_QTY !== null) {
				netQty = row3.RFBAL_QTY - row3.RFREQUEST_QTY;
			}

			if (netQty < req.requestQty) {
				throw new Error("ปริมาณคงเหลือน้อยกว่าปริมาณขอเบิก (คงเหลือ = )" & netQty);
			}
		}

		const extend = await rfidRequestIssued.getMaxExtend(req.plantCode, productionDate, req.productionLine, req.productionNo, config.DOCREQUESTTYPE);

		const params = {

			PLANT_CODE: req.plantCode,
			REQUEST_TYPE: config.DOCREQUESTTYPE,
			REQUEST_NO: req.productionNo,
			DOCUMENT_DATE: moment(productionDate).format(constants.SLASH_DMY),
			REQUEST_EXTEND: extend,
			REQUEST_UL: req.productionLine,
			BRAND_CODE: req.rmBrandCode,
			PRODUCT_CODE: req.rmCode,
			LOCATION_CODE: issuedLocationCode,
			LOCK_NO: '00000',
			ISSUED_STATION: config.ISSUEDSTATION,
			JOB_ID: req.jobId,
			RFID_TYPE: config.RFIDTYPE,
			REQUEST_QUANTITY: req.requestQty,
			REQUEST_WEIGHT: 0,
			CONFIRM_QUANTITY: req.requestQty,
			CONFIRM_WEIGHT: 0,
			ACTUAL_QUANTITY: 0,
			ACTUAL_WEIGHT: 0,
			UNIT_CODE_QUANTITY: config.RFIDTYPE,
			UNIT_CODE_WEIGHT: 'KG',
			PRODUCTION_NO: req.productionNo,
			USER_CREATE: req.userId,
			LAST_USER_ID: req.userId,
			SHIFT_CODE: req.shiftCode,
			LOT_NO: req.lotNo
		};

		const result = await rfidRequestIssued.insertRfidRequestIssued(params);
		ctx.body = result;
		ctx.response.status = 200;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

module.exports = {
	getProductionOrders,
	insertRfidTagInfo,
	getRfidTagInfos,
	updateRfidTagInfo,
	insertFmStock,
	getRfidRegister,
	insertRfidMapRegister,
	getBomHeadItems,
	insertRequestIssued
};