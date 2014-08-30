var g_size = {};

var MainScene = cc.Scene.extend({
    mainLayer: null,

//    onLoadMapFinish: function() {
//        this.MainLayer.startGame();
//    },

    onEnter:function () {
        this._super();
        g_size = cc.winSize;
        initRes();
        this.mainLayer = new MainLayer();
        this.addChild( this.mainLayer );
//        var self = this;
//        this.MainLayer.loadMap( function() { self.onLoadMapFinish(); } );
        this.mainLayer.startGame();
    }

});

