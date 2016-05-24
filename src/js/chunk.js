var imm = require('immutable');

const tiles = {
    wall: 0,
    floor: 1
}

const sideInTiles = 8
const tileInPixels = 32
const sideInPixels = sideInTiles * tileInPixels


/* chunked canvas layer
    all bitmap canvas splitted to 8x8 chunks, and only required pairs of <coord, chunk> stored in state
    Reasons to use chunks:
    * canvas part of state and must be immutable. Its quite expensive in one-solid-bitmap case to make copy on each change for even pretty small bitmap
    * canvas size limited by max x, y coords in uint32
    * probably more memory efficient
*/

class ChunkedBitmap {
    constructor(chunks) {
        // imm.Map <Int32Array[x, y], Uint8Array[64]>
        this.state = chunks
    }
    
    // x, y: canvas coords
    chunkAt(x, y) {
        return this.state.get(this.encodeXY(x, y))
    }
    
    // x, y: canvas coords
    getTile(x, y) {
        var chunk = this.chunkAt(x, y)
        if(!chunk) return null
        
        var cx = x % sideInTiles
        var cy = y % sideInTiles
        if(cx < 0) cx += sideInTiles
        if(cy < 0) cy += sideInTiles
        
        return chunk[cy*sideInTiles + cx]
    }
    
    // x, y: canvas coords
    setTile(x, y, tile) {
        var chunk = this.chunkAt(x, y)
        // cx, cy: chunk coords
        var cx = x % sideInTiles
        var cy = y % sideInTiles
        
        if(cx < 0) cx += sideInTiles
        if(cy < 0) cy += sideInTiles
        
        // its common to set tile on each mouse event, so avoid unnesessary mutations
        if(!chunk || chunk[cy*sideInTiles + cx] !== tile) {
            // copy chunk binary data, state must be immutable
            var editable = this.newChunk(chunk)
            editable[cy*sideInTiles + cx] = tile
            
            this.setChunk(x, y, editable)
        }
    }
    
    // copy or create byte array which actually 8x8 bitmap (bytemap) of tiles
    newChunk(from) {
        var to = new Uint8Array(sideInTiles*sideInTiles);
        if(from) { to.set(from) }
        return to
    }
    
    // set changed (or new) chunk into the state
    // x, y: canvas coords
    setChunk(x, y, chunk) {
        chunk = chunk || this.newChunk()
        this.state = this.state.set(this.encodeXY(x, y), chunk)
    }
    
    line(x0, y0, x1, y1, tile) {
        var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
        var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
        var err = (dx > dy ? dx : -dy) / 2;

        while (true) {
            this.setTile(x0, y0, tile);
            if (x0 === x1 && y0 === y1) break;
            var e2 = err;
            if (e2 > -dx) { err -= dy; x0 += sx; }
            if (e2 < dy) { err += dx; y0 += sy; }
        }
    }
    
    /*
        Encode x and y into 31 unsigned int
        Used as hash for chunks map
        [<unused bit><x: 15 bits><y: 15 bits>]
        x and y should be in range -16383 16384
    */
    encodeXY(x, y) {
        return ((Math.trunc(x / sideInTiles) + 16383) << 15) + Math.trunc(y / sideInTiles) + 16383
    }
}

module.exports = ChunkedBitmap