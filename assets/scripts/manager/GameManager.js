/*
module:GameManager
desc:游戏管理器
author:Canterer
 */
window.ZS = function(object){
    if(object==null){
        cc.log("ZS(null)");
        return;
    }
    cc.log("#############");
    var description = "--------------------------";
    for(var i in object){
        if(typeof(object[i]) != "function"){
            cc.log(i);
            cc.log(object[i]);
            cc.log(description);
        }
    }
};
cc.Class({
    extends: cc.Component,
    // ctor: function(){ this._super(); },

    // statics: {
    //     _instance: null,
    //     getInstance:function(){
    //         if(this._instance == null){
    //             this._instance = new this;
    //         }
    //         return this._instance;
    //     },
    // },

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        // cc.game.addPersistRootNode(this.node);//常驻节点

        // this.loadSceneManager();//获取当前场景的各种管理器
    },

    // 加载获取当前场景的各种管理器
    loadSceneManager:function(){
        cc.log("loadSceneManager");
        var audioManagerNode = cc.find("AudioManager");
        if(audioManagerNode != null)
            this.audioManager = audioManagerNode.getComponent("AudioManager");
        else
            this.audioManager = null;
        if(this.audioManager)
            cc.log("loaded audioManager");

        var uiManagerNode = cc.find("UIManager");
        if(uiManagerNode != null){
            this.uiManager = uiManagerNode.getComponent("UIManager");
            this.flag = false;
        }
        else
            this.uiManager = null;
        if(this.uiManager) 
            cc.log("loaded uiManager");
    },

    start () {
        // if(this.uiManager)
        //     this.uiManager.addScore(1);
        // if(this.audioManager)        
        //     this.audioManager.playMusic();
        cc.director.preloadScene('MainGame', function () {
            cc.log('Next scene preloaded');
        });
    },

    getAudioManager:function(){
        return this.audioManager;
    },

    getUIManager:function(){
        cc.log("getUIManager");
        return this.uiManager;
    },

    changeScene:function() {
        cc.director.loadScene("MainGame");//, ()=>{ this.loadSceneManager(); });
    },

    returnStartScene:function() {
        cc.log("returnStartScene");
        cc.director.loadScene("StartGame");//, ()=>{ this.loadSceneManager(); });
    },

    exitScene:function(){

    },
});
// module.exports = GameManager.getInstance();
