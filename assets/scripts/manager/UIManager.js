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
        self.score = 0	
    },
    updateScore:function(num){
        self.score = num;
        self.scoreLabel.string = self.score;
    },
    addScore:function(num){
        self.score += num;
        cc.log(self.score);
        self.scoreLabel.string = self.score;
    }
});

module.exports = UIManager;