const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');
describe('TransactionPool',()=>{
    let tp,wallet ,bc, transaction;

    beforeEach(()=>{
        tp = new TransactionPool();
        wallet = new Wallet();
        bc = new Blockchain();
       // transaction = Transaction.newTransaction(wallet,'thisisAddress',40);
        //tp.updateOrAddTransaction(transaction);
        transaction = wallet.createTransaction('thisisAddress',35,bc,tp);
    });

    it('adds a transcation to the pool',()=>{
       expect(tp.transactions.find(tp=>tp.id ===transaction.id )).toEqual(transaction);
    });

    it('it updates a tx. in pool',()=>{
       const oldTransaction = JSON.stringify(transaction);
       const newTransaction = transaction.update(wallet,'newAdd',50);
       tp.updateOrAddTransaction(newTransaction);

       expect(JSON.stringify(tp.transactions.find(t=>t.id === newTransaction.id))).not.toEqual(oldTransaction);
    });

    describe('mixing valid and corrupt tx.',()=>{
        let validTransactions;
        beforeEach(()=>{
            validTransactions = [...tp.transactions];
            for(let i =0;i<6;i++){
                wallet = new Wallet();
                transaction = wallet.createTransaction('randadd',34,bc,tp);
                if(i%2==0){
                    transaction.input.amount = 9999999;
                }else{
                    validTransactions.push(transaction);
                }
            }
        });
        it('it shows the diff. btw valid and corrupt tx.',()=>{
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs valid tx.',()=>{
            expect(tp.validTransaction()).toEqual(validTransactions );
        });
    });
});