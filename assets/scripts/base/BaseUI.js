/*
module:BaseUI
desc:基础UI元素
author:Canterer
 */
var ComponentType = cc.Enum({
	Node : 0,
	Label : 1,
	Sprite : 2,
	RichText : 3,
});
var BaseUI = cc.Class({
	name: "BaseUI",
	properties: {
		UIName: "uiName",
		UIType: {
			type: cc.Enum(ComponentType),
			default: ComponentType.Node,
		},
		UINode:{
			type: cc.Node,
			default: null,
		},
	}
});

module.exports = {
	BaseUI,
	ComponentType
};