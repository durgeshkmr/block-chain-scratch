const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');
class Miner{
    constructor(blockchain,transactionPool,wallet,p2pserver){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pserver = p2pserver;
    }

    mine(){
        const validTransaction = this.transactionPool.validTransaction();
       validTransaction.push(Transaction.rewardTransaction(this.wallet,Wallet.blockchainWallet()));

        //include a reward for the miner
        // create a block consisting a valid tx.
        const block = this.blockchain.addBlock(validTransaction);
        // sync. chains in p2pserver
        this.p2pserver.syncChain();
        //cleaer the tx. pool local this miner
        this.transactionPool.clear();
        // boradcast to every miner to clear their tx. pool
        this.p2pserver.broadcastClearTransactions();

        return block;
    }

}

module.exports = Miner;