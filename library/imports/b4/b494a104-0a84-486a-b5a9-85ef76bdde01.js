"use strict";
cc._RF.push(module, 'b494aEECoRIarWphe92vd4B', 'GameManager');
// scripts/manager/GameManager.js

'use strict';

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

    onLoad: function onLoad() {
        this.audioManager = this.audioManager.getComponent("AudioManager");
        this.audioManager.playMusic();
        cc.director.preloadScene('MainGame', function () {
            cc.log('Next scene preloaded');
        });
    },

    start: function start() {},


    getAudioManager: function getAudioManager() {
        return this.audioManager;
    },

    changeScene: function changeScene() {
        cc.director.loadScene("MainGame");
    }
});

cc._RF.pop();