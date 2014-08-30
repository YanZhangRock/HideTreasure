var res = {
    Tile_png : "res/map.png",
    Tile_plist : "res/map.plist",
    Objs_png: "res/objs.png",
    Objs_plist: "res/objs.plist"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

initRes = function() {
    cc.spriteFrameCache.addSpriteFrames(res.Tile_plist);
    cc.spriteFrameCache.addSpriteFrames(res.Objs_plist);
}