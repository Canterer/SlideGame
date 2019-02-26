/*
module:GameManager
desc:游戏管理器
author:Canterer
 */
cc.Class({
    extends: cc.Component,

    properties: {
        audioManager: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function () {
        this.audioManager = this.audioManager.getComponent("AudioManager");
        this.audioManager.playMusic();
            cc.director.preloadScene('MainGame', function () {
            cc.log('Next scene preloaded');
        });
    },

    start () {
    },

    getAudioManager: function(){
        return this.audioManager;
    },

    changeScene:function() {
        cc.director.loadScene("MainGame");
    },
});
