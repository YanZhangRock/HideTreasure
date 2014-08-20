/**
 * Created by Rock on 8/19/14.
 */

var Util = new Object();

Util.grid2World = function( grid ) {
    var x = ( grid.x + 1 ) * Def.GRID_SIZE + Def.ORI_GRID.x;
    var y = ( grid.y + 1 ) * Def.GRID_SIZE + Def.ORI_GRID.y;
    return { x: x, y: y };
};

Util.world2Grid = function( world ) {
    var x = ( world.x - Def.ORI_GRID.x ) / Def.GRID_SIZE - 1;
    var y = ( world.y - Def.ORI_GRID.y ) / Def.GRID_SIZE - 1;
    return { x: x, y: y };
};

Util.loadJsonFile = function( fileName, callBack ) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', fileName, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            var data = JSON.parse( xobj.responseText );
            callBack( data );
        }
    }
    xobj.send(null);
};

Util.getManDist = function ( from, to ) {
    return Math.abs( from.x - to.x ) + Math.abs( from.y - to.y );
}