/**
 * Created by Rock on 8/19/14.
 */

var MapLayer = cc.Layer.extend({
    data: null,
    grids: {},
    thief: null,
    guard: null,
    mapName: "res/mapCfg/map2.json",

    ctor: function() {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.Tile_plist);
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(key,event){self.onKeyPressed(key,event);},
            onKeyReleased: function (key,event){self.onKeyReleased(key,event);}
        }, this);
    },

    loadMap: function( callBack ) {
        var self = this;
        Util.loadJsonFile( this.mapName,
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
        for( var i in this.data.gridsData ){
            var d = this.data.gridsData[i];
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
                this.addChild( sprite, MapLayer.Z.TILE );
            }
        }
    },

    createObjs: function() {
        this.thief = new Thief( res.Thief_png, this );
        var grid = this.grids[this.data.thiefPos.x][this.data.thiefPos.y];
        this.thief.setCurGrid( grid );
        this.thief.updateNextGrid();
        this.addChild( this.thief, MapLayer.Z.THIEF );
        this.thief.startMove();
    },

    getOffsetGrid: function( grid, offset ) {
        //var isCrossBorder = false;
        var x = grid.x;
        var y = grid.y;
        x = x + offset.x;
        y = y + offset.y;
        if( x > this.data.width ) {
            //isCrossBorder = true;
            x = x - this.data.width;
        } else if( x < 1 ) {
            //isCrossBorder = true
            x = x + this.data.width;
        }
        if( y > this.data.height ) {
            //isCrossBorder = true
            y = y - this.data.height;
        } else if ( y < 1 ) {
            //isCrossBorder = true
            y = y + this.data.height;
        }
        return this.grids[x][y]
    },

    onKeyPressed: function( key, event ) {
        if( key == cc.KEY.w || key == cc.KEY.up ) {
            this.thief.storeNextDir( Def.UP );
        } else if( key == cc.KEY.a || key == cc.KEY.left ) {
            this.thief.storeNextDir( Def.LEFT );
        } else if( key == cc.KEY.d || key == cc.KEY.right ) {
            this.thief.storeNextDir( Def.RIGHT );
        } else if( key == cc.KEY.s || key == cc.KEY.down ) {
            this.thief.storeNextDir( Def.DOWN );
        }
    },
    onKeyReleased: function( key, event ) {}
});

MapLayer.Z = {
    TILE: 0,
    THIEF: 1,
    GUARD: 2
};