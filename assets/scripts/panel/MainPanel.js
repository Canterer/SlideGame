/*
module:MainPanel
desc:开始界面
author:Canterer
 */
var AudioManager = require("AudioManager");
cc.Class({
    extends: require("BasePanel"),
	properties: {
        // countLabel : cc.Label,
        // scoreLabel : cc.Label,
        // moneyMaxLabel : cc.Label,
        // monsterMaxLabel : cc.Label,
        // soldierMaxLabel : cc.Label,
        // gameOverLayer:cc.Node,
        audioManager: AudioManager,
    },

    onLoad:function(){
    	this._super();//调用父类BasePanel的onLoad()函数初始化baseUIList
    },

    start(){
    	this.gameOverLayer.active  = false;
    	this.time = 15;//计时
        this.score = 0;//得分
        this.timeCallback = function(){
            this.time -= 1;
            this.countLabel.string = this.time;
            if(this.time <= 0)
                this.gameOver();
        }
        this.schedule(this.timeCallback,1);
        this.audioManager.playMusic();
    },

    restartGame:function(){
        this.gameOverLayer.active  = false;
        this.time = 15;
        this.schedule(this.timeCallback,1);
        this.audioManager.playMusic();
        this.updateScore(0);
    },

    setScore:function(score){
        this.score = score
        this.scoreLabel.string = this.score;
    },

    changeScore:function(delta){
        this.score = this.score + delta;
        this.scoreLabel.string = this.score;
    },

    gameOver:function(){
        this.unschedule(this.timeCallback);
        this.gameOverLayer.active  = true;
        this.audioManager.stopMusic();
    },

    returnStartScene:function(){
        this.audioManager.stopMusic();
        this.gameMgr.returnStartScene();
    },

    resetTime:function(){
        this.time = 15;
    },
});