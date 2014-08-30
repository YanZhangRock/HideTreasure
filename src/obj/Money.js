/**
 * Created by Rock on 8/21/14.
 */

var Money = Item.extend({
    ctor: function( layer ) {
        this._super( "#money.png", layer );
    },

    onSteal: function( thief ) {
        this.map.grids[this.grid.x][this.grid.y].money = null;
        thief.addScore( 100 );
        this.layer.objBatch.removeChild( this );
    }
})