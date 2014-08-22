/**
 * Created by Rock on 8/22/14.
 */

var Gold = cc.Sprite.extend({
    layer: null,
    grid: null,

    ctor: function ( layer ) {
        this._super();
        this.layer = layer;
        this.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: 0,
            y: 0,
            scale: 0.5
        });
    },

    onPicked: function( thief ) {
        thief.addScore( 10 );
        this.grid.gold = null,
        this.layer.goldBatch.removeChild( this );
    }
});