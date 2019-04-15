const Chainutil = require('../chain-util');
const SHA256 = require('crypto-js/sha256');
const {DIFFICULTY ,MINE_RATE} = require('../config');
class Block{
    constructor(timestamp , lasthash , hash , data , nonce, difficulty){
        this.timestamp = timestamp;
        this.lasthash = lasthash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }
    toString() {
        return `Block -
        Timestamp: ${this.timestamp}
        Last Hash: ${this.lasthash.substring(0,10)}
        Hash     : ${this.hash.substring(0,10)}
        Data     : ${this.data}
        NONCE    : ${this.nonce}
        DIFFICULTY: ${this.difficulty}
        `;
    }
    static genesis(){
        return new this('genesis timestamp','------','behjdfe234',[],0,DIFFICULTY);
    }

    static mineBlock(lastBlock,data){ 
        
        const lastHash = lastBlock.hash;
        let {difficulty} = lastBlock;
        let hash,timestamp;
        let nonce=0;
          do{
              nonce++;
              timestamp = Date.now();
              difficulty = Block.adjustDifficulty(lastBlock,timestamp);
              hash = Block.hash(timestamp,lastHash,data,nonce,difficulty);
          }while( hash.substring(0,difficulty) !== '0'.repeat(difficulty));

        return new this(timestamp,lastHash, hash, data,nonce,difficulty);

    }
    static hash(timestamp, lasthash , data , nonce , difficulty){
        return Chainutil.hash(`${timestamp}${lasthash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block){
        const {timestamp , lasthash , data ,nonce , difficulty} = block;
       // console.log('block',block.lasthash);
       return Block.hash(timestamp , lasthash , data ,nonce , difficulty);
    }
    static adjustDifficulty(lastBlock , currentTime){
        let {difficulty } = lastBlock;
        difficulty = lastBlock.timestamp +MINE_RATE > currentTime ? difficulty +1 : difficulty -1;
        return difficulty;
    }

}
module.exports = Block;