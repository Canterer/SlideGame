/*
module:CardManager
desc:卡片管理器
author:Canterer
 */
var CardNode = require("CardNode");

cc.Class({
    extends: cc.Component,

    properties: {
        row: 5,
        col: 5,
        cardNodes:{
            default: [],
            type: CardNode
        },
        cardNodePrefab:{
            default: null,
            type:cc.Prefab
        }
    },

    onLoad:function(){
        // this.cardNodes = [];
        // for (var i = 0; i < this.row; ++i) {
        //     for (var j =  0; j < this.col; ++j) {
        //         // var node = cc.instantiate(this.cardNodePrefab);
        //         this.cardNodes[i*this.col+j] = new CardNode()
        //     }
        //     this.cardNodes[i]
        // }
    }
    start () {

    },
});
