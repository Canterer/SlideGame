/*
module:AudioManager
desc:音频管理器
author:Canterer
 */
cc.Class({
    extends: cc.Component,

    properties: {
    },

    start:function(){
        this.bgMusicId = null;//当前播放背景
        this.playMusic();
    },

    playMusic:function(){
        cc.log("playMusic");
        if(this.bgMusicIndex == null)
            this.bgMusicIndex = -1;
        this.playNextBgMusic();
    },

    playNextBgMusic:function(){
        // this.bgMusicIndex = this.bgMusicIndex + 1;
        // this.bgMusicIndex = this.bgMusicIndex % 4;
        this.bgMusicIndex = 0;
        cc.log("bgIndex:"+this.bgMusicIndex);
        cc.loader.loadRes("Audio/"+"bgMusic_"+this.bgMusicIndex, cc.AudioClip, (error, clip)=>{
            if(error){
                cc.log(error);
                return;
            }
            cc.log("playMusic");
            this.bgMusicId = cc.audioEngine.playMusic(clip, true);
            // cc.audioEngine.setFinishCallback(this.bgMusicId, ()=>{
            //     cc.log("---------");
            //     this.playNextBgMusic();
            // });
        });  
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