var assert = require('chai').assert;
var imm = require('immutable');

var ChunkedBitmap = require('../chunk.js')

let state
let bitmap

describe('ChunkedBitmap', function () {
    beforeEach(function() {
        var canvas = {chunks: imm.Map(), defaultBackgroundTile: 0}
        bitmap = new ChunkedBitmap().on(canvas)
    });
    it('get/set', function () {
        assert.equal(bitmap.chunkAt(0, 0), bitmap.defaultChunk)
        var chunk = bitmap.newChunk()
        bitmap.applyChunk(-100, 100, chunk)
        assert.notStrictEqual(bitmap.chunkAt(0, 0), chunk)
        assert.strictEqual(bitmap.chunkAt(-100, 100), chunk)
    });
    it('write tiles', function () {
        assert.equal(bitmap.chunkAt(0, 0), bitmap.defaultChunk)
        for(var i = -10; i < 10; i++ ) {
            for(var j = -10; j < 10; j++ ) {
                bitmap.setTile(i, j, 1)
            }
        }
        for(var i = -10; i < 10; i++ ) {
            for(var j = -10; j < 10; j++ ) {
                assert.equal(bitmap.getTile(i, j), 1)
            }
        }
        for(var i = -10; i < 10; i++ ) {
            for(var j = -10; j < 10; j++ ) {
                bitmap.setTile(i, j, 0)
            }
        }
        for(var i = -10; i < 10; i++ ) {
            for(var j = -10; j < 10; j++ ) {
                assert.equal(bitmap.getTile(i, j), 0)
            }
        }
    });
});
