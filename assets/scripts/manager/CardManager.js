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
        this.cardNodes = [];

        // var flag = false//false 从左往右 true 往返
        var delay = 0;
        for (var i = 0; i < this.row; ++i) {
        	this.cardPositons[i] = [];
        	this.cardNodes[i] = [];
            for (var j =  0; j < this.col; ++j) {
                var x = j*(this.gap+this.cardSizeX) + this.gap + this.cardSizeX/2;
        		var y = i*(this.gap+this.cardSizeY) + this.gap + this.cardSizeY/2;
        		this.cardPositons[i][j] = cc.v2(x,y)
                var cardNode = this.createCard(i,j, cc.v2(x, 2000));
                delay = delay + 0.1;
                var type = Math.floor(cc.random0To1()*2)+1;
                cardNode.initCard(type, 1)
                this.cardNodes[i][j] = cardNode;
                var action = cc.sequence(cc.delayTime(delay),cc.moveTo(1, cc.v2(x,y)));
		        cardNode.runAction(action);
            }
        }

        this.addEventHandler()
    },

    start () {

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
    addEventHandler:function(){
        for (var i = 0; i < this.row; ++i) {
            for (var j =  0; j < this.col; ++j) {
                var cardNode = this.cardNodes[i][j];
                cardNode.prefab.on('touchstart', (event)=>{
                    // this.touchCard = this.cardNodes[i][j];
                    this.touchI = i;
                    this.touchJ = j;
                });
            }
        }
        this.cardContent.on('touchstart', (event)=>{
            this.startPoint = event.getLocation();
        });
        this.cardContent.on('touchend', (event)=>{
            this.onTouchEnd(event);
        });
        this.cardContent.on('touchcancel', (event)=>{
            this.onTouchEnd(event);
        });
    },
    onTouchEnd:function(event){
        this.endPoint = event.getLocation();

        let vec = this.endPoint.subSelf(this.startPoint);
        if( vec.mag() > Touch_Min_Length){
            if(Math.abs(vec.x) > Math.abs(vec.y))//水平方向
            {
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

        this.touchCard = null;
    },
    moveDirection:function(n){
        if(n==1)
            cc.log("向右");
        else if( n==2)
            cc.log("向左");
        else if( n==3)
            cc.log("向上");
        else
            cc.log("向下");

        var object = new Error("ttt");
        var description = "111111111"; 
        // for(var i in object){
        //     cc.log(i);
        //     cc.log(object[i]);
        //     // var property=object[i]; 
        //     // description+= i+" = "+property+"\n"; 
        // }
        // cc.log(object.stack)
        cc.log(description);
        cc.log(this.touchI, this.touchJ)
        // cc.log(new Error().stack,this.touchI, this.touchJ);
    }

});
