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
        // cc.loader.loadRes("UI/"+type+"_"+num, cc.SpriteFrame, (error, spriteFrame)=>{
        //     if(error){
        //         cc.log(error);
        //         return;
        //     }
        //     this.sprite.spriteFrame = spriteFrame;
        // });       
        cc.loader.loadRes("UI/CardSheet", cc.SpriteAtlas, (error, atlas)=>{
            if(error){
                cc.log(error);
                return;
            }
            this.sprite.spriteFrame = atlas.getSpriteFrame(type+"_"+num);
        });       
    },
    // 检测是否可以合并target  noDirect若为true代表 检测相互合并 不代表方向
    checkMerge:function(target, noDirect){
        if(this.type == CardType.Soldier)//移动守卫
            if(target.type == CardType.Soldier)
                return this.num == target.num;
            else
                return this.num >= target.num;
        else if(target.type == CardType.Soldier)//双方类型不同且目标是守卫
            return noDirect && target.num >= this.num;
        else//同类型同数字的金币可以合并
            return this.type == CardType.Money && target.type == CardType.Money && this.num == target.num;
        return false;
    },

    getMergeScore:function(target){
        if(target.type == CardType.Monster)
            return Math.pow(2,target.num);
        return 0;
    },
});

module.exports = CardNode;
