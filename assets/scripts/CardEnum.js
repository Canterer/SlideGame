const CardType = cc.Enum({
	Money : 1,//金币
	Monster : 2,//怪物
	Soldier : 3,//守卫
});

// var CardColors = {
//     [CardType.Money] = new cc.Color(225,225,225,100),
//     [CardType.Monster] = new cc.Color(225,225,100,100),
//     [CardType.Soldier] = new cc.Color(225,100,225,100),
// };

module.exports = {
	CardType,
	// CardColors
};