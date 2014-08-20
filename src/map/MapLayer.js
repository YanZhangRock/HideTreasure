/**
 * Created by Rock on 8/19/14.
 */

var MapLayer = cc.Layer.extend({
    data: null,
    grids: {},

    ctor: function() {
        this._super();
        this.loadMap();
        cc.spriteFrameCache.addSpriteFrames(res.Tile_plist);
    },

    loadMap: function( callBack ) {
        var self = this;
        Util.loadJsonFile( "res/mapCfg/map1.json",
            function( jsonData ){
                if( !callBack ) return;
                self.data = jsonData;
                callBack();
            }
        );
    },

    initMap: function(){
        for( var i=0; i<this.data.width; i++) {
            for( var j=0; j<this.data.height; j++ ) {
                this.grids[i] = this.grids[i] || [];
                this.grids[i][j] = { x:i, y:j };
            }
        }
        for( var i in this.data.grids_data ){
            var d = this.data.grids_data[i];
            this.grids[d.x][d.y].tile = d.tile || "GRASS";
        }
    },

    getTileImg: function( tile ) {
        var ret = "Grass0.png";
        switch ( tile ) {
            case "TREES":
                ret = "Tree0.png";
                break;
        }
        return ret;
    },

    drawMap: function() {
        for( var i=0; i<this.data.width; i++ ) {
            for( var j=0; j<this.data.height; j++) {
                var grid = this.grids[i][j];
                var sprite = new cc.Sprite();
                sprite.initWithSpriteFrameName( this.getTileImg( grid.tile ) );
                grid.sprite = sprite;
                var pos = Util.grid2World( grid );
                sprite.attr({
                    anchorX: 0.5,
                    anchorY: 0.5,
                    x: pos.x,
                    y: pos.y,
                    scale: Def.GRID_SCALE
                });
                this.addChild( sprite, 0 );
            }
        }
    }
});