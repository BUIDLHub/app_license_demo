import Con from './Connector';
import Connector from './Connector';
import { connect } from 'net';

const defaultConfig = {
    id: 1,
    URL: "https://mainnet.infura.io"
}

describe("Connector", ()=>{
    
    it("should connect and get current block", done=>{
        
        let con = new Connector(defaultConfig)
        
        con.open().then(async ()=>{
            try {
                let b = await con.currentBlock();
                console.log("Current block", b.number);
                await con.close();
                done();
            } catch (e) {
                done(e);
            }
        });
    });
    

    
    it("should get block from subscription", done=>{
        let con = new Connector(defaultConfig);
        con.open().then(()=>{
            con.on("block", async block=>{
                console.log("Received block", block.number);

                await con.close();
                done();
            })
            con.startBlockSubscription();
        })
    }).timeout(30000);

    
    it("Should generate accounts with mnemonic", done=>{
        let con = new Connector({
            ...defaultConfig,
            mnemonic: "advance input seat stem winner rally entry angle tobacco creek bitter rough",
            numAddresses: 10
        });
        con.open().then(async ()=>{
            let acts = await con.web3.eth.getAccounts();
            if(acts.length !== 10) {
                return done(new Error("Expected 10 accounts: " + acts.length));
            }
            await con.close();
            done();
        })
    })

    

    it("should get transactions for block", done=>{
        let con = new Connector(defaultConfig);
        con.open().then(async ()=>{
            let b = await con.currentBlock();
            let txns = await con.transactions(b);
            await con.close();
            if(!txns || txns.length === 0) {
                done(new Error("Expected txns for block"));
            } else {
                console.log("Block", b.number,'has',txns.length,"txns");
                done();
            }
        })
    });

    it("should get transaction receipt", done=>{
        let con = new Connector(defaultConfig);
        con.open().then(async ()=>{
            let b = await con.currentBlock();
            let txns = await con.transactions(b);
            await con.close();
            if(txns && txns.length > 0) {
                let r = await con.receipt(txns[0]);
                if(!r || typeof r.status === 'undefined') {
                    done(new Error("Could not get valid receipt for txn: " + txns[0].hash));
                } else {
                    console.log("Receipt for hash", txns[0].hash, r.gasUsed);
                    done();
                }
            } else {
                done();
            }
        })
    });
    
    
});

const sleep = ms => {
    return new Promise(done=>{
        setTimeout(done, ms);
    })
}

