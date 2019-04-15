const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const P2pserver = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');  
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pserver = new P2pserver(bc,tp);
const miner = new Miner(bc,tp,wallet,p2pserver);
app.use(bodyParser.json());

app.get('/block',(req,res)=>{
    res.json(bc.chain);
});

app.post('/mine',(req, res)=>{
    const block = bc.addBlock(req.body.data);
    console.log(`New block added ${block.toString()}`);
    res.redirect('/block');
    p2pserver.syncChain();
});

app.get('/transactions',(req,res)=>{
    res.json(tp.transactions);
});

app.post('/transact',(req,res)=>{
    const { recipient , amount} = req.body;
    const transaction = wallet.createTransaction(recipient,amount,bc,tp);
    p2pserver.broadcastTransaction(transaction);
    res.redirect('./transactions');
});
app.get('/public-key',(req,res)=>{
  res.json({publickey:wallet.publicKey});
});
app.get('/mine-transaction',(req,res)=>{
    const block = miner.mine();
    console.log(`New Block added :${block.toString()}`);
    res.redirect('/block');
});
app.listen(HTTP_PORT ,()=> console.log(`Listening on port ${HTTP_PORT}`));
p2pserver.listen();