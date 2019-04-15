const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain',()=>{
  let bc, bc2;

  beforeEach(()=>{
      bc = new Blockchain();
      bc2 = new Blockchain();                                         

  });
     
  it('check the first block',()=>{
      expect(bc.chain[0]).toEqual(Block.genesis());
  });
  it('adds a new block',()=>{
      const data = 'newblockdata';
      bc.addBlock(data);
      expect(bc.chain[bc.chain.length-1].data).toEqual(data);
  });

  it('validates a valid chain',()=>{
       bc2.addBlock('2chaindata');
       
       expect(bc.isValidChain(bc2.chain)).toBe(true);
  });
  it('invalidates chain with corrupt genesis data',()=> {
      bc2.chain[0].data = 'bad data';
      expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it('invalidates chain with corrupt block data other than genesis',()=>{
        bc2.addBlock('data for other block');
        bc2.chain[1].data = 'corrupt data';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
  });
it('replaces chain with valid chain',()=>{
    bc2.addBlock('other data');
   bc.replaceChain(bc2.chain);
   expect(bc.chain).toBe(bc2.chain);
});

it('does not replaces with one less chain',()=>{
    bc2.addBlock('yet other');
    bc.replaceChain(bc2.chain);
    expect(bc.chain).not.toBe(bc2.chain);
});
});