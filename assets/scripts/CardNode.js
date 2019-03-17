/*
module:CardManager
desc:卡片管理器
author:Canterer
 */
const CardType = require('CardEnum').CardType;
var CardColors = require('CardEnum').CardColors;

var CardNode = cc.Class({
    // name = "CardNode",
    properties: {
        prefab: cc.Node,
        type: 0,
        num: 0,
        index: 1,
    },

    ctor:function(node){
        this.prefab = node;
        
        // var label = this.prefab.getChildByName("Num");
        // var sprite = this.prefab.getChildByName("Sprite");
        // this.numLabel = label.getComponent(cc.Label);
        // this.type = type;
        // this.num = num;
        // this.cardColor = CardColors[this.type];
        // if(this.type == CardType.Money)//mast
        
    },

    runAction:function(action){
        this.prefab.runAction(action);
    },

    initCard:function(type, num)
    {
        if(type in CardColors){
            this.type = type;
            // this.prefab.color = CardColors[type];
        }else
            cc.log("type not in CardType: "+type);
        this.updateCard(num);
    },

    updateCard:function(num)
    {
        this.num = num;
        // this.numLabel.string = this.num;
        // 
    }
});

module.exports = CardNode;
