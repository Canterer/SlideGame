/*
module:AssetsManager
desc:UIAssets管理器
author:Canterer
 */
var AssetsManager = cc.Class({
    extends: cc.Component,
    properties: {
    },
    start () {
        this.assetsMap = new Object();
        this.assetsCountMap = new Object();
    },
    loadAssets:function(path, type, callback)
    {
        var key = path+"."+type;
        if(this.assetsMap.hasOwnProperty()){
            this.assetsCountMap[key] += 1;
            callback(error, this.assetsMap[key]);
        }
        else{
            cc.loader.loadRes(path, type, (error, assets)=>{
                this.assetsMap[key] = assets;
                this.assetsCountMap[key] = 1;
                callback(error, assets);
            });            
        }
    },

    // 一般在场景切换中进行
    releaseAssets:function(path, type){
        var key = path+"."+type;
        this.assetsCountMap[key] -= 1;
        if(this.assetsCountMap[key] == 0){
            delete this.assetsMap[key];
            cc.loader.releaseRes(path, type);
        }
    },

    autoReleaseAll:function(path, type){
        
    }
});

module.exports = AssetsManager;