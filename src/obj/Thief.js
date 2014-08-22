/**
 * Created by Rock on 8/20/14.
 */
var g_test = 0;

var Thief = Mover.extend({
    guards: [],
    moneys: [],
    traps: [],
    moneyNum: 0,

    ctor: function( img, layer ) {
        this._super(img, layer);
        this.speed = Thief.SPEED;
        this.arriveCallBack = this.onArriveGrid;
        this.updateCallBack = this.onUpdate;
    },

    onUpdate: function( dt ) {
        this.processCollide();
    },

    onArriveGrid: function() {
        for( var i in this.guards ) {
            this.guards[i].onThiefArriveGrid();
        }
    },

    processCollide: function() {
        for( var i in this.moneys ) {
            var money = this.moneys[i];
            if( this.isCollide( money ) ) {
                this.onGetMoney( money );
            }
        }
    },

    isCollide: function( obj ) {
        var pos = this.getPosition();
        var ax = pos.x, ay = pos.y, bx = obj.x, by = obj.y;
        if (Math.abs(ax - bx) > Def.GRID_SIZE || Math.abs(ay - by) > Def.GRID_SIZE) {
            return false;
        }
        var aRect = this.collideRect(ax, ay);
        var bRect = obj.collideRect(bx, by);
        return cc.rectIntersectsRect(aRect, bRect);
    },

    onGetMoney: function( money ) {
        this.moneyNum++;
        this.grids[money.grid.x][money.grid.y].money = null;
        Util.arrayRemove( this.moneys, money );
        this.layer.removeChild( money );
    }
});

Thief.SPEED = 80;
