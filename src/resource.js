var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    Tile_png : "res/Tilemap.png",
    Tile_plist : "res/Tilemap.plist",
    Thief_png : "res/thief.png",
    Guard_png : "res/guard.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}