/**
 * Created by Rock on 8/21/14.
 */

var Trap = Item.extend({
    thief: null,

    ctor: function( layer ) {
        this._super( res.Trap1_png, layer );
        this.setScale( 0.6 );
    },

    onCatch: function( thief ) {
        this.thief = thief;
        this.setTexture( res.Trap2_png );
        thief.pauseMove();
        this.schedule( this.onPauseEnd, Trap.PAUSE_TIME );
    },

    onPauseEnd: function() {
        this.setTexture( res.Trap1_png );
        this.thief.continueMove();
    }
})

Trap.PAUSE_TIME = 1.2;