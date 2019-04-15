const Block = require('./block');
const {DIFFICULTY} = require('../config');
describe('Block',()=>{

    let data, lastBlock, block;
    beforeEach(()=>{
        data = 'newdata';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock,data);
    });
   it('sets the data match input',()=>{
         expect(block.data).toEqual(data);
   });

it('match the last hash',()=>{
       expect(block.hash).toEqual(lastBlock.hash);
});

it('generates the hash that matches the difficulty',()=>{
    expect(block.hash.substring(0,DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
    console.log(block);
});

it('lowers the difficulty for slowly mined block',()=>{
     expect(Block.adjustDifficulty(block,block.timestamp+360000)).toEqual(block.difficulty-1);
});

it('raises the diffulty for quickly mined block',()=>{
    expect(Block.adjustDifficulty(block,block.timestamp+1)).toEqual(block.difficulty+1);
});
});