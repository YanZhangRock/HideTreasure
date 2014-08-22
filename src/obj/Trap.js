/**
 * Created by Rock on 8/21/14.
 */

var Trap = Item.extend({
    thief: null,

    ctor: function( layer ) {
        this._super( res.Trap_png, layer );
    },

    onCatch: function( thief ) {
        this.thief = thief;
        this.setTexture( res.Trap2_png );
        thief.pauseMove();
        this.schedule( this.onPauseEnd, Trap.PAUSE_TIME );
    },

    onPauseEnd: function() {
        this.setTexture( res.Trap_png );
        this.unschedule( this.onPauseEnd );
        this.thief.continueMove();
    }
})

Trap.PAUSE_TIME = 1.2;