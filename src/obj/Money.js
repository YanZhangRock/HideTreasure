/**
 * Created by Rock on 8/21/14.
 */

var Money = Item.extend({
    ctor: function( layer ) {
        this._super( res.Money_png, layer );
    },

    onSteal: function( thief ) {
        this.layer.grids[this.grid.x][this.grid.y].money = null;
        this.layer.removeChild( this );
    }
})