import Web3 from './';

describe("Web3", ()=>{
    it("should get current block", done=>{
        let web = new Web3();
        web3.start()
        .then(()=>{
            web3.currentBlock().then(async b=>{
                console.log("Retrieved block", b.number);
                await web3.stop();
                done();
            }).catch(done);
        }).catch(done);
        
    });

    it("should get subscribed blocks", done=>{
        let web3 = new Web3();
        web3.on("block", async (b)=>{
            console.log("Getting block in test", b.number);
            
        });
        web3.on("error", async e=>{
            console.log("Problem in web3", e);
            await web3.stop();
            done(e);
        })

        web3.start()
        .catch(done);
        sleep(10000).then(async ()=>{
            await web3.stop();
            done();
        });
    }).timeout(15000);
});

const sleep = ms=>{
    return new Promise(done=>{
        setTimeout(done, ms);
    })
}