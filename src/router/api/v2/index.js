const Router = require("koa-router");
const router = new Router();
function log() {
    console.log("V2");
}
router.get("/test", log);
module.exports = router.routes();