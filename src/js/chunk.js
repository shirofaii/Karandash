var imm = require('immutable');

const bgWall = 0
const bgFloor = 1

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
    function chunkAt(x, y) {
        var xy = new Int32Array(2)
        xy[0] = Math.trunc(x / sideInTiles)
        xy[1] = Math.trunc(y / sideInTiles)
        return this.state.get(xy)
    }
    
    // x, y: canvas coords
    function getTile(x, y) {
        var chunk = this.chunkAt(x, y)
        if(!chunk) return null
        
        x = x % sideInTiles
        y = y % sideInTiles
        return chunk[y*sideInTiles + x]
    }
    
    // x, y: canvas coords
    function setTile(x, y, tile) {
        var chunk = chunkAt(x, y)
        // cx, cy: chunk coords
        var cx = x % sideInTiles
        var cy = y % sideInTiles
        
        // its common to set tile on each mouse event, so avoid unnesessary mutations
        if(!chunk || chunk[cy*sideInTiles + cx] !== tile) {
            // copy chunk binary data, state must be immutable
            var editable = newChunk(chunk)
            editable[cy*sideInTiles + cx] = tile
            setChunk(x, y, editable)
        }
    }
    
    // copy or create byte array which actually 8x8 bitmap (bytemap) of tiles
    function newChunk(from) {
        var to = new Uint8Array(sideInTiles*sideInTiles);
        if(from) { to.set(from) }
        return to
    }
    
    // set changed (or new) chunk into the state
    // x, y: canvas coords
    function setChunk(x, y, chunk) {
        var xy = new Int32Array(2)
        xy[0] = Math.trunc(x / sideInTiles)
        xy[1] = Math.trunc(y / sideInTiles)
        
        var chunk = chunk || tilesArray()
        
        this.state.set(xy, chunk)
    }
}

