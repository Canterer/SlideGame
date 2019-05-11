/*
module:BasePanel
desc:基础界面
author:Canterer
 */
const ComponentType = require('BaseUI').ComponentType;
var BaseUI = require('BaseUI').BaseUI;
var GameManager = require("GameManager");

var BasePanel = cc.Class({
    extends: cc.Component,
    properties: {
        baseUIList: {
        	default: [],
        	type: BaseUI,
        },
    },

    ctor: function(){ 
    	this.gameMgr = GameManager.getInstance();
    },

    // 必须在onLoad里初始化baseUIList
    onLoad:function(){
    	var length = this.baseUIList.length;
		for(var i=0; i<length; i++){
			let baseUI = this.baseUIList[i];
			if(baseUI != null && baseUI.UINode != null){
				let type = cc.Node;
				if(baseUI.UIType == ComponentType.Label)
					type = cc.Label;
				else if(baseUI.UIType == ComponentType.Sprite)
					type = cc.Sprite;
				else if(baseUI.UIType == ComponentType.RichText)
					type = cc.RichText;
				else{
					this[baseUI.UIName] = baseUI.UINode;
					continue;
				}
				this[baseUI.UIName] = baseUI.UINode.getComponent(type);
			}
		}
    },
});

module.exports = BasePanel;