import Web3 from 'ald-web3';
import Handler from './appendTransactions';

describe("AppendTransactions", ()=>{
    it("should append block transactions if not present", done=>{
        let cfg = {
            id: 1,
            URL: "https://mainnet.infura.io"
        }
        
        let web3 = new Web3(cfg);
        let conn = web3.connector;
        conn.open().then(async ()=>{
            let b = await conn.currentBlock();
            let ctx = {
                web3: conn
            };
            let next = async () => {
                await conn.close();
                if(!b.transactions || b.transactions.length === 0) {
                    return done(new Error("Missing block transactions"));
                }
                done();
            }
            let h = new Handler();
            h.newBlock(ctx, b, next);
        })
    });
});