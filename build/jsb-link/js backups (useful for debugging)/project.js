window.__require = function t(e, c, o) {
function i(s, r) {
if (!c[s]) {
if (!e[s]) {
var n = s.split("/");
n = n[n.length - 1];
if (!e[n]) {
var h = "function" == typeof __require && __require;
if (!r && h) return h(n, !0);
if (a) return a(n, !0);
throw new Error("Cannot find module '" + s + "'");
}
}
var d = c[s] = {
exports: {}
};
e[s][0].call(d.exports, function(t) {
return i(e[s][1][t] || t);
}, d, d.exports, t, e, c, o);
}
return c[s].exports;
}
for (var a = "function" == typeof __require && __require, s = 0; s < o.length; s++) i(o[s]);
return i;
}({
AssetsManager: [ function(t, e, c) {
"use strict";
cc._RF.push(e, "e3d33mssQtLrIqmF2GhV36L", "AssetsManager");
var o = cc.Class({
properties: {},
start: function() {
self.assetsMap = new Object();
self.assetsCountMap = new Object();
},
loadAssets: function(t, e, c) {
var o = t + "." + e;
if (self.assetsMap.hasOwnProperty()) {
self.assetsCountMap[o] += 1;
c(error, self.assetsMap[o]);
} else cc.loader.loadRes(t, e, function(t, e) {
self.assetsMap[o] = e;
self.assetsCountMap[o] = 1;
c(t, e);
});
},
releaseAssets: function(t, e) {
var c = t + "." + e;
self.assetsCountMap[c] -= 1;
if (0 == self.assetsCountMap[c]) {
delete self.assetsMap[c];
cc.loader.releaseRes(t, e);
}
},
autoReleaseAll: function(t, e) {}
});
e.exports = o;
cc._RF.pop();
}, {} ],
AudioManager: [ function(t, e, c) {
"use strict";
cc._RF.push(e, "81d53QlmORLLqbX6Cs0pOxM", "AudioManager");
cc.Class({
extends: cc.Component,
properties: {
audioNames: [ cc.String ],
audioList: [ cc.AudioClip ]
},
start: function() {
self.bgMusicIndex = -1;
self.bgMusicId = null;
},
playMusic: function() {
this.playNextBgMusic();
},
playNextBgMusic: function() {
self.bgMusicIndex += 1;
self.bgMusicIndex %= 4;
cc.loader.loadRes("AudiobgMusic" + self.bgMusicIndex, cc.AudioClip, function(t, e) {
if (t) cc.log(t); else {
self.bgMusicId = cc.audioEngine.playMusic(e, !1);
cc.audioEngine.setFinishCallback(self.bgMusicId, function() {
this.playNextBgMusic();
});
}
});
},
pauseMusic: function() {
cc.audioEngine.pauseMusic();
},
resumeMusic: function() {
cc.audioEngine.resumeMusic();
},
playSFX: function(t) {
var e = this.getSFX(t);
cc.audioEngine.playEffect(e, !1);
},
getSFX: function(t) {
for (var e = this.audioNames.length - 1; e >= 0; e--) if (this.audioNames[e] == t) return this.audioList[e];
}
});
cc._RF.pop();
}, {} ],
ButtonScaler: [ function(t, e, c) {
"use strict";
cc._RF.push(e, "fd81bTqZG5BJJJ0JlSjF1/i", "ButtonScaler");
cc.Class({
extends: cc.Component,
properties: {
pressedScale: 1,
transDuration: 0
},
onLoad: function() {
var t = this, e = cc.find("GameManager");
e && (e = e.getComponent("GameManager"));
t.initScale = this.node.scale;
t.button = t.getComponent(cc.Button);
t.scaleDownAction = cc.scaleTo(t.transDuration, t.pressedScale);
t.scaleUpAction = cc.scaleTo(t.transDuration, t.initScale);
function c(e) {
this.stopAllActions();
this.runAction(t.scaleUpAction);
}
this.node.on("touchstart", function(e) {
this.stopAllActions();
this.runAction(t.scaleDownAction);
}, this.node);
this.node.on("touchend", c, this.node);
this.node.on("touchcancel", c, this.node);
}
});
cc._RF.pop();
}, {} ],
CardEnum: [ function(t, e, c) {
"use strict";
cc._RF.push(e, "5cb7c9OnB9FyId8hps+mcKU", "CardEnum");
var o;
function i(t, e, c) {
e in t ? Object.defineProperty(t, e, {
value: c,
enumerable: !0,
configurable: !0,
writable: !0
}) : t[e] = c;
return t;
}
var a = cc.Enum({
Money: 1,
Soldier: 2,
Monster: 3
}), s = cc.Enum((i(o = {}, a.Money, new cc.Color(225, 225, 225)), i(o, a.Monster, new cc.Color(225, 225, 100)), 
i(o, a.Soldier, new cc.Color(225, 100, 225)), o));
e.exports = {
CardType: a,
CardColors: s
};
cc._RF.pop();
}, {} ],
CardManager: [ function(t, e, c) {
"use strict";
cc._RF.push(e, "3e43caRsz9NIaO2N5Bcc9Xs", "CardManager");
var o = t("CardNode");
t("GameManager");
cc.Class({
extends: cc.Component,
properties: {
row: 5,
col: 5,
gapX: 0,
gapY: 0,
cardSizeX: 0,
cardSizeY: 0,
offsetX: 0,
offsetY: 0,
cardNodePrefab: {
default: null,
type: cc.Prefab
},
cardBgPrefab: {
default: null,
type: cc.Prefab
},
gameOverLayer: cc.Node,
cardContent: cc.Node
},
onLoad: function() {
this.cardNodes = [];
this.cardNodeMap = [];
this.cardRowFlag = [];
this.cardColFlag = [];
this.moveTime = .5;
this.adaptiveLayout();
this.gameOverLayer.active = !1;
for (var t = 0, e = 0, c = cc.size(this.cardSizeX, this.cardSizeY), o = 1; o <= this.row; ++o) {
this.cardNodeMap[o] = [];
cc.log(this.offsetX, this.offsetY);
for (var i = 1; i <= this.col; ++i) {
var a = i * (this.gapX + this.cardSizeX) - this.cardSizeX / 2 - this.gapX + this.offsetX, s = o * (this.gapY + this.cardSizeY) - this.cardSizeY / 2 - this.gapY + this.offsetY, r = cc.v2(a, s);
this.initCardBg(o, i, c, r);
t += .1;
var n = Math.floor(3 * Math.random()) + 1, h = this.createCard(n, 1, cc.v2(a, 2e3));
this.cardNodes[e] = h;
this.cardNodeMap[o][i] = e;
var d = cc.sequence(cc.delayTime(t), cc.moveTo(1, r));
h.runAction(d);
e += 1;
}
}
for (o = 1; o <= this.row; ++o) this.cardRowFlag[o] = this.checkRow(o);
for (i = 1; i <= this.col; ++i) this.cardColFlag[i] = this.checkCol(i);
this.checkGameOver();
this.addEventHandler();
},
start: function() {},
adaptiveLayout: function() {
var t = cc.winSize.width - this.col * (this.cardSizeX + this.gapX) - this.gapX;
this.offsetX = this.offsetX + t / 2;
var e = this.row * (this.cardSizeY + this.gapY) - this.gapY;
this.cardContent.height = e + this.offsetY;
},
initCardBg: function(t, e, c, o) {
var i = this, a = cc.instantiate(this.cardBgPrefab);
a.name = "cardBg_" + t + "_" + e;
a.setContentSize(c);
a.setParent(this.cardContent);
a.setPosition(o);
a.on("touchstart", function(c) {
i.touchRow = t;
i.touchCol = e;
i.startPoint = c.getLocation();
cc.log(i.touchRow, i.touchCol);
});
},
createCard: function(t, e, c) {
var i = cc.instantiate(this.cardNodePrefab);
i.setParent(this.cardContent);
i.width = this.cardSizeX;
i.height = this.cardSizeY;
i.setPosition(c);
var a = new o(i);
a.updateCard(t, e);
return a;
},
addEventHandler: function() {
var t = this;
this.cardContent.on("touchstart", function(t) {
cc.log("touchstart");
}, !0);
this.cardContent.on("touchend", function(e) {
t.onTouchEnd(e);
});
this.cardContent.on("touchcancel", function(e) {
t.onTouchEnd(e);
});
},
onTouchEnd: function(t) {
this.endPoint = t.getLocation();
var e = this.endPoint.sub(this.startPoint);
if (e.mag() > 40) {
if (null == this.touchRow || null == this.touchCol) return;
if (Math.abs(e.x) > Math.abs(e.y)) {
e.x > 0 ? this.touchMoveRight() : this.touchMoveLeft();
this.cardRowFlag[this.touchRow] = this.checkRow(this.touchRow);
} else {
e.y > 0 ? this.touchMoveUp() : this.touchMoveDown();
this.cardColFlag[this.touchCol] = this.checkCol(this.touchCol);
}
}
this.scheduleOnce(function() {
this.checkGameOver();
}, this.moveTime);
this.touchRow = null;
this.touchCol = null;
},
touchMoveRight: function() {
if (!(this.touchCol >= this.col)) {
var t = this.cardNodeMap[this.touchRow][this.touchCol], e = this.cardNodeMap[this.touchRow][this.touchCol + 1], c = this.cardNodes[t], o = this.cardNodes[e];
cc.log(c.type, c.num, o.type, o.num);
if (c.checkMerge(o, !1)) {
c.type == o.type && c.updateCard(c.type, c.num + 1);
var i = -this.gapX - this.cardSizeX / 2 + this.offsetX, a = Math.floor(3 * Math.random()) + 1;
o.updateCard(a, 1);
o.setPosition(cc.v2(i, o.prefab.y));
for (var s = this.touchCol; s >= 1; --s) {
var r = this.cardNodeMap[this.touchRow][s], n = this.cardNodes[r];
this.cardNodeMap[this.touchRow][s + 1] = r;
var h = cc.moveBy(this.moveTime, cc.v2(this.cardSizeX + this.gapX, 0));
n.runAction(h);
}
this.cardNodeMap[this.touchRow][1] = e;
var d = cc.moveBy(this.moveTime, cc.v2(this.cardSizeX + this.gapX, 0));
o.runAction(d);
cc.log(c.type, o.type);
}
}
},
touchMoveLeft: function() {
if (!(this.touchCol < 1)) {
var t = this.cardNodeMap[this.touchRow][this.touchCol], e = this.cardNodeMap[this.touchRow][this.touchCol - 1], c = this.cardNodes[t], o = this.cardNodes[e];
cc.log(c.type, c.num, o.type, o.num);
if (c.checkMerge(o, !1)) {
c.type == o.type && c.updateCard(c.type, c.num + 1);
var i = this.col * (this.gapX + this.cardSizeX) + this.cardSizeX / 2 + this.offsetX, a = Math.floor(3 * Math.random()) + 1;
o.updateCard(a, 1);
o.setPosition(cc.v2(i, o.prefab.y));
for (var s = this.touchCol; s <= this.col; ++s) {
var r = this.cardNodeMap[this.touchRow][s], n = this.cardNodes[r];
this.cardNodeMap[this.touchRow][s - 1] = r;
var h = cc.moveBy(this.moveTime, cc.v2(-this.cardSizeX - this.gapX, 0));
n.runAction(h);
}
this.cardNodeMap[this.touchRow][this.col] = e;
var d = cc.moveBy(this.moveTime, cc.v2(-this.cardSizeX - this.gapX, 0));
o.runAction(d);
cc.log(c.type, o.type);
}
}
},
touchMoveUp: function() {
if (!(this.touchRow >= this.rol)) {
var t = this.cardNodeMap[this.touchRow][this.touchCol], e = this.cardNodeMap[this.touchRow + 1][this.touchCol], c = this.cardNodes[t], o = this.cardNodes[e];
cc.log(c.type, c.num, o.type, o.num);
if (c.checkMerge(o, !1)) {
c.type == o.type && c.updateCard(c.type, c.num + 1);
var i = -this.gapY - this.cardSizeY / 2 + this.offsetY, a = Math.floor(3 * Math.random()) + 1;
o.updateCard(a, 1);
o.setPosition(cc.v2(o.prefab.x, i));
for (var s = this.touchRow; s >= 1; --s) {
var r = this.cardNodeMap[s][this.touchCol], n = this.cardNodes[r];
this.cardNodeMap[s + 1][this.touchCol] = r;
var h = cc.moveBy(this.moveTime, cc.v2(0, this.cardSizeY + this.gapY));
n.runAction(h);
}
this.cardNodeMap[1][this.touchCol] = e;
var d = cc.moveBy(this.moveTime, cc.v2(0, this.cardSizeY + this.gapY));
o.runAction(d);
cc.log(c.type, o.type);
}
}
},
touchMoveDown: function() {
if (!(this.touchRow < 1)) {
var t = this.cardNodeMap[this.touchRow][this.touchCol], e = this.cardNodeMap[this.touchRow - 1][this.touchCol], c = this.cardNodes[t], o = this.cardNodes[e];
cc.log(c.type, c.num, o.type, o.num);
if (c.checkMerge(o, !1)) {
c.type == o.type && c.updateCard(c.type, c.num + 1);
var i = this.row * (this.gapY + this.cardSizeY) + this.cardSizeY / 2 + this.offsetY, a = Math.floor(3 * Math.random()) + 1;
o.updateCard(a, 1);
o.setPosition(cc.v2(o.prefab.x, i));
for (var s = this.touchRow; s <= this.row; ++s) {
var r = this.cardNodeMap[s][this.touchCol], n = this.cardNodes[r];
this.cardNodeMap[s - 1][this.touchCol] = r;
var h = cc.moveBy(this.moveTime, cc.v2(0, -this.cardSizeY - this.gapY));
n.runAction(h);
}
this.cardNodeMap[this.row][this.touchCol] = e;
var d = cc.moveBy(this.moveTime, cc.v2(0, -this.cardSizeY - this.gapY));
o.runAction(d);
cc.log(c.type, o.type);
}
}
},
checkRow: function(t) {
for (var e = this.cardNodeMap[t][1], c = this.cardNodes[e], o = 2; o <= this.col; ++o) {
var i = this.cardNodeMap[t][o], a = this.cardNodes[i];
if (a.checkMerge(c, !0)) return !0;
c = a;
}
if (t > 1) {
var s;
for (o = 1; o <= this.col; ++o) {
r = this.cardNodeMap[t][o];
h = this.cardNodes[r];
r = this.cardNodeMap[t - 1][o];
s = this.cardNodes[r];
if (h.checkMerge(s, !0)) return !1;
}
}
if (t < self.row) {
var r, n, h;
for (o = 1; o <= this.col; ++o) {
r = this.cardNodeMap[t][o];
h = this.cardNodes[r];
r = this.cardNodeMap[t + 1][o];
n = this.cardNodes[r];
if (h.checkMerge(n, !0)) return !1;
}
}
return !1;
},
checkCol: function(t) {
for (var e = this.cardNodeMap[1][t], c = this.cardNodes[e], o = 2; o <= this.row; ++o) {
var i = this.cardNodeMap[o][t], a = this.cardNodes[i];
if (a.checkMerge(c, !0)) return !0;
c = a;
}
if (t > 1) {
var s;
for (o = 1; o <= this.row; ++o) {
r = this.cardNodeMap[o][t];
h = this.cardNodes[r];
r = this.cardNodeMap[o][t - 1];
s = this.cardNodes[r];
if (h.checkMerge(s, !0)) return !0;
}
}
if (t < self.col) {
var r, n, h;
for (o = 1; o <= this.row; ++o) {
r = this.cardNodeMap[o][t];
h = this.cardNodes[r];
r = this.cardNodeMap[o][t + 1];
n = this.cardNodes[r];
if (h.checkMerge(n, !0)) return !0;
}
}
return !1;
},
checkGameOver: function() {
for (var t = 1; t <= this.row; ++t) if (1 == this.cardRowFlag[t]) return;
for (var e = 1; e <= this.col; ++e) if (1 == this.cardColFlag[t]) return;
this.gameOverLayer.active = !0;
},
restartGame: function() {
this.gameOverLayer.active = !1;
for (var t = 0, e = (cc.size(this.cardSizeX, this.cardSizeY), 1); e <= this.row; ++e) for (var c = 1; c <= this.col; ++c) {
var o = c * (this.gapX + this.cardSizeX) - this.cardSizeX / 2 - this.gapX + this.offsetX, i = e * (this.gapY + this.cardSizeY) - this.cardSizeY / 2 - this.gapY + this.offsetY, a = cc.v2(o, i);
t += .1;
var s = Math.floor(3 * Math.random()) + 1, r = this.cardNodeMap[e][c], n = this.cardNodes[r];
n.updateCard(s, 1);
n.setPosition(cc.v2(o, 2e3));
var h = cc.sequence(cc.delayTime(t), cc.moveTo(1, a));
n.runAction(h);
}
for (e = 1; e <= this.row; ++e) this.cardRowFlag[e] = this.checkRow(e);
for (c = 1; c <= this.col; ++c) this.cardColFlag[c] = this.checkCol(c);
this.checkGameOver();
},
ZS: function(t) {
cc.log("#############");
for (var e in t) if ("function" != typeof t[e]) {
cc.log(e);
cc.log(t[e]);
cc.log("--------------------------");
}
}
});
cc._RF.pop();
}, {
CardNode: "CardNode",
GameManager: "GameManager"
} ],
CardNode: [ function(t, e, c) {
"use strict";
cc._RF.push(e, "9d6bfNSFlZNx7D4glQ81sFe", "CardNode");
var o = t("CardEnum").CardType, i = (t("CardEnum").CardColors, t("AssetsManager"), 
cc.Class({
properties: {
prefab: cc.Node,
type: 0,
num: 0,
index: 1
},
ctor: function(t) {
this.prefab = t;
this.sprite = t.getComponent(cc.Sprite);
},
runAction: function(t) {
this.prefab.runAction(t);
},
setPosition: function(t) {
this.prefab.setPosition(t);
},
initCard: function(t, e) {
this.type = t;
this.num = e;
this.updateCard(t, e);
},
updateCard: function(t, e) {
var c = this;
this.type = t;
this.num = e;
cc.loader.loadRes("UI/CardSheet", cc.SpriteAtlas, function(o, i) {
o ? cc.log(o) : c.sprite.spriteFrame = i.getSpriteFrame(t + "_" + e);
});
},
checkMerge: function(t, e) {
return this.type == t.type ? this.num == t.num : this.type == o.Soldier ? this.num >= t.num : !!e && (t.type == o.Soldier && this.num <= t.num);
}
}));
e.exports = i;
cc._RF.pop();
}, {
AssetsManager: "AssetsManager",
CardEnum: "CardEnum"
} ],
GameManager: [ function(t, e, c) {
"use strict";
cc._RF.push(e, "b494aEECoRIarWphe92vd4B", "GameManager");
var o = new (cc.Class({
extends: cc.Component,
properties: {
audioManager: cc.Node
},
onLoad: function() {
this.audioManager = this.audioManager.getComponent("AudioManager");
this.audioManager.playMusic();
cc.director.preloadScene("MainGame", function() {
cc.log("Next scene preloaded");
});
},
start: function() {},
getAudioManager: function() {
return this.audioManager;
},
changeScene: function() {
cc.director.loadScene("MainGame");
},
returnStartScene: function() {
cc.director.loadScene("StartGame");
},
exitScene: function() {}
}))();
e.exports = o;
cc._RF.pop();
}, {} ],
UIManager: [ function(t, e, c) {
"use strict";
cc._RF.push(e, "3becbpM0iBG0roXaDZu/Ktg", "UIManager");
cc.Class({
extends: cc.Component,
properties: {
countLabel: cc.Label,
scoreLabel: cc.Label,
moneyMaxLabel: cc.Label,
monsterMaxLabel: cc.Label,
soldierMaxLabel: cc.Label
},
start: function() {
self.score = 0;
},
updateScore: function(t) {
self.score += t;
self.scoreLabel.String = self.score;
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "CardEnum", "CardNode", "ButtonScaler", "AssetsManager", "AudioManager", "CardManager", "GameManager", "UIManager" ]);