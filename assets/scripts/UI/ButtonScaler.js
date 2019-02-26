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

    onLoad:function(){
        var self = this;
        var gameManager = cc.find('GameManager');
        if(gameManager)
            gameManager = gameManager.getComponent('GameManager')

        self.initScale = this.node.scale;
        self.button = self.getComponent(cc.Button);
        self.scaleDownAction = cc.scaleTo(self.transDuration, self.pressedScale);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale);

        function onTouchDown(event){
            this.stopAllActions();
            // if( gameManager ){
                // var audioManager = gameManager.getAudioManager();
                // if(audioManager) audioManager.playSFX("button");

            // }
            this.runAction(self.scaleDownAction);
        }
        function onTouchUp(event){
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }
});
