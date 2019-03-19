/*
module:CardManager
desc:卡片管理器
author:Canterer
 */
const CardType = require('CardEnum').CardType;
var CardColors = require('CardEnum').CardColors;
var AssetsManager = require('AssetsManager');

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
        self.sprite = node.getComponent(cc.Sprite)
        // var label = this.prefab.getChildByName("Num");
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
        var path = "UI/"+this.type+"_"+this.num;
        AssetsManager.loadAssets(path, cc.SpriteFrame, (error, res)=>{
            if(error){
                cc.error(error);
                return;
            }
            self.sprite.spriteFrame = res;
        });
    }
});

module.exports = CardNode;
