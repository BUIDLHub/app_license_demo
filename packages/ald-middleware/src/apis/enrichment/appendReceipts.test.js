import Web3 from 'ald-web3';
import Handler from './appendReceipts';

describe("AppendReceipts", ()=>{
    it("should append block transactions if not present", done=>{
        let web3 = new Web3();
        let conn = web3.connector;
        conn.open().then(async ()=>{
            let b = await conn.currentBlock();
            let ctx = {
                web3: conn
            };
            let next = async () => {
                await conn.close();
                let txns = b.transactions;
                for(let i=0;i<txns.length;++i) {
                    let t = txns[i];
                    if(!t.receipt || !t.receipt.gasUsed) {
                        return done(new Error("Missing receipt in txn"));
                    }
                }
                done();
            }
            let h = new Handler();
            h.newBlock(ctx, b, next);
        })
    });
});