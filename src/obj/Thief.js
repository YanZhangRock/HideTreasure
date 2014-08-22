/**
 * Created by Rock on 8/20/14.
 */
var g_test = 0;

var Thief = Mover.extend({
    guards: [],

    ctor: function( img, layer ) {
        this._super(img, layer);
        this.speed = Thief.SPEED;
        this.arriveCallBack = this.onArriveGrid;
    },

    onArriveGrid: function() {
        for( var i in this.guards ) {
            this.guards[i].onThiefArriveGrid();
        }
    }
});

Thief.SPEED = 80;
