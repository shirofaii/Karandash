var imm = require('immutable');
import {sideInTiles} from './const.js'

/* chunked bitmap
    all bitmap splitted to 8x8 chunks, and only edited chunks saved in state as pairs of <coord, chunk>
    Reasons to use chunks:
    * canvas part of state and must be immutable. Its quite expensive in one-solid-bitmap case to make copy on each change for even pretty small bitmap
    * probably more memory efficient
    * canvas size very big, limited by (sint15 * sideInTiles)
*/

class ChunkedBitmap {
    on(chunks) {
        // imm.Map <Int32Array[x, y], Uint8Array[64]>
        this.state = chunks
        return this
    }
    
    // x, y: canvas coords
    chunkAt(x, y) {
        return this.state.get(ChunkedBitmap.encodeXY(x, y))
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
        this.state = this.state.set(ChunkedBitmap.encodeXY(x, y), chunk)
    }
    
    line(x0, y0, x1, y1, tile) {
        var dx = Math.abs(x1 - x0)
        var dy = -Math.abs(y1 - y0)
        var sx = x0 < x1 ? 1 : -1;
        var sy = y0 < y1 ? 1 : -1;
        var err = dx + dy;

        while (true) {
            if(x0 === x1 && y0 === y1) break;
            var e2 = 2 * err;
            if (e2 > dy) {
                err += dy
                x0 += sx
            } else if (e2 < dx) {
                err += dx
                y0 += sy
            }
            this.setTile(x0, y0, tile);
        }
    }
    
    log() {
        this.state.forEach((c, i) => {
            var p = ChunkedBitmap.decodeXY(i)
            process.stdout.write('[' + p.x + ', ' + p.y + ']:\n')
            for(var cy = 0; cy < sideInTiles; cy++) {
                for(var cx = 0; cx < sideInTiles; cx++) {
                    var tile = c[cy*sideInTiles + cx]
                    switch(tile) {
                        case 0: process.stdout.write("#"); break;
                        case 1: process.stdout.write("."); break;
                        default: process.stdout.write("Ё"); break;
                    }
                }
                process.stdout.write('\n')
            }
        })
    }
    
    /*
        Encode x and y into 31 unsigned int
        Used as hash for chunks map
        [<unused bit><x: 15 bits><y: 15 bits>]
        x and y should be in range -16383 16384
    */
    static encodeXY(x, y) {
        return ((Math.floor(x / sideInTiles) + 16383) << 15) + Math.floor(y / sideInTiles) + 16383
    }
    
    static decodeXY(i) {
        return {x: (i >>> 15) - 16383, y: (i & 0x00007fff) - 16383}
    }
}

module.exports = ChunkedBitmap