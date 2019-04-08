/*
module:CardManager
desc:卡片管理器
author:Canterer
 */
var CardNode = require("CardNode");
// var GameManager = require("GameManager");
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
        gameOverLayer:cc.Node,
        cardContent: cc.Node,

        countLabel : cc.Label,
        scoreLabel : cc.Label,
    },

    onLoad:function(){
        this.cardNodes = [];//数组cardNodes
        this.cardNodeMap = [];//记录每行每列的卡牌 在数组cardNodes中的序号
        this.cardRowFlag = [];//记录每行是否可移动
        this.cardColFlag = [];//记录每列是否可移动
        this.moveTime = 0.5;//移动时长
        this.adaptiveLayout();
        this.gameOverLayer.active  = false;


        var delay = 0;
        var index = 0;
        var size = cc.size(this.cardSizeX, this.cardSizeY);
        for (var i = 1; i <= this.row; ++i) {
            this.cardNodeMap[i] = [];
            for (var j =  1; j <= this.col; ++j) {
                var x = j*(this.gapX + this.cardSizeX) - this.cardSizeX/2 - this.gapX + this.offsetX;
        		var y = i*(this.gapY + this.cardSizeY) - this.cardSizeY/2 - this.gapY + this.offsetY;
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

        // 检测记录 行列标识
        for (var i = 1; i <= this.row; ++i) {
            this.cardRowFlag[i] = this.checkRow(i);
        }
        for (var j = 1; j <= this.col; ++j) {
            this.cardColFlag[j] = this.checkCol(j);
        }
        this.checkGameOver();
        this.addEventHandler();
    },

    start () {
        // var gameMgr = GameManager.getInstance()
        // this.uiManager = gameMgr.getUIManager();
        this.time = 0;
        this.timeCallback = function(){
            this.time += 1;
            this.countLabel.string = this.time;
        }
        this.schedule(this.timeCallback,1);

        this.typeMaxNum = [];
        this.typeMaxNum[1] = 1;
        this.typeMaxNum[2] = 1;
        this.typeMaxNum[3] = 1;
    },

    // 自适应布局  计算居中偏移
    adaptiveLayout:function(){
        var offsetX = cc.winSize.width - this.col*(this.cardSizeX+this.gapX) - this.gapX;
        this.offsetX = this.offsetX + offsetX/2;
        var contentHeight = this.row*(this.cardSizeY + this.gapY) - this.gapY;
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
            // cc.log("touchstart")
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
                    this.touchMoveRight();
                else
                    this.touchMoveLeft();
                this.cardRowFlag[this.touchRow] = this.checkRow(this.touchRow);
            }else{
                if(vec.y > 0)
                    this.touchMoveUp();
                else
                    this.touchMoveDown();
                this.cardColFlag[this.touchCol] = this.checkCol(this.touchCol);
            }
        }
        this.scheduleOnce(function(){
            this.checkGameOver();
        }, this.moveTime);
        this.touchRow = null;
        this.touchCol = null;
    },

    touchMoveRight:function(){
        if(this.touchCol >= this.col)// 不能右移
            return;
        var touchIndex = this.cardNodeMap[this.touchRow][this.touchCol];
        var targetIndex = this.cardNodeMap[this.touchRow][this.touchCol+1]
        var touchNode = this.cardNodes[touchIndex];
        var targetNode = this.cardNodes[targetIndex];
        // cc.log(touchNode.type, touchNode.num, targetNode.type, targetNode.num);
        if(touchNode.checkMerge(targetNode, false)){
            //更新合并结果
            this.mergeCard(touchNode, targetNode);
            // 将目标放置至最左边
            var x = -this.gapX - this.cardSizeX/2 + this.offsetX;
            this.updateNewCard(targetNode);// 更新随机新卡片
            targetNode.setPosition(cc.v2(x, targetNode.prefab.y));
            // 右移 当前点击卡牌及其左边所有卡牌
            for (var j = this.touchCol; j >= 1; --j) {
                let index = this.cardNodeMap[this.touchRow][j];
                let node = this.cardNodes[index];
                this.cardNodeMap[this.touchRow][j+1] = index;//更新映射
                let action = cc.moveBy(this.moveTime, cc.v2(this.cardSizeX+this.gapX, 0));
                node.runAction(action);
            }
            // 右移新增卡牌
            this.cardNodeMap[this.touchRow][1] = targetIndex;//更新映射
            let action = cc.moveBy(this.moveTime, cc.v2(this.cardSizeX+this.gapX, 0));
            targetNode.runAction(action);
        }
    },

    touchMoveLeft:function(){
        if(this.touchCol < 1)// 不能左移
            return;
        var touchIndex = this.cardNodeMap[this.touchRow][this.touchCol];
        var targetIndex = this.cardNodeMap[this.touchRow][this.touchCol-1]
        var touchNode = this.cardNodes[touchIndex];
        var targetNode = this.cardNodes[targetIndex];
        // cc.log(touchNode.type, touchNode.num, targetNode.type, targetNode.num);
        if(touchNode.checkMerge(targetNode, false)){
            //更新合并结果
            this.mergeCard(touchNode, targetNode);
            // 将目标放置至最右边
            var x = this.col*(this.gapX + this.cardSizeX) + this.cardSizeX/2 + this.offsetX;
            this.updateNewCard(targetNode);// 更新随机新卡片
            targetNode.setPosition(cc.v2(x, targetNode.prefab.y));
            // 左移 当前点击卡牌及其右边所有卡牌
            for (var j = this.touchCol; j <= this.col; ++j) {
                let index = this.cardNodeMap[this.touchRow][j];
                let node = this.cardNodes[index];
                this.cardNodeMap[this.touchRow][j-1] = index;//更新映射
                let action = cc.moveBy(this.moveTime, cc.v2(-this.cardSizeX-this.gapX, 0));
                node.runAction(action);
            }
            // 左移新增卡牌
            this.cardNodeMap[this.touchRow][this.col] = targetIndex;//更新映射
            let action = cc.moveBy(this.moveTime, cc.v2(-this.cardSizeX-this.gapX, 0));
            targetNode.runAction(action);
        }
    },

    touchMoveUp:function(){
        if(this.touchRow >= this.rol)// 不能上移
            return;
        var touchIndex = this.cardNodeMap[this.touchRow][this.touchCol];
        var targetIndex = this.cardNodeMap[this.touchRow+1][this.touchCol]
        var touchNode = this.cardNodes[touchIndex];
        var targetNode = this.cardNodes[targetIndex];
        // cc.log(touchNode.type, touchNode.num, targetNode.type, targetNode.num);
        if(touchNode.checkMerge(targetNode, false)){
            //更新合并结果
            this.mergeCard(touchNode, targetNode);
            // 将目标放置至最下边
            var y = -this.gapY - this.cardSizeY/2 + this.offsetY;
            this.updateNewCard(targetNode);// 更新随机新卡片
            targetNode.setPosition(cc.v2(targetNode.prefab.x, y));
            // 上移 当前点击卡牌及其下边所有卡牌
            for (var i = this.touchRow; i >= 1; --i) {
                let index = this.cardNodeMap[i][this.touchCol];
                let node = this.cardNodes[index];
                this.cardNodeMap[i+1][this.touchCol] = index;//更新映射
                let action = cc.moveBy(this.moveTime, cc.v2(0,this.cardSizeY+this.gapY));
                node.runAction(action);
            }
            // 上移新增卡牌
            this.cardNodeMap[1][this.touchCol] = targetIndex;//更新映射
            let action = cc.moveBy(this.moveTime, cc.v2(0,this.cardSizeY+this.gapY));
            targetNode.runAction(action);
        }
    },

    touchMoveDown:function(){
        if(this.touchRow < 1)// 不能下移
            return;
        var touchIndex = this.cardNodeMap[this.touchRow][this.touchCol];
        var targetIndex = this.cardNodeMap[this.touchRow-1][this.touchCol]
        var touchNode = this.cardNodes[touchIndex];
        var targetNode = this.cardNodes[targetIndex];
        // cc.log(touchNode.type, touchNode.num, targetNode.type, targetNode.num);
        if(touchNode.checkMerge(targetNode, false)){
            //更新合并结果
            this.mergeCard(touchNode, targetNode);
            // 将目标放置至最右边
            var y = this.row*(this.gapY + this.cardSizeY) + this.cardSizeY/2 + this.offsetY;
            this.updateNewCard(targetNode);// 更新随机新卡片
            targetNode.setPosition(cc.v2(targetNode.prefab.x, y));
            // 下移 当前点击卡牌及其右边所有卡牌
            for (var i = this.touchRow; i <= this.row; ++i) {
                let index = this.cardNodeMap[i][this.touchCol];
                let node = this.cardNodes[index];
                this.cardNodeMap[i-1][this.touchCol] = index;//更新映射
                let action = cc.moveBy(this.moveTime, cc.v2(0,-this.cardSizeY-this.gapY));
                node.runAction(action);
            }
            // 下移新增卡牌
            this.cardNodeMap[this.row][this.touchCol] = targetIndex;//更新映射
            let action = cc.moveBy(this.moveTime, cc.v2(0,-this.cardSizeY-this.gapY));
            targetNode.runAction(action);
        }
    },

    // 检测该行是否可合并
    checkRow:function(row){
        let firstIndex = this.cardNodeMap[row][1];
        var lastNode = this.cardNodes[firstIndex];
        for (var j = 2; j <= this.col; ++j) {
            let index = this.cardNodeMap[row][j];
            let node = this.cardNodes[index];
            if(node.checkMerge(lastNode, true))
                return true;
            lastNode = node;
        }
        // 检查上一行
        if(row > 1){
            var index,upNode,node;
            for (var j = 1; j <= this.col; ++j) {
                index = this.cardNodeMap[row][j];
                node = this.cardNodes[index];
                index = this.cardNodeMap[row-1][j];
                upNode = this.cardNodes[index];
                if(node.checkMerge(upNode, true))
                    return false;
            }
        }
        // 检查下一行
        if(row < this.row){
            var index,downNode,node;
            for (var j = 1; j <= this.col; ++j) {
                index = this.cardNodeMap[row][j];
                node = this.cardNodes[index];
                index = this.cardNodeMap[row+1][j];
                downNode = this.cardNodes[index];
                if(node.checkMerge(downNode, true))
                    return false;
            }
        }
        return false;
    },

    // 检测该列是否可合并
    checkCol:function(col){
        let firstIndex = this.cardNodeMap[1][col];
        var lastNode = this.cardNodes[firstIndex];
        for (var i = 2; i <= this.row; ++i) {
            let index = this.cardNodeMap[i][col];
            let node = this.cardNodes[index];
            if(node.checkMerge(lastNode, true))
                return true;
            lastNode = node;
        }
        // 检查左一列
        if(col > 1){
            var index,leftNode,node;
            for (var i = 1; i <= this.row; ++i) {
                index = this.cardNodeMap[i][col];
                node = this.cardNodes[index];
                index = this.cardNodeMap[i][col-1];
                leftNode = this.cardNodes[index];
                if(node.checkMerge(leftNode, true))
                    return true;
            }
        }
        // 检查右一列
        if(col < this.col){
            var index,rightNode,node;
            for (var i = 1; i <= this.row; ++i) {
                index = this.cardNodeMap[i][col];
                node = this.cardNodes[index];
                index = this.cardNodeMap[i][col+1];
                rightNode = this.cardNodes[index];
                if(node.checkMerge(rightNode, true))
                    return true;
            }
        }
        return false;
    },

    checkGameOver:function(){
        for (var i = 1; i <= this.row; ++i) {
            if(this.cardRowFlag[i] == true)
                return;
        }
        for (var j = 1; j <= this.col; ++j) {
            if(this.cardColFlag[i] == true)
                return;
        }
        this.gameOverLayer.active  = true;
        this.unschedule(this.timeCallback);
    },

    addScore:function(score){
        if(this.score == null)
            this.score = 0;
        this.score = this.score + score
        this.scoreLabel.string = this.score;
        // this.uiManager.addScore(score);
    },

    restartGame:function(){
        this.gameOverLayer.active  = false;
        var delay = 0;
        var size = cc.size(this.cardSizeX, this.cardSizeY);
        for (var i = 1; i <= this.row; ++i) {
            for (var j =  1; j <= this.col; ++j) {
                var x = j*(this.gapX + this.cardSizeX) - this.cardSizeX/2 - this.gapX + this.offsetX;
                var y = i*(this.gapY + this.cardSizeY) - this.cardSizeY/2 - this.gapY + this.offsetY;
                var position = cc.v2(x,y);

                delay = delay + 0.1;
                var type = Math.floor(Math.random()*3) + 1;
                var index = this.cardNodeMap[i][j];
                var cardNode = this.cardNodes[index];
                cardNode.updateCard(type, 1);
                cardNode.setPosition(cc.v2(x, 2000));
                var action = cc.sequence(cc.delayTime(delay),cc.moveTo(1, position));
                cardNode.runAction(action);
            }
        }

        this.time = 0;
        this.schedule(this.timeCallback,1);
        this.score = 0;
        this.addScore(0);

        // 检测记录 行列标识
        for (var i = 1; i <= this.row; ++i) {
            this.cardRowFlag[i] = this.checkRow(i);
        }
        for (var j = 1; j <= this.col; ++j) {
            this.cardColFlag[j] = this.checkCol(j);
        }
        this.checkGameOver();
    },

    //更新合并结果  先判断是否可合并
    mergeCard:function(touchNode, targetNode){
        if(touchNode.type == targetNode.type){
            let maxNum = this.typeMaxNum[targetNode.type];
            if(maxNum <= touchNode.num){
                this.typeMaxNum[targetNode.type] = touchNode.num+1;
                cc.log("update:"+touchNode.type+" maxNum:"+maxNum);
            }
            touchNode.updateCard(touchNode.type, touchNode.num+1);
        }
        else
            this.addScore(touchNode.getMergeScore(targetNode));
    },

    updateNewCard:function(target){
        let type = Math.floor(Math.random()*3) + 1;
        let num = 1;
        if(type == 3){//怪物
            let currMax = this.typeMaxNum[2];//获取当前守卫最大值
            num = Math.floor(Math.random()*3)
            cc.log("currMax:"+currMax+" random:"+num);            
            num = num + currMax - 1;
            num = Math.max(1, num);            
            num = Math.min(num, 9);            
        }
        cc.log("updateNewCard:"+type+"-"+num);
        target.updateCard(type,num);
    },
});
