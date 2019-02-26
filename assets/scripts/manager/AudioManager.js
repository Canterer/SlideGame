/*
module:AudioManager
desc:音频管理器
author:Canterer
 */
cc.Class({
    extends: cc.Component,

    properties: {
        audioNames:[cc.String],
        audioList:[cc.AudioClip]
    },

    start:function(){

    },

    playMusic:function(){
        var bgm = this.getSFX("bgm2")
        cc.audioEngine.playMusic(bgm, true);
    },

    pauseMusic:function(){
        cc.audioEngine.pauseMusic();
    },

    resumeMusic:function() {
        cc.audioEngine.resumeMusic();
    },

    playSFX:function(name){
        var clip = this.getSFX(name);
        cc.audioEngine.playEffect(clip, false);
    },

    getSFX:function(name){
        for (var i = this.audioNames.length - 1; i >= 0; i--) {
            if(this.audioNames[i] == name)
                return this.audioList[i];
        }
    },
});