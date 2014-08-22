/**
 * Created by Rock on 8/21/14.
 */

var Money = Item.extend({
    layer: null,
    grid: null,

    ctor: function( img, layer ) {
        this._super( img, layer );
    }
})