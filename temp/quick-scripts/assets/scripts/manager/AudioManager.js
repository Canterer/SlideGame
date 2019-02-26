(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/manager/AudioManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '81d53QlmORLLqbX6Cs0pOxM', 'AudioManager', __filename);
// scripts/manager/AudioManager.js

"use strict";

/*
module:AudioManager
desc:音频管理器
author:Canterer
 */
cc.Class({
    extends: cc.Component,

    properties: {
        audioNames: [cc.String],
        audioList: [cc.AudioClip]
    },

    start: function start() {},

    playMusic: function playMusic() {
        var bgm = this.getSFX("bgm2");
        cc.audioEngine.playMusic(bgm, true);
    },

    pauseMusic: function pauseMusic() {
        cc.audioEngine.pauseMusic();
    },

    resumeMusic: function resumeMusic() {
        cc.audioEngine.resumeMusic();
    },

    playSFX: function playSFX(name) {
        var clip = this.getSFX(name);
        cc.audioEngine.playEffect(clip, false);
    },

    getSFX: function getSFX(name) {
        for (var i = this.audioNames.length - 1; i >= 0; i--) {
            if (this.audioNames[i] == name) return this.audioList[i];
        }
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
        //# sourceMappingURL=AudioManager.js.map
        