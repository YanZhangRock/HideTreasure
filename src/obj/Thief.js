/**
 * Created by Rock on 8/20/14.
 */
var g_test = 0;

var Thief = Mover.extend({
    guards: [],
    moneys: [],
    traps: [],
    moneyNum: 0,
    score: 0,

    ctor: function( img, layer ) {
        this._super(img, layer);
        this.speed = Thief.SPEED;
        this.arriveCallBack = this.onArriveGrid;
        this.updateCallBack = this.onUpdate;
        this.addScore( -this.score );
    },

    onUpdate: function( dt ) {
        this.processCollide();
    },

    onArriveGrid: function() {
        for( var i in this.guards ) {
            this.guards[i].onThiefArriveGrid();
        }
        if( this.curGrid.trap ) {
            this.curGrid.trap.onCatch( this );
        }
        if( this.curGrid.gold ) {
            this.curGrid.gold.onPicked( this );
        }
    },

    processCollide: function() {
        for( var i in this.moneys ) {
            var money = this.moneys[i];
            if( this.isCollide( money ) ) {
                money.onSteal( this );
                this.onGetMoney( money );
            }
        }
        for( var i in this.guards ) {
            var guard = this.guards[i];
            if( this.isCollide( guard ) ) {
                this.layer.endGame( false );
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
        Util.arrayRemove( this.moneys, money );
        if( this.moneyNum >= Thief.MONEY_MAX ) {
            this.layer.endGame( true );
        }
    },

    addScore: function( score ) {
        this.score += score;
        this.layer.scoreLabel.setString( "得分：" + this.score );
    }
});

Thief.SPEED = 80;
Thief.MONEY_MAX = 3;
