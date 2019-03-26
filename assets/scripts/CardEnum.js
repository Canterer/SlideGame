const CardType = cc.Enum({
	Money : 1,//金币
    Soldier : 2,//守卫
	Monster : 3,//怪物
});

var CardColors = cc.Enum({
    [CardType.Money] : new cc.Color(225,225,225),
    [CardType.Monster] : new cc.Color(225,225,100),
    [CardType.Soldier] : new cc.Color(225,100,225),
});

module.exports = {
	CardType,
	CardColors
};