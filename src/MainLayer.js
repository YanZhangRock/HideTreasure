/**
 * Created by Rock on 8/29/14.
 */

var MainLayer = cc.Layer.extend({
    map: null,
    mapIO: null,
    objIO: null,
    thief: null,
    guards: [],
    moneys: [],
    traps: [],
    golds: [],
    state: null,
    restartMenu: null,
    resultLabel: null,
    scoreLabel: null,
    percentLabel: null,
    timerLabel: null,
    touchBaganLoc: null,
    mapBatch: null,
    objBatch: null,
    maxMoney: 0,
    restTime: 0,

    ctor: function() {
        this._super();
        this.state = MainLayer.STATE.GAME;
        this._initMapData();
        this._initObjIO();
    },

    onLoadObjsData: function() {
        this._initMapIO();
    },

    onLoadMapdata: function() {
        this.map.unserializeObjs();
        this._initLabels();
        this._registerInputs();
        this.startGame();
    },

    _initMapData: function() {
        this.map = new MapData();
    },

    _initMapIO: function() {
        var self = this;
        this.mapIO = new MapIO( this.map );
        this.mapIO.loadMap( function(){self.onLoadMapdata()} );
    },

    _initObjIO: function() {
        var self = this;
        this.objIO = new ObjIO( this.map );
        this.objIO.loadObjs( function(){self.onLoadObjsData()} );
    },

    _registerInputs: function() {
        var self = this;
        // keyboard
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(key,event){self.onKeyPressed(key,event);},
            //onKeyReleased: function (key,event){self.onKeyReleased(key,event);}
        }, this);
        // touch
        cc.eventManager.addListener({
            prevTouchId: -1,
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan:function (touches, event) {
                var touch = touches[0];
                self.touchBeganLoc = touch.getLocation();
            },
            onTouchesEnded:function (touches, event) {
                var touch = touches[0];
                var l1 = self.touchBeganLoc;
                var l2 = touch.getLocation();
                var dx = l2.x - l1.x;
                var dy = l2.y - l1.y;
                if( Math.abs(dy) < MainLayer.SWIPE_DIST &&
                    Math.abs(dx) < MainLayer.SWIPE_DIST ) return;
                var dir = Def.UP;
                if( Math.abs(dy) > Math.abs(dx) ) {
                    if( dy > 0 ) {
                        dir = Def.UP;
                    } else {
                        dir = Def.DOWN;
                    }
                } else {
                    if( dx > 0 ) {
                        dir = Def.RIGHT;
                    } else {
                        dir = Def.LEFT;
                    }
                }
                //event.getCurrentTarget().onSwipe( dir );
                self.onSwipe( dir );
            }
        }, this);
    },

    _initLabels: function() {
        // score label
        var label = new cc.LabelTTF("得分：", "Arial", 40);
        this.scoreLabel = label;
        label.x = g_size.width * 0.2;
        label.y = g_size.height * 0.94;
        this.addChild( label, MainLayer.Z.UI );
        // timer label
        var label = new cc.LabelTTF("剩余时间：", "Arial", 40);
        this.timerLabel = label;
        label.x = g_size.width * 0.5;
        label.y = g_size.height * 0.94;
        this.addChild( label, MainLayer.Z.UI );
        // restart label
        var label = new cc.LabelTTF("重新开始", "Arial", 80);
        var self = this;
        var restart = new cc.MenuItemLabel( label, function(){ self.restartGame(); } );
        var menu = new cc.Menu(restart);
        this.restartMenu = menu;
        this.addChild( menu, MainLayer.Z.UI );
        // result label
        var label = new cc.LabelTTF("你赢了！", "Arial", 60);
        this.resultLabel = label;
        this.addChild( label, MainLayer.Z.UI );
        // percent label
        var label = new cc.LabelTTF("", "Arial", 60);
        this.percentLabel = label;
        this.addChild( label, MainLayer.Z.UI );
        this.showResult( false );
    },

    showResult: function( isShow ) {
        if( isShow ) {
            this.restartMenu.x = g_size.width * 0.52;
            this.restartMenu.y = g_size.height * 0.4;
            this.resultLabel.x = g_size.width * 0.54;
            this.resultLabel.y = g_size.height * 0.7;
            this.percentLabel.x = g_size.width * 0.50;
            this.percentLabel.y = g_size.height * 0.56;
        } else {
            this.restartMenu.x = g_size.width * 100;
            this.restartMenu.y = g_size.height * 100;
            this.resultLabel.x = g_size.width * 100;
            this.resultLabel.y = g_size.height * 100;
            this.percentLabel.x = g_size.width * 100;
            this.percentLabel.y = g_size.height * 100;
        }
    },

    clearObjs: function() {
        var batch = this.objBatch;
        batch.removeAllChildren();
        this.guards = [];
        this.moneys = [];
        this.traps = [];
        this.thief = null;
    },

    startGame: function() {
        //this.loadMap();
        //this.initMap();
        this.drawMap();
        this.createGolds();
        this.createObjs();
        this.setRestTime( MainLayer.TIMEUP );
        this.schedule( this.checkTimeup, MainLayer.TIMEUP_INTERVAL );
        this.state = MainLayer.STATE.GAME;
    },

    restartGame: function() {
        this.clearObjs();
        this.map.unserializeMap();
        this.map.unserializeObjs();
        this.createGolds();
        this.createObjs();
        this.showResult( false );
        this.percentLabel.setString("");
        this.setRestTime( MainLayer.TIMEUP );
        this.schedule( this.checkTimeup, MainLayer.TIMEUP_INTERVAL );
        this.state = MainLayer.STATE.GAME;
    },

    endGame: function( isWin ) {
        this.state = MainLayer.STATE.END;
        this.thief.unscheduleUpdate();
        this.unschedule( this.checkTimeup );
        for( var i in this.guards ) {
            this.guards[i].unscheduleUpdate();
        }
        if( isWin ) {
            this.resultLabel.setString( "你成功偷走了"+this.map.owner+"的钱钱！" );
        } else {
            this.resultLabel.setString( "你被"+this.map.owner+"无情的踩死了T_T" );
        }
        var self = this;
        Util.getPercent( this.thief.score, function(percent){self.onGetPercent(percent)} );
        this.showResult( true );
    },

    onGetPercent: function( percent ) {
        if( this.state != MainLayer.STATE.END ) return;
        var str = "得分："+this.thief.score+"\n" + "击败了全球%"+percent+"的玩家!";
        this.percentLabel.setString(str);
    },

    setRestTime: function( time ) {
        this.restTime = time;
        this.timerLabel.setString( "剩余时间："+this.restTime );
    },

    checkTimeup: function() {
        this.restTime -= MainLayer.TIMEUP_INTERVAL;
        this.setRestTime( this.restTime );
        if( this.restTime <= 0 ) {
            this.endGame( false );
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
        var mapImg = cc.textureCache.addImage(res.Tile_png);
        var batchNode = new cc.SpriteBatchNode(mapImg, 200);
        this.mapBatch = batchNode;
        this.addChild( batchNode, MainLayer.Z.TILE );
        for( var i=0; i<this.map.width; i++ ) {
            for( var j=0; j<this.map.height; j++) {
                var grid = this.map.grids[i][j];
                var sprite = new cc.Sprite( "#"+this.getTileImg( grid.tile ) );
                grid.sprite = sprite;
                var pos = Util.grid2World( grid );
                sprite.attr({
                    anchorX: 0.5,
                    anchorY: 0.5,
                    x: pos.x,
                    y: pos.y,
                    scale: Def.GRID_SCALE
                });
                batchNode.addChild( sprite );
            }
        }
    },

    createGolds: function() {
        for( var i in this.golds ) {
            this.mapBatch.removeChild( this.golds[i] );
        }
        this.golds = [];
        var batch = this.mapBatch;
        for( var i=0; i<this.map.width; i++ ) {
            for( var j=0; j<this.map.height; j++) {
                var grid = this.map.grids[i][j];
                var pos = Util.grid2World( grid );
                if( grid.tile == "GRASS" && !grid.money && !grid.thief ) {
                    var gold = new Gold( this );
                    gold.setPosition(pos);
                    gold.grid = grid;
                    grid.gold = gold;
                    this.golds.push( gold );
                    batch.addChild( gold );
                }
            }
        }
    },

    createObjs: function() {
        var objImg = cc.textureCache.addImage( res.Objs_png );
        var batch = new cc.SpriteBatchNode( objImg );
        this.objBatch = batch;
        this.addChild( batch, MainLayer.Z.OBJ );
        var map = this.map;
        for( var i=0; i<map.width; i++ ) {
            for (var j = 0; j < map.height; j++) {
                var grid = map.grids[i][j];
                // thief
                if (grid.thief) {
                    this.thief = new Thief(this);
                    this.thief.setCurGrid(grid);
                    grid.thief = this.thief;
                    batch.addChild(this.thief);
                }
                // guards
                if (grid.guard) {
                    var guard = new Guard(this);
                    guard.setCurGrid(grid);
                    this.guards.push(guard);
                    grid.guard = guard;
                    batch.addChild(guard);
                }
                // money
                if (grid.money) {
                    var money = new Money(this);
                    grid.money = money;
                    money.setGrid(grid);
                    this.moneys.push(money);
                    batch.addChild(money);
                    this.maxMoney++;
                }
                // trap
                if (grid.trap) {
                    var trap = new Trap( this );
                    grid.trap = trap;
                    trap.setGrid( grid );
                    this.traps.push( trap );
                    batch.addChild( trap );
                }
            }
        }
        for( var i in this.guards ) {
            this.guards[i].thief = this.thief;
            this.guards[i].startPatrol();
        }
        this.thief.moneys = this.moneys;
        this.thief.guards = this.guards;
        this.thief.traps = this.traps;
    },

    getOffsetGrid: function( grid, offset ) {
        var x = grid.x;
        var y = grid.y;
        x = x + offset.x;
        y = y + offset.y;
        if( x > this.map.width-1 ) {
            x = x - this.map.width;
        } else if( x < 0 ) {
            x = x + this.map.width;
        }
        if( y > this.map.height-1 ) {
            y = y - this.map.height;
        } else if ( y < 0 ) {
            y = y + this.map.height;
        }
        return this.map.grids[x][y]
    },

    canPass: function( grid ) {
        if( MainLayer.TILE2TYPE[grid.tile] == MainLayer.TILE_TYPE.BLOCK ) {
            return false;
        } else {
            return true;
        }
    },

    isGridVisible: function( g1, g2 ) {
        if( g1.x == g2.x) {
            for( var y = Math.min( g1.y, g2.y ); y <= Math.max( g1.y, g2.y ); y++ ) {
                if( !this.canPass( this.map.grids[g1.x][y] ) ) {
                    return false;
                }
            }
            return true;
        } else if( g1.y == g2.y ) {
            for( var x = Math.min( g1.x, g2.x ); x <= Math.max( g1.x, g2.x ); x++ ) {
                if( !this.canPass( this.map.grids[x][g1.y] ) ) {
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
        if( this.state == MainLayer.STATE.END ) return;
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

    onSwipe: function( dir ) {
        if( this.state == MainLayer.STATE.END ) return;
        this.thief.changeDir( dir );
    }
});

MainLayer.Z = {
    TILE: 0,
    ITEM: 1,
    OBJ: 2,
    UI: 3
};

MainLayer.TILE_TYPE = {
    BLOCK: 1, ROAD: 2
};

MainLayer.TILE2TYPE = {
    "TREES": MainLayer.TILE_TYPE.BLOCK,
    "GRASS": MainLayer.TILE_TYPE.ROAD
};

MainLayer.STATE = {
    GAME: 0, END: 1
};

MainLayer.TIMEUP = 60;
MainLayer.TIMEUP_INTERVAL = 1;
MainLayer.SWIPE_DIST = 10;