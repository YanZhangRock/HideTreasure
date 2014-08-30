/**
 * Created by Rock on 8/29/14.
 */

var MapIO = cc.Class.extend({
    map: null,
    loadMapCallBack: null,
    saveMapCallBack: null,

    ctor: function ( map ) {
        this.map = map;
    },

    getURL: function() {
        return MapIO.URL+this.map.mapid;
    },

    loadMap: function( callBack ) {
        this.loadMapCallBack = callBack;
        var self = this;
        Util.getHTML( this.getURL(), function(txt){self.onLoadMap(txt)} );
    },

    onLoadMap: function( txt ) {
        var rawData = JSON.parse( txt );
        this.map.rawMapData = rawData;
        this.map.unserializeMap()
        if( this.loadMapCallBack ) {
            this.loadMapCallBack();
        }
    }

});

MapIO.URL = "http://minihugscorecenter.appspot.com/map?mid=";