/*
module:CardManager
desc:卡片管理器
author:Canterer
 */
var CardNode = require("CardNode");

cc.Class({
    extends: cc.Component,

    properties: {
        row: 5,//卡牌行数
        col: 5,//卡牌列数
        gap: 5,//卡牌间距
        squareFlag: true,
        cardNodePrefab:{
            default: null,
            type:cc.Prefab
        },
        cardContent: cc.Node
    },

    onLoad:function(){
        this.cardSizeX = (cc.winSize.width - this.gap*(this.col+1))/this.col;
        if(this.squareFlag)
            this.cardSizeY = this.cardSizeX;
        else
            this.cardSizeY = (cc.winSize.width - this.gap*(this.row+1))/this.row;
        this.cardPositons = [];

        // this.cardNodes = [];
        // for (var i = 0; i < this.row; ++i) {
        //     for (var j =  0; j < this.col; ++j) {
        //         // var node = cc.instantiate(this.cardNodePrefab);
        //         this.cardNodes[i*this.col+j] = self:createCard(i,j)
        //     }
        //     this.cardNodes[i]
        // }
    },

    start () {

    },

    createCard:function(row, col, position)
    {
        var x = row*(this.gap+this.cardSizeX) - this.cardSizeX/2;
        var y = col*(this.gap+this.cardSizeY) - this.cardSizeY/2;

        // var type = 3;
        // if(type in CardColors)
        //     var color = CardColors[type];
        // else
        //     cc.log("type is error")
    }
});
