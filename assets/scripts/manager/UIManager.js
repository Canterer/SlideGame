/*
module:UIManager
desc:UI元素管理器
author:Canterer
 */
var UIManager = cc.Class({
    extends: cc.Component,

    properties: {
        countLabel : cc.Label,
        scoreLabel : cc.Label,
        moneyMaxLabel : cc.Label,
        monsterMaxLabel : cc.Label,
        soldierMaxLabel : cc.Label

    },
    onLoad:function () {
    },
    start () {
        this.score = 0	
    },
    updateScore:function(num){
        this.score = num;
        cc.log("sssss:"+this.score);
        this.scoreLabel.string = this.score;
    },
    addScore:function(num){
        this.score += num;
        cc.log(this.score);
        this.scoreLabel.string = this.score;
    }
});

module.exports = UIManager;