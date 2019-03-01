/*
module:CardManager
desc:卡片管理器
author:Canterer
 */
const CardType = require('CardEnum').CardType;
// var CardColors = require('CardEnum').CardColors;

var CardNode = cc.Class({
    // name = "CardNode",
    properties: {
        prefabb: cc.Node,
        type: 0,
        num: 0,
        index: 1,
    },

    ctor:function(type){
        // this.node = node;
        // this.type = type;
        // this.num = num;
        // this.cardColor = CardColors[this.type];
        // if(this.type == CardType.Money)//mast
        
    }
});

module.exports = CardNode;
