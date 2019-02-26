"use strict";
cc._RF.push(module, '81d53QlmORLLqbX6Cs0pOxM', 'AudioManager');
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