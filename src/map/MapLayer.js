/**
 * Created by Rock on 8/19/14.
 */

var MapLayer = cc.Layer.extend({
    data: null,
    grids: {},
    thief: null,
    guards: [],
    moneys: [],
    traps: [],
    state: null,
    restartMenu: null,
    resultLabel: null,
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
        this.state = MapLayer.STATE.GAME;
        // restart label
        var label = new cc.LabelTTF("重新开始", "Arial", 80);
        var self = this;
        var restart = new cc.MenuItemLabel( label, function(){ self.restartGame(); } );
        var menu = new cc.Menu(restart);
        this.restartMenu = menu;
        this.addChild( menu, MapLayer.Z.UI );
        // result label
        var label = new cc.LabelTTF("你赢了！", "Arial", 80);
        this.resultLabel = label;
        this.addChild( label, MapLayer.Z.UI );
        this.showResult( false );
    },

    showResult: function( isShow ) {
        if( isShow ) {
            this.restartMenu.x = g_size.width * 0.52;
            this.restartMenu.y = g_size.height * 0.4;
            this.resultLabel.x = g_size.width * 0.57;
            this.resultLabel.y = g_size.height * 0.6;
        } else {
            this.restartMenu.x = g_size.width * 100;
            this.restartMenu.y = g_size.height * 100;
            this.resultLabel.x = g_size.width * 100;
            this.resultLabel.y = g_size.height * 100;
        }
    },

    clearObjs: function() {
        for( var i in this.guards ) {
            this.removeChild( this.guards[i] );
        }
        for( var i in this.moneys ) {
            this.removeChild( this.moneys[i] );
        }
        for( var i in this.traps ) {
            this.removeChild( this.traps[i] );
        }
        this.removeChild( this.thief );
        this.guards = [];
        this.moneys = [];
        this.traps = [];
        this.thief = null;
    },

    restartGame: function() {
        this.clearObjs();
        this.initMap();
        this.createObjs();
        this.showResult( false );
        this.state = MapLayer.STATE.GAME;
    },

    endGame: function( isWin ) {
        this.state = MapLayer.STATE.END;
        this.thief.unscheduleUpdate();
        for( var i in this.guards ) {
            this.guards[i].unscheduleUpdate();
        }
        if( isWin ) {
            this.resultLabel.setString( "你赢了！" );
        } else {
            this.resultLabel.setString( "你输了！" );
        }
        this.showResult( true );
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
        this.grids = {}
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
        this.grids.width = this.data.width;
        this.grids.height = this.data.height;
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
        // thief
        this.thief = new Thief( res.Thief_png, this );
        var grid = this.grids[this.data.thiefPos.x][this.data.thiefPos.y];
        this.thief.setCurGrid( grid );
        this.addChild( this.thief, MapLayer.Z.THIEF );
        // guards
        for( var i in this.data.guardPos ) {
            var cfg = this.data.guardPos[i];
            var guard = new Guard( res.Guard_png, this );
            var grid = this.grids[cfg.x][cfg.y];
            guard.setCurGrid( grid );
            this.guards.push( guard );
            guard.thief = this.thief;
            //this.thief.guards.push( guard );
            guard.startPatrol();
            this.addChild( guard, MapLayer.Z.GUARD );
        }
        // moneys
        for( var i in this.data.moneyPos ) {
            var cfg = this.data.moneyPos[i];
            var grid = this.grids[cfg.x][cfg.y];
            var money = new Money( this );
            grid.money = money;
            money.setGrid( grid );
            this.moneys.push( money );
            this.addChild( money, MapLayer.Z.ITEM );
        }
        // traps
        for( var i in this.data.trapPos ) {
            var cfg = this.data.trapPos[i];
            var grid = this.grids[cfg.x][cfg.y];
            var trap = new Trap( this );
            grid.trap = trap;
            trap.setGrid( grid );
            this.traps.push( trap );
            this.addChild( trap, MapLayer.Z.ITEM );
        }
        this.thief.moneys = this.moneys;
        this.thief.guards = this.guards;
        this.thief.traps = this.traps;
    },

    getOffsetGrid: function( grid, offset ) {
        //var isCrossBorder = false;
        var x = grid.x;
        var y = grid.y;
        x = x + offset.x;
        y = y + offset.y;
        if( x > this.data.width-1 ) {
            //isCrossBorder = true;
            x = x - this.data.width;
        } else if( x < 0 ) {
            //isCrossBorder = true
            x = x + this.data.width;
        }
        if( y > this.data.height-1 ) {
            //isCrossBorder = true
            y = y - this.data.height;
        } else if ( y < 0 ) {
            //isCrossBorder = true
            y = y + this.data.height;
        }
        return this.grids[x][y]
    },

    canPass: function( grid ) {
        if( MapLayer.TILE2TYPE[grid.tile] == MapLayer.TILE_TYPE.BLOCK ) {
            return false;
        } else {
            return true;
        }
    },

    isGridVisible: function( g1, g2 ) {
        if( g1.x == g2.x) {
            for( var y = Math.min( g1.y, g2.y ); y <= Math.max( g1.y, g2.y ); y++ ) {
                if( !this.canPass( this.grids[g1.x][y] ) ) {
                    return false;
                }
            }
            return true;
        } else if( g1.y == g2.y ) {
            for( var x = Math.min( g1.x, g2.x ); x <= Math.max( g1.x, g2.x ); x++ ) {
                if( !this.canPass( this.grids[x][g1.y] ) ) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    },

    getRelativeDir: function( oriGrid, tarGrid ) {
        var dir = null;
        var dx = Math.abs( oriGrid.x - tarGrid.x );
        var dy = Math.abs( oriGrid.y - tarGrid.y );
        if( dx > dy ) {
            if( oriGrid.x > tarGrid.x ) {
                dir = Def.LEFT;
            } else {
                dir = Def.RIGHT;
            }
        } else {
            if( oriGrid.y > tarGrid.y ) {
                dir = Def.DOWN;
            } else {
                dir = Def.UP;
            }
        }
        return dir;
    },

    getRelativeDirs: function( oriGrid, tarGrid ) {
        var dirs = [];
        var dx = Math.abs( oriGrid.x - tarGrid.x );
        var dy = Math.abs( oriGrid.y - tarGrid.y );
        if( dx > dy ) {
            if( oriGrid.x > tarGrid.x ) {
                dirs.push( Def.LEFT );
            } else {
                dirs.push( Def.RIGHT );
            }
            if( oriGrid.y > tarGrid.y ) {
                dirs.push( Def.DOWN );
            } else {
                dirs.push( Def.UP );
            }
        } else {
            if( oriGrid.y > tarGrid.y ) {
                dirs.push( Def.DOWN );
            } else {
                dirs.push( Def.UP );
            }
            if( oriGrid.x > tarGrid.x ) {
                dirs.push( Def.LEFT );
            } else {
                dirs.push( Def.RIGHT );
            }
        }
        return dirs;
    },

    onKeyPressed: function( key, event ) {
        if( this.state == MapLayer.STATE.END ) return;
        if( key == cc.KEY.w || key == cc.KEY.up ) {
            this.thief.changeDir( Def.UP );
        } else if( key == cc.KEY.a || key == cc.KEY.left ) {
            this.thief.changeDir( Def.LEFT );
        } else if( key == cc.KEY.d || key == cc.KEY.right ) {
            this.thief.changeDir( Def.RIGHT );
        } else if( key == cc.KEY.s || key == cc.KEY.down ) {
            this.thief.changeDir( Def.DOWN );
        }
    },
    onKeyReleased: function( key, event ) {}
});

MapLayer.Z = {
    TILE: 0,
    ITEM: 1,
    THIEF: 2,
    GUARD: 3,
    UI: 4
};

MapLayer.TILE_TYPE = {
    BLOCK: 1, ROAD: 2
};

MapLayer.TILE2TYPE = {
    TREES: MapLayer.TILE_TYPE.BLOCK,
    GRASS: MapLayer.TILE_TYPE.ROAD
};

MapLayer.STATE = {
    GAME: 0, END: 1
};