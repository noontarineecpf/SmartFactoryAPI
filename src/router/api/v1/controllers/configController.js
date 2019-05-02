const panelConfig = require("../panelConfig");

const getPanelConfigs = async ctx => {
    try {
        //console.log("object");
        const config = await panelConfig.getPanelConfig(ctx.params.panelId);
        ctx.body = JSON.stringify(config);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getPanelConfigs
};