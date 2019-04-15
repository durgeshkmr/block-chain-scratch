const Transaction = require('./transaction');
const Wallet = require('./index');
const {MINING_REWARD} = require('../config');

describe('Transaction ',()=>{
    let transaction,wallet,recipient , amount;


    beforeEach(()=>{
        wallet = new Wallet();
        amount = 50;
        recipient = 'recipi';
        transaction = Transaction.newTransaction(wallet,recipient,amount);
    });
    it('Outputs the amount minus from wallet bal.',()=>{
        expect(transaction.outputs.find(output=>output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
    });

    it('outputs the amount added to the recipent',()=>{
        expect(transaction.outputs.find( output=>output.address=== recipient).amount).toEqual(amount);
    });
    it('inputs the bal. of the wallet',()=>{
         expect(transaction.input.amount).toEqual(wallet.balance);
    })
    describe('transacting with an amount that exceeds bal',()=>{
        beforeEach(()=>{
            amount = 50000000;
            transaction = Transaction.newTransaction(wallet,recipient,amount);
        });
        it('doest not create the the tx.',()=>{
            expect(transaction).toEqual(undefined);
        });
        
    });
    describe('and updating a tx.',()=>{
        let nextAmount,nextRecipent;
        beforeEach(()=>{
            nextAmount = 30;
            nextRecipent = 'nextAdd355';
            transaction = transaction.update(wallet,nextRecipent,nextAmount);
        });
        it('it substract the next amount from sender output',()=>{
            expect(transaction.outputs.find(output=>output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);

        });

        it('outputs amount for the next recipent',()=>{
            expect(transaction.outputs.find(output=>output.address === nextRecipent).amount).toEqual(nextAmount);
        });
    });
    describe('creating a reward tx.',()=>{
         beforeEach(()=>{
             transaction = Transaction.rewardTransaction(wallet,Wallet.blockchainWallet());
         });

         it(`reward the miner wallet`,()=>{
             expect(transaction.outputs.find(output=>output.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
         });
    });
}); 