/**
 * Created by Rock on 8/19/14.
 */

var Util = new Object();

Util.grid2World = function( grid ) {
    var x = ( grid.x + 1 ) * Def.GRID_SIZE + Def.ORI_GRID.x;
    var y = ( grid.y + 1 ) * Def.GRID_SIZE + Def.ORI_GRID.y;
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
