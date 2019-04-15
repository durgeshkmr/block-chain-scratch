const ChainUtil = require('../chain-util');  
const Transaction = require('./transaction');
const {INITAL_BALANCE} = require('../config');
const Blockchain = require('../blockchain');

class Wallet{
    constructor(){
       this.balance = INITAL_BALANCE;
       this.keypair = ChainUtil.genKeyPair();
       this.publicKey = this.keypair.getPublic().encode('hex');
    }

    toString(){
        return `Wallet - 
        public key : ${this.publicKey.toString()}
        balance    : ${this.balance}`
    }

    sign(dataHash){
        return this.keypair.sign(dataHash);
    }

    createTransaction(recipent , amount,blockchain,transactionPool)
    {
        this.balance = this.calculateBalance(blockchain);
        if(amount>this.balance){
            console.log(`Amount : ${amount} exceeds current balance ${this.balance}`);
            return;
        }
        let transaction = transactionPool.existingTransaction(this.publicKey);
        if (transaction) {
            transaction.update(this , recipent , amount);
        } else {
            transaction = Transaction.newTransaction(this,recipent,amount);
            transactionPool.updateOrAddTransaction(transaction);

        }

        return transaction;
    }
     calculateBalance(blockchain){
         let balance = this.balance;
         let transactions = [];
         blockchain.chain.forEach(block => block.data.forEach(transaction =>{
         transactions.push(transaction);
         }));
         const walletInputTs = transactions.filter(transaction =>transaction.input.address === this.publicKey);
       let startTime =0;
         if(walletInputTs.length >0){

         const recentInputT = walletInputTs.reduce((prev,current)=>prev.input.timestamp > current.input.timestamp ? prev :current);
        
        balance = recentInputT.outputs.find(output =>output.address == this.publicKey).amount;
        startTime = recentInputT.input.timestamp; 
         }
         transactions.forEach(transaction=>{
            if(transaction.input.timestamp >startTime){
                transaction.outputs.find(output=>{
                    if(output.address === this.publicKey){
                        balance +=output.amount;
                    }
                });
            }
            });
            return balance;  
    } 
    static blockchainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}
module.exports = Wallet;