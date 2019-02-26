(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/manager/GameManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b494aEECoRIarWphe92vd4B', 'GameManager', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GameManager.js.map
        