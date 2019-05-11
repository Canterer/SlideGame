/*
module:StartPanel
desc:开始界面
author:Canterer
 */
cc.Class({
    extends: require("BasePanel"),

    onLoad:function(){
    	this._super();//调用父类BasePanel的onLoad()函数初始化baseUIList
    },

    start(){
    	this.gameMgr.preloadScene("MainGame", function () {
    		cc.log('Next scene MainGame is preloaded');
    	});
    },

    changeMainScene:function() {
        cc.log("changeMainScene");
        this.gameMgr.changeScene("MainGame");
    },

    changeGuideScene:function() {
        cc.log("changeGuideScene");
        this.gameMgr.changeScene("GuideGame");
    }
});