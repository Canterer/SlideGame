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
        cardBgPrefab:{
            default: null,
            type:cc.Prefab
        },
        cardContent: cc.Node
    },

    onLoad:function(){
        this.cardNodes = [];
        this.cardNodeMap = [];
        this.adaptiveLayout();

        var delay = 0;
        var index = 0;
        var size = cc.size(this.cardSizeX, this.cardSizeY);
        for (var i = 1; i <= this.row; ++i) {
            this.cardNodeMap[i] = [];
            cc.log(this.offsetX, this.offsetY);
            for (var j =  1; j <= this.col; ++j) {
                var x = j*(this.gapX + this.cardSizeX) - this.cardSizeX/2 + this.offsetX;
        		var y = i*(this.gapY + this.cardSizeY) - this.cardSizeY/2 + this.offsetY;
                var position = cc.v2(x,y);
                this.initCardBg(i, j, size, position);

                delay = delay + 0.1;
                var type = Math.floor(Math.random()*3) + 1;
                var cardNode = this.createCard(type, 1, cc.v2(x, 2000));
                this.cardNodes[index] = cardNode;
                this.cardNodeMap[i][j] = index;
                var action = cc.sequence(cc.delayTime(delay),cc.moveTo(1, position));
		        cardNode.runAction(action);
                index = index + 1;
            }
        }
        this.addEventHandler();
    },

    start () {

    },

    // 自适应布局  计算居中偏移
    adaptiveLayout:function(){
        var offsetX = cc.winSize.width - this.col*(this.cardSizeX+this.gapX) - this.gapX;
        this.offsetX = this.offsetX + offsetX/2;
        var contentHeight = this.row*(this.cardSizeY + this.gapY) + this.gapY;
        this.cardContent.height = contentHeight + this.offsetY;
    },

    // 创建卡牌背景  用于响应触控事件
    initCardBg:function(row, col, size, position){
        var node = cc.instantiate(this.cardBgPrefab);
        node.name = 'cardBg_' + row + "_" + col;
        node.setContentSize(size);
        node.setParent(this.cardContent);
        node.setPosition(position);
        node.on('touchstart', (event)=>{
            this.touchRow = row;
            this.touchCol = col;
            this.startPoint = event.getLocation();
            cc.log(this.touchRow,this.touchCol);
        });
    },

    // 创建单个卡牌 并指定位置
    createCard:function(type, num, position)
    {
        var node = cc.instantiate(this.cardNodePrefab);
        node.setParent(this.cardContent);
        node.width = this.cardSizeX;
        node.height = this.cardSizeY;
        node.setPosition(position);
    	var cardNode = new CardNode(node);
        cardNode.updateCard(type, num);
        return cardNode;
    },

    addEventHandler:function(){
        // 触控开始事件 被子物体给戒断了
        this.cardContent.on('touchstart', (event)=>{
            cc.log("touchstart")
            // this.startPoint = event.getLocation();
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
            if(this.touchRow == null || this.touchCol == null)
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
        this.touchRow = null;
        this.touchCol = null;
    },

    moveDirection:function(n){
        // 1 向右 2 向左 3 向上 4 向下
        if(n==1)
            cc.log("向右");
        else if( n==2)
            this.touchMoveLeft();
        else if( n==3)
            cc.log("向上");
        else
            cc.log("向下");
    },

    touchMoveLeft:function(){
        cc.log("向左");
        cc.log(this.touchRow, this.touchCol);
        if(this.touchCol < 1)// 不能左移
            return;
        var touchIndex = this.cardNodeMap[this.touchRow][this.touchCol];
        var targetIndex = touchIndex - 1
        cc.log(touchIndex)
        var touchNode = this.cardNodes[touchIndex];
        var targetNode = this.cardNodes[targetIndex];
        cc.log(touchNode.type, touchNode.num, targetNode.type, targetNode.num);
        if(touchNode.type == targetNode.type && touchNode.num == targetNode.num){
            // 隐藏目标 并位移至最右边
            var x = this.col*(this.gapX + this.cardSizeX) + this.cardSizeX/2 + this.gapX + this.offsetX;
            targetNode.setPosition(cc.v2(x, targetNode.prefab.y));
            // 左移 当前点击卡牌及其右边所有卡牌
            for (var j = this.touchCol; j <= this.col; ++j) {
                let index = touchIndex + j - this.touchCol;
                let node = this.cardNodes[index];
                this.cardNodeMap[this.touchRow][j-1] = index;//更新映射
                let action = cc.moveBy(1, cc.v2(-this.cardSizeX-this.gapX, 0));
                node.runAction(action);
            }
            // 左移新增卡牌
            this.cardNodeMap[this.touchRow][this.col] = targetIndex;//更新映射
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
