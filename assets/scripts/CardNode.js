/*
module:CardNode
desc:卡片节点
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
        this.sprite = node.getComponent(cc.Sprite);
    },

    runAction:function(action){
        this.prefab.runAction(action);
    },
    setPosition:function(position){
        this.prefab.setPosition(position);
    },
    initCard:function(type, num)
    {
        // if(type in CardColors){
        //     this.type = type;
        //     // this.prefab.color = CardColors[type];
        // }else
        //     cc.log("type not in CardType: "+type);   
        this.type = type;
        this.num = num;
        this.updateCard(type, num);
    },
    updateCard:function(type, num)
    {
        this.type = type;
        this.num = num;
        cc.loader.loadRes("UI/"+type+"_"+num, cc.SpriteFrame, (error, spriteFrame)=>{
            if(error){
                cc.log(error);
                return;
            }
            this.sprite.spriteFrame = spriteFrame;
        });       
    },
});

module.exports = CardNode;
