/*
module:CardManager
desc:卡片管理器
author:Canterer
 */
var CardNode = require("CardNode");
const Touch_Min_Length = 40;

cc.Class({
    extends: cc.Component,

    properties: {
        row: 5,//卡牌行数
        col: 5,//卡牌列数
        gapX: 0,//卡牌间距
        gapY: 0,//卡牌间距
        cardSizeX:0,//卡牌大小
        cardSizeY:0,//卡牌大小        
        offsetX:0,//偏移 默认居中显示后的偏移        
        offsetY:0,//偏移 默认居中显示后的偏移
        cardNodePrefab:{
            default: null,
            type:cc.Prefab
        },
        cardContent: cc.Node
    },

    onLoad:function(){
        this.cardPositons = [];
        this.cardNodes = [];
        this.adaptiveLayout();

        var delay = 0;
        for (var i = 0; i < this.row; ++i) {
        	this.cardPositons[i] = [];
        	this.cardNodes[i] = [];
            cc.log(this.offsetX, this.offsetY);
            for (var j =  0; j < this.col; ++j) {
                var x = j*(this.gapX + this.cardSizeX) + this.cardSizeX/2 + this.gapX + this.offsetX;
        		var y = i*(this.gapY + this.cardSizeY) + this.cardSizeY/2 + this.gapY + this.offsetY;
                var cardNode = this.createCard(i,j, cc.v2(x, 2000));
                this.cardPositons[i][j] = cc.v2(x,y);
                this.cardNodes[i][j] = cardNode;
                delay = delay + 0.1;
                var type = Math.floor(Math.random()*2) + 1;
                cardNode.initCard(type, 1);
                var action = cc.sequence(cc.delayTime(delay),cc.moveTo(1, cc.v2(x,y)));
		        cardNode.runAction(action);
            }
        }
        this.addEventHandler();
    },

    start () {

    },

    // 自适应布局
    adaptiveLayout:function(){
        var offsetX = cc.winSize.width - this.col*(this.cardSizeX+this.gapX) - this.gapX;
        this.offsetX = this.offsetX + offsetX/2;
        var contentHeight = this.row*(this.cardSizeY + this.gapY) + this.gapY;
        this.cardContent.height = contentHeight + this.offsetY;
    },

    createCard:function(row, col, position)
    {
        var node = cc.instantiate(this.cardNodePrefab);
        node.setParent(this.cardContent);
        node.width = this.cardSizeX;
        node.height = this.cardSizeY;
        node.setPosition(position);
    	var cardNode = new CardNode(node)
        // var type = 3;
        // if(type in CardColors)
        //     var color = CardColors[type];
        // else
        //     cc.log("type is error")
        return cardNode;
    },
    // updateSprite:function(){
    //     cc.loader.loadResDir("UI", cc.SpriteFrame, function(error, spriteFrames){
    //         if(error){
    //             cc.log(error);
    //             return;
    //         }
    //         this.spriteFrames = []
    //         for (var i = 0; i < 3; ++i) { 
    //             this.spriteFrames[i+1] = []
    //             for (var j =  1; j <= 8; ++j) {
    //                 this.spriteFrames[i+1][j] = spriteFrames[i*8+j];
    //             }
    //         }
    //         for (var i = 0; i < this.row; ++i) {
    //             for (var j =  0; j < this.col; ++j) {
    //                 var node = this.cardNodes[i][j];
    //                 node:updateSprite(this.spriteFrames[i])
    //             }
    //         }
    //     });
    // },
    addEventHandler:function(){
        for (let i = 0; i < this.row; ++i) {
            for (let j =  0; j < this.col; ++j) {
                var cardNode = this.cardNodes[i][j];
                cardNode.prefab.on('touchstart', (event)=>{
                    this.touchI = i;
                    this.touchJ = j;
                    this.startPoint = event.getLocation();
                    cc.log(this.touchI,this.touchJ);
                });
            }
        }
        this.cardContent.on('touchstart', (event)=>{
            cc.log("touchstart")
            this.startPoint = event.getLocation();
            // var target = event.getCurrentTarget();
            // var locationInNode = target.convertToNodeSpace(this.startPoint);
        }, true);
        this.cardContent.on('touchend', (event)=>{
            this.onTouchEnd(event);
        });
        this.cardContent.on('touchcancel', (event)=>{
            this.onTouchEnd(event);
        });
    },
    onTouchEnd:function(event){
        this.endPoint = event.getLocation();
        var vec = this.endPoint.sub(this.startPoint);
        if( vec.mag() > Touch_Min_Length){
            if(this.touchI == null || this.touchJ == null)
                return;
            if(Math.abs(vec.x) > Math.abs(vec.y)){//水平方向
                if(vec.x > 0)
                    this.moveDirection(1);
                else
                    this.moveDirection(2);
            }else{
                if(vec.y > 0)
                    this.moveDirection(3);
                else
                    this.moveDirection(4);
            }
        }
        this.touchI = null;
        this.touchJ = null;
    },
    moveDirection:function(n){
        // 1 向右 2 向左 3 向上 4 向下
        if(n==1)
            cc.log("向右");
        else if( n==2)
            this.moveLeft();
        else if( n==3)
            cc.log("向上");
        else
            cc.log("向下");
    },

    moveLeft:function(){
        cc.log("向左");
        cc.log(this.touchI, this.touchJ);
        if(this.touchJ < 1)
            return;
        var targetI = this.touchI;
        var targetJ = this.touchJ - 1;
        var touchNode = this.cardNodes[this.touchI][this.touchJ];
        var targetNode = this.cardNodes[targetI][targetJ];
        if(touchNode.type == targetNode.type && touchNode.num == targetNode.num){
            var x = this.col*(this.gapX + this.cardSizeX) + this.cardSizeX/2 + this.gapX + this.offsetX;
            targetNode.setPosition(cc.v2(x, targetNode.prefab.y));
            for (var j = this.touchJ; j < this.col; ++j) {
                let node = this.cardNodes[this.touchI][j];
                this.cardNodes[this.touchI][j-1] = node;
                let action = cc.moveBy(1, cc.v2(-this.cardSizeX-this.gapX, 0));
                node.runAction(action);
            }
            this.cardNodes[this.touchI][this.col-1] = targetNode;
            let action = cc.moveBy(1, cc.v2(-this.cardSizeX-this.gapX, 0));
            targetNode.runAction(action);
            cc.log(touchNode.type, touchNode.num);
            touchNode.updateCard(touchNode.type, touchNode.num+1);
        }
    },

    ZS:function(object){
        cc.log("#############");
        var description = "--------------------------";
        for(var i in object){
            if(typeof(object[i]) != "function"){
                cc.log(i);
                cc.log(object[i]);
                cc.log(description);
            }
        }
    },
});
