// const db = require("../../../db");
const Router = require("koa-router");
const location = require("./location");
const productionOrder = require("./productionOrder");
const loginByRfid = require("./loginByRfid");
const loginByPassword = require("./loginByPassword");
const receiveController = require("./controllers/receiveController");
const router = new Router();

router.get("/locations", location.getLocations);
router.get("/prdorders/:plantCode/:panelId", receiveController.getProductionOrders);
router.get("/panelConfigs/:panelId", receiveController.getPanelConfigs);

router.post("/instrfids", productionOrder.setInsertRfid);

router.get("/rfidtaginfos/:plantCode/:rfidNo", productionOrder.getRfidTagInfos);
router.post("/updateweights", productionOrder.setUpdateWghInRfid);

router.get("/loginByRfid/:rfidNo", loginByRfid.getLoginByRFID);

router.get("/loginByPassword/:password", loginByPassword.getLoginByPassword);

module.exports = router.routes();