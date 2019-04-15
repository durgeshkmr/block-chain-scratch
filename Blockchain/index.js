const Block = require('./block');

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }
    addBlock(data){
        
        const block = Block.mineBlock(this.chain[this.chain.length-1],data);
        this.chain.push(block);

        return block;
    }

     isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            console.log('chain[0]',chain[0]);
            console.log('genesis block',Block.genesis());
            return false;
        }
        for(let i =1;i<chain.length;i++){
            const block = chain[i];
            const lastblock = chain[i-1];
            if(block.lasthash !== lastblock.hash || block.hash !== Block.blockHash(block)){
               // console.log('block',block);    
                console.log('block.lasthash',block.lasthash);
                console.log('lastblock.hash',lastblock.hash);
                console.log('block.hash',block.hash);
                console.log('Block.blockHash',Block.blockHash(block));
                return false;
            }
        }
        return true;
    }
   

    replaceChain(newChain){
        if(newChain.length <= this.chain.length){
            console.log('recieved chain is not longer ');
            console.log(newChain);
            return;
        } else if(!this.isValidChain(newChain)){
            console.log('recievd chain is not valid');
            return;
        }
        console.log('Replacing chain ...');
        this.chain  = newChain;
    }
}

module.exports = Blockchain;