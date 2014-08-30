/**
 * Created by Rock on 8/29/14.
 */

var ObjIO = cc.Class.extend({
    map: null,
    loadObjCallBack: null,
    saveObjCallBack: null,
    uid: 1,

    ctor: function ( map ) {
        this.map = map;
    },

    getLoadURL: function() {
        return ObjIO.URL+this.map.userid;
    },

    loadObjs: function( callBack ) {
        this.loadObjCallBack = callBack;
        var self = this;
        Util.getHTML( this.getLoadURL(), function(txt){self.onLoadObjs(txt)} );
    },

    onLoadObjs: function( txt ) {
        if( txt == "null" ) return;
        var idx = txt.indexOf("{");
        var pre = txt.substr( 0, idx );
        var content = txt.substr( idx );
        var strs = pre.split( "," );
        this.map.userid = strs[0];
        this.map.owner = strs[1];
        this.map.mapid = strs[2];
        this.map.rawObjsData = JSON.parse( content );
        if( this.loadObjCallBack ) {
            this.loadObjCallBack();
        }
    }

});

ObjIO.URL = "http://minihugscorecenter.appspot.com/user?uid=";