/**
 * Created by Rock on 8/20/14.
 */

var Guard = Mover.extend({
    aiState: null,

    ctor: function( img, layer ) {
        this._super( img, layer );
        this.speed = Guard.PATROL_SPEED;
        this.aiState = Guard.AI_STATE.PATROL;
        this.arriveCallBack = this.onArriveGrid;
        this.updateCallBack = this.updateCallBack;
    },

    updateCallBack: function( dt ) {
        switch ( this.aiState ) {
            case Guard.AI_STATE.PATROL:
                this.processPatrol();
                break;
        }
    },

    onArriveGrid: function() {
        switch ( this.aiState ) {
            case Guard.AI_STATE.PATROL:
                this.onArriveGridPatrol();
                break;
        }
    },

    processPatrol: function() {

    },

    startPatrol: function() {
        this.aiState = Guard.AI_STATE.PATROL;
        var dir = this.getRandMovableDir( this.curGrid );
        if( dir == null ) return;
        this.curDir = dir;
        this.nextDir = dir;
        this.updateNextGrid();
        this.updateSpeed();
        this.startMove();
    },

    onArriveGridPatrol: function() {
        if( Util.getManDist( this.curGrid, this.oriGrid ) >= Guard.PATROL_DIST
            || this.state == Mover.STATE.IDLE ) {
            this.curDir = this.getOppositeDir( this.curDir );
            this.nextDir = this.curDir;
            this.updateSpeed();
            this.startMove();
        } else if( this.curGrid == this.oriGrid ) {
            this.startPatrol();
        }
    },

    getRandMovableDir: function( grid ) {
        var dirs = [ Def.UP, Def.DOWN, Def.LEFT, Def.RIGHT ];
        var movableDirs = [];
        for( var i in dirs ) {
            if( this.canChangeDir( grid, dirs[i] ) ) {
                movableDirs.push( dirs[i] );
            }
        }
        if( movableDirs.length <= 0 ) return null;
        var idx = Math.floor( Math.random() * movableDirs.length );
        return movableDirs[idx];
    },

    isCrossRoad: function( grid, dir ) {
        var newDirs = this.getCrossDirs( dir );
        if( this.canChangeDir( grid, newDirs[0] ) ||
            this.canChangeDir( grid, newDirs[1] ) ) {
            return true;
        }
        return false;
    }

});

Guard.PATROL_SPEED = 50;
Guard.CHASE_SPEED = 70;
Guard.PATROL_DIST = 3;
Guard.AI_STATE = {
    PATROL: 0, CHASE: 1, RETURN: 2
};