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
    // 检测是否可以合并target  noDirect若为true代表 检测相互合并 不代表方向
    checkMerge:function(target, noDirect){
        if(this.type == CardType.Soldier){
            if(target.type == CardType.Soldier)//同数字守卫之间可以合并
                return this.num == target.num;
            else
                return this.num >= target.num;//小于守卫数据的金币、怪物可以被合并
        }else if(this.type == CardType.Money){//同数字金币之间可以合并
            if(this.type == target.type)
                return this.num == target.num;
        } 
        if(noDirect){//不判断方向
            return target.type == CardType.Soldier && this.num <= target.num;
        }
        return false;
    },
});

module.exports = CardNode;
