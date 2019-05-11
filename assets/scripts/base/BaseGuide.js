/*
module:BaseGuide
desc:指引管理器
author:Canterer
 */
var BaseGuide = cc.Class({
	// 引导都具有一个状态
	name: "BaseGuide",
	properties: {
		// 引导具备单链表性质，状态完成后自动进行下一引导单元
		_tailPointer: null,//尾指针 指向下一个引导单元
		_state: null,//null代表未开启 0代表引导成功 大于0代表失败原因 小于0代表自定义状态 默认-1代表初始化
		_stateLoop: null// 状态循环函数 具体逻辑 参数 state 返回新状态state
    },

    setStateLoop:function(stateLoop){
    	this._stateLoop = stateLoop;
    },

    setTailPointer:function(nextGuide){
        this._tailPointer = nextGuide;
    },

    getTailPointer:function(){
        return this._tailPointer;
    },

	// 通用状态处理函数
    stateLoop:function(){
    	var newState = this._stateLoop(this);// 传递自身引用
    	if(newState == 0){
    		//引导完成
    		if(this._tailPointer != null){
    			this._tailPointer.stateLoop();
    		}
    	}
    	// if(newState != this._state){
    	// 	this.changeState(newState);
    	// }
    },

    changeState:function(state){
        this._state = state;
        this.stateLoop();
    },

    getState:function(){
        return this._state;
    },

    startRun:function(){
        this.stateLoop();
    },
});

module.exports = BaseGuide;