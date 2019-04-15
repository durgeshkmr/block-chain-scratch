const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') :[];
const MEESAGE_TYPES = {
    chain : 'CHAIN',
    transaction : 'TRANSACTION',
    clear_transaction: 'CLEAR_TRANSACTION'
};
class P2pserver{
    constructor(blockchain , transactionPool){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];

    }

    listen(){//starting the server
        const server = new Websocket.Server({port: P2P_PORT});
        server.on('connection',socket=>this.connectSocket(socket));
        console.log(`Listening for peer to peer connections on ${P2P_PORT}`);
        this.connectToPeers();
    }
    connectToPeers(){
        peers.forEach(peer =>{
            const socket = new Websocket(peer);
            socket.on('open',()=>this.connectSocket(socket));
        })
    }  
     connectSocket(socket){
         this.sockets.push(socket);
         console.log('Socket connected');
         this.messageHandler(socket);
        this.sendChain(socket);
     }

     messageHandler(socket){
         socket.on('message',message=>{
             const data = JSON.parse(message);
            // console.log('data',data);
            switch (data.type) {
                case MEESAGE_TYPES.chain:
                this.blockchain.replaceChain(data.chain);
                    break;
            
                case MEESAGE_TYPES.transaction: this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;

                case MEESAGE_TYPES.clear_transaction :
                this.transactionPool.clear();
            }
             
         });
     }
     sendChain(socket){
        socket.send(JSON.stringify({
            type : MEESAGE_TYPES.chain,
            chain : this.blockchain.chain}));
     }
     sendTransaction(socket, transaction){
         socket.send(JSON.stringify({
             type : MEESAGE_TYPES.transaction,
             transaction}));
     } 
     syncChain(){
         this.sockets.forEach(socket=>this.sendChain(socket));
     }

     broadcastTransaction(transaction){
         this.sockets.forEach(socket=>this.sendTransaction(socket,transaction));
     }
     broadcastClearTransactions(){
         this.sockets.forEach(socket => socket.send(JSON.stringify({
             type:MEESAGE_TYPES.clear_transaction
         })));
     }
}

module.exports = P2pserver;