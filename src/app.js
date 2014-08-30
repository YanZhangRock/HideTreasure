var g_size = {};

var MainScene = cc.Scene.extend({
    mainLayer: null,

    onEnter:function () {
        this._super();
        g_size = cc.winSize;
        initRes();
        this.mainLayer = new MainLayer();
        this.addChild( this.mainLayer );
    }

});

