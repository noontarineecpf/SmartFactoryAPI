const panelConfig = require("../PanelConfig");

const getPanelConfigs = async ctx => {
	try {
		//console.log("object");
		const config = await panelConfig.getPanelConfig(ctx.params.panelId);
		ctx.body = JSON.stringify(config);
	} catch (error) {
		ctx.response.status = 400;
		console.log(error);
	}
};

module.exports = {
	getPanelConfigs
};
