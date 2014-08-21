/**
 * Created by Rock on 8/20/14.
 */
var g_test = 0;

var Thief = Mover.extend({
    ctor: function( img, layer ) {
        this._super(img, layer);
        this.speed = Thief.SPEED;
    }
});

Thief.SPEED = 60;
