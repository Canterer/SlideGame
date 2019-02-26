(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UI/ButtonScaler.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fd81bTqZG5BJJJ0JlSjF1/i', 'ButtonScaler', __filename);
// scripts/UI/ButtonScaler.js

'use strict';

/*
module:ButtonScaler
desc:按钮缩放脚步  用于统一控制按钮的缩放及音效等
author:Canterer
 */
cc.Class({
    extends: cc.Component,

    properties: {
        pressedScale: 1,
        transDuration: 0
    },

    onLoad: function onLoad() {
        var self = this;
        var gameManager = cc.find('GameManager');
        if (gameManager) gameManager = gameManager.getComponent('GameManager');

        self.initScale = this.node.scale;
        self.button = self.getComponent(cc.Button);
        self.scaleDownAction = cc.scaleTo(self.transDuration, self.pressedScale);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale);

        function onTouchDown(event) {
            this.stopAllActions();
            // if( gameManager ){
            // var audioManager = gameManager.getAudioManager();
            // if(audioManager) audioManager.playSFX("button");

            // }
            this.runAction(self.scaleDownAction);
        }
        function onTouchUp(event) {
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=ButtonScaler.js.map
        