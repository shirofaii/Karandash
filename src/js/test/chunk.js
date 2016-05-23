var assert = require('chai').assert;
var imm = require('immutable');

var ChunkedBitmap = require('../chunk.js')

let state
let bitmap

describe('chunks', function() {
    beforeEach(function() {
        state = imm.Map()
        bitmap = new ChunkedBitmap(state)
    })

    describe('ChunkedBitmap', function () {
        it('get/set', function () {
            assert.equal(bitmap.chunkAt(0, 0), null)
            var chunk = bitmap.newChunk()
            bitmap.setChunk(-100, 100, chunk)
            assert.notStrictEqual(bitmap.chunkAt(0, 0), chunk)
            assert.strictEqual(bitmap.chunkAt(-100, 100), chunk)
        });
        it('write tiles', function () {
            assert.isNull(bitmap.getTile(0, 0))
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
});
