// const db = require("../../../db");
const Router = require("koa-router");
const location = require("./locationSetUp");
const productionOrder = require("./productionOrder");
const loginByRfid = require("./loginByRfid");
const loginByPassword = require("./loginByPassword");
const UserOrgModule = require("./UserOrgModule");
const receiveController = require("./controllers/receiveController");
const configController = require("./controllers/configController");
const router = new Router();

router.get("/locations", location.getLocations);
router.get("/prdorders/:plantCode/:panelId", receiveController.getProductionOrders);
router.get("/panelConfigs/:panelId", configController.getPanelConfigs);
router.get("/rfidTagInfos/:plantCode/:rfidNo", receiveController.getRfidTagInfos);
router.get("/loginByRfid/:rfidNo", loginByRfid.getLoginByRFID);
router.get("/loginByPassword/:password", loginByPassword.getLoginByPassword);

router.post("/UserOrgModule/Orgs", UserOrgModule.getOrg);
router.post("/InsertrfidTagInfo", receiveController.insertRfidTagInfo);
router.post("/UpdaterfidTagInfo", receiveController.updateRfidTagInfo);
router.post("/InsertFmStock", receiveController.insertFmStock);

module.exports = router.routes();