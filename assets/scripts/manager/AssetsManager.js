/*
module:AssetsManager
desc:UIAssets管理器
author:Canterer
 */
var AssetsManager = cc.Class({
    properties: {
    },
    start () {
        self.assetsMap = new Object();
        self.assetsCountMap = new Object();
    },
    loadAssets:function(path, type, callback)
    {
        var key = path+"."+type;
        if(self.assetsMap.hasOwnProperty()){
            self.assetsCountMap[key] += 1;
            callback(error, self.assetsMap[key]);
        }
        else{
            cc.loader.loadRes(path, type, (error, assets)=>{
                self.assetsMap[key] = assets;
                self.assetsCountMap[key] = 1;
                callback(error, assets);
            });            
        }
    },

    // 一般在场景切换中进行
    releaseAssets:function(path, type){
        var key = path+"."+type;
        self.assetsCountMap[key] -= 1;
        if(self.assetsCountMap[key] == 0){
            delete self.assetsMap[key];
            cc.loader.releaseRes(path, type);
        }
    },

    autoReleaseAll:function(path, type){

    }
});

module.exports = AssetsManager;