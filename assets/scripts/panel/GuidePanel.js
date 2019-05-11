/*
module:MainPanel
desc:开始界面
author:Canterer
 */
var BaseGuide = require("BaseGuide");
var CardNode = require("CardNode");
const CardType = require('CardEnum').CardType;
const Touch_Min_Length = 40;

var GuidePanel = cc.Class({
    extends: require("BasePanel"),

	properties: {
        // countLabel : cc.Label,
        // scoreLabel : cc.Label,
        // guideLayer : cc.Node, // 遮罩层
        // holeMask : cc.Node, // 空洞遮罩
        // arrow : cc.Node, // 箭头
        // finger : cc.Node, // 手势
        // tipLabel : cc.RichText,
        // cardContent : cc.Node,
        // centerCard : cc.Node,
        // cardBg_1 : cc.Node,
        // cardBg_2 : cc.Node,
        // cardBg_3 : cc.Node,
        // cardBg_4 : cc.Node,
        // cardNode_1 : cc.Node,
        // cardNode_2 : cc.Node,
        // cardNode_3 : cc.Node,
        // cardNode_4 : cc.Node,

        row: 2,//卡牌行数
        col: 2,//卡牌列数
        gapX: 0,//卡牌间距
        gapY: 0,//卡牌间距
        cardSizeX:0,//卡牌大小
        cardSizeY:0,//卡牌大小        
        offsetX:0,//偏移 默认居中显示后的偏移        
        offsetY:0,//偏移 默认居中显示后的偏移
    },

    onLoad:function(){
    	this._super();//调用父类BasePanel的onLoad()函数初始化baseUIList
    },

    start(){
        this.adaptiveLayout();
        this.initCard();
        this.startGuide();
        this.addEventHandler();
    },

    adaptiveLayout:function(){
        var offsetX = cc.winSize.width - this.col*(this.cardSizeX+this.gapX) + this.gapX;
        this.offsetX = this.offsetX + offsetX/2 - cc.winSize.width/2;
        // var contentHeight = this.row*(this.cardSizeY + this.gapY) - this.gapY;
        // this.cardContent.height = contentHeight + this.offsetY;
    },

    initCard:function(){
        this.moveTime = 0.5;//移动时长
        this.cardNodes = [];//数组cardNodes
        this.cardNodeMap = [];//记录每行每列的卡牌 在数组cardNodes中的序号
        this.touchRow = null;// 触控行号
        this.touchCol = null;// 触控列号
        this.centerCardNode = new CardNode();
        this.centerCardNode.initCard(this.centerCard, CardType.Money, 1);
        this.centerCardNode.setShow(false);
        var index = 0;
        for (var i = 1; i <= this.row; ++i) {
            this.cardNodeMap[i] = [];
            for (var j =  1; j <= this.col; ++j) {
                index = index + 1;
                this.initCardBg(index, i, j);
                this.cardNodes[index] = new CardNode();
                this.cardNodes[index].initCard(this["cardNode_"+index], 1, 1);
                this.cardNodes[index].setShow(false);
                this.cardNodeMap[i][j] = index;                
            }
        }
    },

    // 创建卡牌背景  用于响应触控事件
    initCardBg:function(index, row, col){
        this["cardBg_"+index].on('touchstart', (event)=>{
            this.touchRow = row;
            this.touchCol = col;
            this.startPoint = event.getLocation();
            cc.log(this.touchRow,this.touchCol);
        });
        this["cardBg_"+index].active = false;
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
        this.guideLayer.on('touchstart', (event)=>{
            // 黑屏 屏蔽所有点击
        });
    },

    onTouchEnd:function(event){
        if(this.startPoint == null)
            return;
        this.endPoint = event.getLocation();
        var vec = this.endPoint.sub(this.startPoint);
        if( vec.mag() > Touch_Min_Length){
            if(this.touchRow == null || this.touchCol == null)
                return;

            // 点击滑动
            var failedFlag = false;//操作失败
            if(this.currGuide != null){//存在当前指引
                var state = this.currGuide.getState();
                if(state == 7){
                    if(this.touchRow == 1 && this.touchCol == 1)
                        this.currGuide.changeState(this.guideNextIndex);
                    else{
                        this.currGuide.changeState(11);
                        failedFlag = true;
                    }
                }else if(state == 8){
                    if(this.touchRow == 2 && this.touchCol == 1)
                        this.currGuide.changeState(this.guideNextIndex);
                    else{
                        this.currGuide.changeState(12);
                        failedFlag = true;
                    }
                }else if(state == 9){
                    if(this.touchRow == 2 && this.touchCol == 2)
                        this.currGuide.changeState(this.guideNextIndex);
                    else{
                        this.currGuide.changeState(13);                    
                        failedFlag = true;
                    }
                }else if(state == 10){
                    if(this.touchRow == 1 && this.touchCol == 2)
                        this.currGuide.changeState(this.guideNextIndex);
                    else{
                        this.currGuide.changeState(14);                    
                        failedFlag = true;
                    }
                }
            }

            if(failedFlag){//指引操作失败 拒绝触发
                this.touchRow = null;
                this.touchCol = null;
                return;
            }

            cc.log("touch move");
            if(Math.abs(vec.x) > Math.abs(vec.y)){//水平方向
                if(vec.x > 0)
                    this.touchMoveRight();
                else
                    this.touchMoveLeft();
            }else{
                if(vec.y > 0)
                    this.touchMoveUp();
                else
                    this.touchMoveDown();
            }
        }
        this.touchRow = null;
        this.touchCol = null;
        this.startPoint = null;
    },

    touchMoveRight:function(){
        if(this.touchCol >= this.col)// 不能右移
            return;
        var touchIndex = this.cardNodeMap[this.touchRow][this.touchCol];
        var targetIndex = this.cardNodeMap[this.touchRow][this.touchCol+1];
        var touchNode = this.cardNodes[touchIndex];
        var targetNode = this.cardNodes[targetIndex];
        // cc.log(touchNode.type, touchNode.num, targetNode.type, targetNode.num);
        if(touchNode.checkMerge(targetNode, false)){
            //更新合并结果
            if(touchNode.type == targetNode.type)
                touchNode.updateCard(touchNode.type, touchNode.num+1);
            // 将目标放置至最左边
            var x = this.cardSizeX/2 + this.offsetX;
            targetNode.setShow(false);
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
        }
    },

    touchMoveLeft:function(){
        if(this.touchCol <= 1)// 不能左移
            return;
        var touchIndex = this.cardNodeMap[this.touchRow][this.touchCol];
        var targetIndex = this.cardNodeMap[this.touchRow][this.touchCol-1];
        var touchNode = this.cardNodes[touchIndex];
        var targetNode = this.cardNodes[targetIndex];
        // cc.log(touchNode.type, touchNode.num, targetNode.type, targetNode.num);
        if(touchNode.checkMerge(targetNode, false)){
            //更新合并结果
            if(touchNode.type == targetNode.type)
                touchNode.updateCard(touchNode.type, touchNode.num+1);
            // 将目标放置至最右边
            var x = this.col*(this.gapX + this.cardSizeX) - this.gapX - this.cardSizeX/2 + this.offsetX;
            targetNode.setShow(false);
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
        }
    },

    touchMoveUp:function(){
        if(this.touchRow <= 1)// 不能上移
            return;
        var touchIndex = this.cardNodeMap[this.touchRow][this.touchCol];
        var targetIndex = this.cardNodeMap[this.touchRow-1][this.touchCol];
        var touchNode = this.cardNodes[touchIndex];
        var targetNode = this.cardNodes[targetIndex];
        // cc.log(touchNode.type, touchNode.num, targetNode.type, targetNode.num);
        if(touchNode.checkMerge(targetNode, false)){
            //更新合并结果
            if(touchNode.type == targetNode.type)
                touchNode.updateCard(touchNode.type, touchNode.num+1);
            // 将目标放置至最下边
            var y = this.row*(this.gapY + this.cardSizeY) - this.gapY - this.cardSizeY/2 + this.offsetY;
            targetNode.setShow(false);
            targetNode.setPosition(cc.v2(targetNode.prefab.x, -y));
            // 上移 当前点击卡牌及其下边所有卡牌
            for (var i = this.touchRow; i <= this.row; ++i) {
                let index = this.cardNodeMap[i][this.touchCol];
                let node = this.cardNodes[index];
                this.cardNodeMap[i-1][this.touchCol] = index;//更新映射
                let action = cc.moveBy(this.moveTime, cc.v2(0,this.cardSizeY+this.gapY));
                node.runAction(action);
            }
            // 上移新增卡牌
            this.cardNodeMap[this.row][this.touchCol] = targetIndex;//更新映射
        }
    },

    touchMoveDown:function(){
        if(this.touchRow >= this.row)// 不能下移
            return;
        var touchIndex = this.cardNodeMap[this.touchRow][this.touchCol];
        var targetIndex = this.cardNodeMap[this.touchRow+1][this.touchCol];
        var touchNode = this.cardNodes[touchIndex];
        var targetNode = this.cardNodes[targetIndex];
        // cc.log(touchNode.type, touchNode.num, targetNode.type, targetNode.num);
        if(touchNode.checkMerge(targetNode, false)){
            //更新合并结果
            if(touchNode.type == targetNode.type)
                touchNode.updateCard(touchNode.type, touchNode.num+1);
            // 将目标放置至最右边
            var y = this.cardSizeY/2 + this.offsetY;
            targetNode.setShow(false);
            targetNode.setPosition(cc.v2(targetNode.prefab.x, -y));
            // 下移 当前点击卡牌及其右边所有卡牌
            for (var i = this.touchRow; i >= 1; --i) {
                let index = this.cardNodeMap[i][this.touchCol];
                let node = this.cardNodes[index];
                this.cardNodeMap[i+1][this.touchCol] = index;//更新映射
                let action = cc.moveBy(this.moveTime, cc.v2(0,-this.cardSizeY-this.gapY));
                node.runAction(action);
            }
            // 下移新增卡牌
            this.cardNodeMap[1][this.touchCol] = targetIndex;//更新映射
        }
    },

    startGuide:function(){
        var arrowPos = [];
        arrowPos[1] = cc.v2(0, -140);// 上
        arrowPos[2] = cc.v2(0, -620);// 下
        arrowPos[3] = cc.v2(-203, -380);// 左
        arrowPos[4] = cc.v2(203, -380);// 右
        var fingerPos = [];
        fingerPos[1] = cc.v2(-203, 455.5);// 1号卡牌
        fingerPos[2] = cc.v2(203, 455.5);// 2号卡牌
        fingerPos[3] = cc.v2(-203, -24.5);// 3号卡牌
        fingerPos[4] = cc.v2(203, -24.5);// 4号卡牌
        var fingerMoveDis = 200;
        var fingerScaleAction = cc.sequence(            
            cc.scaleTo(1, 1.5, 1.5),            
            cc.scaleTo(1, 1, 1),    
        );
        var fingerActs = [];
        fingerActs[1] = cc.sequence(// 1 右滑 2
            cc.callFunc(function(){
                this.tipLabel.string = "<color=#FAACB6>点击卡片滑动!</color>";
                this.holeMask.setContentSize(cc.size(662, 320));
                this.holeMask.setPosition(cc.v2(-1, -140));
                this.holeMask.active = true;
                this.finger.setPosition(fingerPos[1]);
            }, this),
            fingerScaleAction,
            cc.moveBy(1.5, cc.v2(fingerMoveDis, 0)),
            cc.callFunc(function(){
                this.finger.active = false;
                this.holeMask.active = false;
            }, this),
        );
        fingerActs[2] = cc.sequence(// 2 左滑 1
            cc.callFunc(function(){
                this.tipLabel.string = "<color=#FAACB6>点击卡片滑动!</color>";
                this.holeMask.setContentSize(cc.size(662, 320));
                this.holeMask.setPosition(cc.v2(-1, -140));
                this.holeMask.active = true;
                this.finger.setPosition(fingerPos[2]);
            }, this),
            fingerScaleAction,
            cc.moveBy(1.5, cc.v2(-fingerMoveDis, 0)),
            cc.callFunc(function(){
                this.finger.active = false;
                this.holeMask.active = false;
            }, this),
        );
        fingerActs[3] = cc.sequence(// 3 上滑 1
            cc.callFunc(function(){
                this.tipLabel.string = "<color=#FAACB6>点击卡片滑动!</color>";
                this.holeMask.setContentSize(cc.size(256, 800));
                this.holeMask.setPosition(cc.v2(-203, -380));
                this.holeMask.active = true;
                this.finger.setPosition(fingerPos[3]);
            }, this),
            fingerScaleAction,
            cc.moveBy(1.5, cc.v2(0, fingerMoveDis)),
            cc.callFunc(function(){
                this.finger.active = false;
                this.holeMask.active = false;
            }, this),
        );
        fingerActs[4] = cc.sequence(// 4 上滑 2
            cc.callFunc(function(){
                this.tipLabel.string = "<color=#FAACB6>点击卡片滑动!</color>";
                this.holeMask.setContentSize(cc.size(256, 800));
                this.holeMask.setPosition(cc.v2(203, -380));
                this.holeMask.active = true;
                this.finger.setPosition(fingerPos[4]);
            }, this),
            fingerScaleAction,
            cc.moveBy(1.5, cc.v2(0, fingerMoveDis)),
            cc.callFunc(function(){
                this.finger.active = false;
                this.holeMask.active = false;
            }, this),
        );
        var guideHead = new BaseGuide();
        this.guideNextIndex = null;
        var newStateLoop = function(guide){
            var state = guide.getState();
            // var newState = state;
            if(state == 0){
                this.tipLabel.string = "结束";
                this.currGuide = guide.getTailPointer();//记录下一个指引
                if(this.currGuide == null)//所有指引完成
                    this.returnStartScene();
            }else if(state == null){//未开启 初始状态
                this.holeMask.active = false;
                this.arrow.active = false;
                var action = cc.sequence(
                    // cc.delayTime(1),
                    // cc.callFunc(function(){
                    //     this.tipLabel.string = "游戏规则很简单";
                    // }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.centerCardNode.setShow(true);
                        this.tipLabel.string = "红牌代表了桃花";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "所有卡牌初始都为1级";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "游戏中收集的桃花越多越好";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.centerCardNode.setShow(false);
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "滑动屏幕";
                        this.cardNodes[1].updateCard(CardType.Money, 1);
                        this.cardNodes[1].setShow(true);
                        this.cardNodes[2].updateCard(CardType.Money, 1);
                        this.cardNodes[2].setShow(true);
                        this.arrow.active = true;
                        this.arrow.setPosition(arrowPos[1]);
                        this.arrow.setRotation(0);
                        this.cardBg_1.active = true;
                        this.cardBg_2.active = true;
                    }, this),
                    cc.callFunc(function(){
                        guide.changeState(7);
                    }, guide),
                );
                this.node.runAction(action);
                this.guideNextIndex = 1;
            }else if(state == 1){
                this.arrow.active = false;
                var action = cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.cardBg_1.active = false;
                        this.cardBg_2.active = false;
                        this.tipLabel.string = "升级！";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "当匹配到相同数目";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "得分随着桃花等级的提高而递增";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "绿牌代表了桃花的收集者";
                        var index = this.cardNodeMap[1][1];
                        this.cardNodes[index].updateCard(CardType.Soldier, 1);
                        this.cardNodes[index].setShow(true);
                        this.arrow.active = true;
                        this.arrow.setPosition(arrowPos[1]);
                        this.arrow.setRotation(0);
                        this.cardBg_1.active = true;
                        this.cardBg_2.active = true;
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "通过移动绿牌来收集桃花";
                    }, this),
                    cc.callFunc(function(){
                        guide.changeState(7);
                    }, guide),
                );
                this.node.runAction(action);
                this.guideNextIndex = 2;
            }else if(state == 2){
                this.arrow.active = false;
                var action = cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.cardBg_1.active = false;
                        this.cardBg_2.active = false;
                        this.tipLabel.string = "等级不够";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "匹配相同数目...";
                        this.cardNodes[3].updateCard(CardType.Soldier, 1);
                        this.cardNodes[3].setShow(true);
                        this.arrow.active = true;
                        this.arrow.setPosition(arrowPos[3]);
                        this.arrow.setRotation(-90);
                        this.cardBg_1.active = true;
                        this.cardBg_2.active = true;
                        this.cardBg_3.active = true;
                    }, this),
                    cc.callFunc(function(){
                        guide.changeState(8);
                    }, guide),
                );
                this.node.runAction(action);
                this.guideNextIndex = 3;
            }else if(state == 3){
                this.arrow.active = false;
                this.cardBg_1.active = false;//特殊处理 去掉滑动
                var action = cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.cardBg_1.active = false;
                        this.cardBg_2.active = false;
                        this.cardBg_3.active = false;
                        this.tipLabel.string = "升级！";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.cardBg_1.active = true;//特殊处理 恢复滑动
                        this.tipLabel.string = "去采集桃花吧";
                        this.arrow.active = true;
                        this.arrow.setPosition(arrowPos[1]);
                        this.arrow.setRotation(0);
                        this.cardBg_1.active = true;
                        this.cardBg_2.active = true;
                    }, this),
                    cc.callFunc(function(){
                        guide.changeState(7);
                    }, guide),
                );
                this.node.runAction(action);
                this.guideNextIndex = 4;
            }else if(state == 4){
                this.arrow.active = false;
                var action = cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.cardBg_1.active = false;
                        this.cardBg_2.active = false;
                        this.tipLabel.string = "做得好！";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "当你收集桃花";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "得分越高";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "就会有等级越高的阻碍物";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "那是橙板";
                        var index = this.cardNodeMap[1][1];
                        this.cardNodes[index].updateCard(CardType.Monster, 3);
                        this.cardNodes[index].setShow(true);
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "来制收集桃花的行动";
                    }, this),
                    // cc.delayTime(1),
                    // cc.callFunc(function(){
                    //     this.tipLabel.string = "匹配相同数目";
                    // }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "匹配相同数目";
                        this.cardNodes[4].updateCard(CardType.Soldier, 2);
                        this.cardNodes[4].setShow(true);
                        this.arrow.active = true;
                        this.arrow.setPosition(arrowPos[4]);
                        this.arrow.setRotation(-90);
                        this.cardBg_1.active = true;
                        this.cardBg_2.active = true;
                        this.cardBg_4.active = true;
                    }, this),
                    cc.callFunc(function(){
                        guide.changeState(9);
                    }, guide),
                );
                this.node.runAction(action);
                this.guideNextIndex = 5;
            }else if(state == 5){
                this.arrow.active = false;
                var action = cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.cardBg_1.active = false;
                        this.cardBg_2.active = false;
                        this.cardBg_4.active = false;
                        this.tipLabel.string = "升级！";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "击破";
                        this.arrow.active = true;
                        this.arrow.setPosition(arrowPos[1]);
                        this.arrow.setRotation(-180);
                        this.cardBg_1.active = true;
                        this.cardBg_2.active = true;
                    }, this),
                    cc.callFunc(function(){
                        guide.changeState(10);
                    }, guide),
                );
                this.node.runAction(action);
                this.guideNextIndex = 6;
            }else if(state == 6){
                this.arrow.active = false;
                var action = cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "耶！";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        this.tipLabel.string = "规则就是这样";
                    }, this),
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        guide.changeState(0);//指引完成 切换状态
                    }, guide),
                );
                this.node.runAction(action);
                this.guideNextIndex = null;
            }else if(state == 7){
                // 1 右滑 2
            }else if(state == 8){
                // 3 上滑 1
            }else if(state == 9){
                // 4 上滑 2
            }else if(state == 10){
                // 2 左滑 1
            }else if(state == 11){
                // 1 右滑 2 失败
                this.finger.active = true;
                this.finger.runAction(cc.sequence(
                    fingerActs[1],
                    cc.callFunc(function(){
                        guide.changeState(7);
                    }, this),
                ));
            }else if(state == 12){
                // 3 上滑 1 失败
                this.finger.active = true;
                this.finger.runAction(cc.sequence(
                    fingerActs[3],
                    cc.callFunc(function(){guide.changeState(8);}, this),
                ));
            }else if(state == 13){
                // 4 上滑 2 失败
                this.finger.active = true;
                this.finger.runAction(cc.sequence(
                    fingerActs[4],
                    cc.callFunc(function(){guide.changeState(9);}, this),
                ));
            }else if(state == 14){
                // 2 左滑 1 失败
                this.finger.active = true;
                this.finger.runAction(cc.sequence(
                    fingerActs[2],
                    cc.callFunc(function(){guide.changeState(10);}, this),
                ));
            }
            // return newState;
        }.bind(this);
        guideHead.setStateLoop(newStateLoop);
        guideHead.startRun();
        this.currGuide = guideHead;//记录当前指引 初始值为第一个指引
    },

    returnStartScene:function(){
        this.gameMgr.returnStartScene();
    },

});
module.exports = GuidePanel;