const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const {INITIAL_BALANCE} = require('../config');
describe('Wallet',()=>{
    let wallet,tp,bc;

    beforeEach(()=>{
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    });

    describe('creating a transaction',()=>{
        let transaction , sendAmount,recipient;

        beforeEach(()=>{
            sendAmount = 60;
            recipient = 'randomAdd';
            transaction = wallet.createTransaction(recipient,sendAmount,bc,tp);
        });
        
        describe('and doing the same transaction',()=>{
            beforeEach(()=>{
                wallet.createTransaction(recipient,sendAmount,bc,tp);

            });

            it('doubles the send Amount substracted from the balance',()=>{
                expect(transaction.outputs.find(out =>out.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount *2);

            });
            it('it clones the sendAMount output for the recipent ',()=>{
                expect(transaction.outputs.filter(out=>out.address === recipient).map(out => out.amount)).toEqual([sendAmount , sendAmount]);
            });
        });   
    });
    describe('calculating a balance', ()=>{
           let addBalance , repeatAdd, senderWallet;
           
           beforeEach(()=>{
               senderWallet = new Wallet();
               addBalance = 100;
               repeatAdd = 3;
                for(let i =0;i<repeatAdd;i++){
                    senderWallet.createTransaction(wallet.publicKey,addBalance,bc,repeatAdd);

                }
                bc.addBlock(tp.transactions);
           });
           it('calculates the balance for blockchain tx. matchig the recipient',()=>{
               expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance *repeatAdd));
           });
           it('calculates the balance for blockchain tx. matchig the sender',()=>{
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance *repeatAdd));
          });

    });
});