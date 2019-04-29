const moment = require("moment");
const constants = require("../../../../utils/constants");

const panelConfig = require("../panelConfig");
const processDate = require("../processDate");
const productionOrders = require("../productionOrder");
const getProductionOrders = async ctx => {
    try {
        const config = await panelConfig.getPanelConfig(ctx.params.panelId);
        //const locationCode = config.find(o => o.PANEL_KEY === 'LocationCode').PANEL_VALUE;
        const locationCode = config.LocationCode;
        const productionDate = await processDate.getProcessDate(ctx.params.plantCode, locationCode);
        const resultRows = await productionOrders.getProductionOrders(ctx.params.plantCode, productionDate);
        ctx.body = JSON.stringify(resultRows);
    } catch (error) {
        console.log(error);
    }
};

const getPanelConfigs = async ctx => {
    try {
        //console.log("object");
        const config = await panelConfig.getPanelConfig(ctx.params.panelId);
        ctx.body = JSON.stringify(config);
        console.log("testyy");
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getProductionOrders,
    getPanelConfigs
};