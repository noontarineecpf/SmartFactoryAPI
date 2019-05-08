// const db = require("../../../db");
const Router = require("koa-router");
const location = require("./Location");
// const productionOrder = require("./ProductionOrder");
// const loginByRfid = require("./loginByRfid");
// const loginByPassword = require("./loginByPassword");
const userOrgModule = require("./UserOrgModule");
const receiveController = require("./controllers/ReceiveController");
const configController = require("./controllers/ConfigController");
const authenController = require("./controllers/AuthenController");
const router = new Router();

router.post("/authentication", authenController.authentication);
router.get("/locations", location.getLocations);
router.get("/prdorders/:plantCode/:panelId", receiveController.getProductionOrders);
router.get("/panelConfigs/:panelId", configController.getPanelConfigs);
router.get("/rfidTagInfos/:plantCode/:rfidNo", receiveController.getRfidTagInfos);


router.post("/UserOrgModule/Orgs", userOrgModule.getOrg);
router.post("/InsertrfidTagInfo", receiveController.insertRfidTagInfo);
router.post("/UpdaterfidTagInfo", receiveController.updateRfidTagInfo);
router.post("/InsertFmStock", receiveController.insertFmStock);

module.exports = router.routes();
