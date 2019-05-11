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
    if(object instanceof String){
        cc.log(object);
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
var GameManager = cc.Class({
    name: "GameManager",
    // extends: cc.Component,
    // ctor: function(){ this._super(); },
    statics: {
        _instance: null,
        getInstance:function(){
            if(this._instance == null){
                this._instance = new this;
            }
            return this._instance;
        },
    },

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
    },

    start () {
        // if(this.audioManager)        
        //     this.audioManager.playMusic();
    },

    getAudioManager:function(){
        return this.audioManager;
    },

    preloadScene:function(sceneName, callback){
        cc.director.preloadScene(sceneName, callback());
    },

    changeScene:function(sceneName) {
        cc.director.loadScene(sceneName);//, ()=>{ this.loadSceneManager(); });
    },

    returnStartScene:function() {
        cc.log("returnStartScene");
        cc.director.loadScene("StartGame");//, ()=>{ this.loadSceneManager(); });
    },

    exitScene:function(){

    },
});

module.exports = GameManager;
// module.exports = GameManager.getInstance();