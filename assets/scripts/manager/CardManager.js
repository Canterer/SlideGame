/*
module:CardManager
desc:卡片管理器
author:Canterer
 */
var CardNode = require("CardNode");

cc.Class({
    extends: cc.Component,

    properties: {
        row: 8,//卡牌行数
        col: 5,//卡牌列数
        gap: 40,//卡牌间距
        squareFlag: false,
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
        else{
            var height = this.cardContent.height;
            this.cardSizeY = (height - this.gap*(this.row+1))/this.row;
        }

        this.cardPositons = [];

        // this.cardNodes = [];
        for (var i = 1; i <= this.row; ++i) {
            for (var j =  1; j <= this.col; ++j) {
                var x = j*(this.gap+this.cardSizeX) - this.cardSizeX/2;
                this.createCard(i,j, cc.p(x, 2000));
            }
        }
    },

    start () {

    },

    createCard:function(row, col, position)
    {
        var node = cc.instantiate(this.cardNodePrefab);
        node.setParent(this.cardContent);
        var x = col*(this.gap+this.cardSizeX) - this.cardSizeX/2;
        var y = row*(this.gap+this.cardSizeY) - this.cardSizeY/2;
        cc.log(x,y);
        node.width = this.cardSizeX;
        node.height = this.cardSizeY;
        node.setPosition(position);

        var action = cc.moveTo(1, cc.v2(x,y));
        node.runAction(action);

        // var type = 3;
        // if(type in CardColors)
        //     var color = CardColors[type];
        // else
        //     cc.log("type is error")
    }
});
