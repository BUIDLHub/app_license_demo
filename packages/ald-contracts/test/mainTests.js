const LicenseMain = artifacts.require("./LicenseMain.sol");


const getSignatureParameters = (signature) => {
    
    const r = signature.slice(0, 66);
    const s = `0x${signature.slice(66, 130)}`;
    let v = `0x${signature.slice(130, 132)}`;
    v = web3.utils.hexToNumber(v);

    if (![27, 28].includes(v)) v += 27;

    return {
        r,
        s,
        v
    };
};

contract("Proxy", (accounts)=>{
    let main;
    beforeEach("setup contracts", async ()=>{
        await LicenseMain.deployed().then(m=>main = m);
    });
    
    it("Should reflect default root vendor and product info", done=>{
        main.productInfo.call(1, {from: accounts[0]}).then(info=>{
                if(info[3] !== 'RootProduct') {
                    return done(new Error("Expected product with id 1 to be RootProduct: " + info[3]));
                }
                done();
            })
            
        
    });

    it("Should register new vendor", done=>{
        main.registerProduct("NewProduct", {from: accounts[0]}).then(()=>{
            main.productInfo.call(2).then(info=>{
                if(info[3] !== 'NewProduct') {
                    return done(new Error("Did not register new product: " + info[3]));
                }
                done();
            })
        });
    });

    it("Should register new license specs", done=>{
        
        main.registerLicenseSpecs(1, 0, "NewFeature", 2500000, 86400).then(()=>{
            main.licenseSpecsInfo.call(1, 1).then(info=>{
                if(info[3] !== 'NewFeature') {
                    return done(new Error("Expected to add feature: " + info[3]));
                }
                done();
            })
        })
    });
    

    it("Should validate valid license", done=>{
        main.registerLicenseSpecs(1, 0, "NewFeature", 2500000, 86400).then(()=>{
            main.issueLicense(1, 1, {from: accounts[1], value: 2500000}).then(async ()=>{
                let lic = await main.licenseInfo.call(1);
                for (p in lic) {
                    let v = lic[p];
                    if(v.toString) {
                        v = v.toString()
                    }
                    console.log(p, "=", v);
                }
                //console.log("LICENSE exp", lic[]);
                let hasOne = await main.userHasValidLicense(accounts[1], 1, 1);
                if(!hasOne) {
                    return done(new Error("Expected user to have a license"));
                }
                
                done();
            })
        });
    });

    
    it("Should show user has a license", done=>{
        main.registerLicenseSpecs(1, 0, "NewFeature", 2500000, 86400).then(()=>{
            main.issueLicense(1, 1, {from: accounts[1], value: 2500000}).then(async ()=>{
                let lid = await main.findLicenseID(accounts[1], 1, 1);
                if(!lid) {
                    return done(new Error("Expected user to have a license"));
                }
                
                done();
            })
        });
    });

    it("Should invalidate expired license", done=>{
        main.registerLicenseSpecs(1, 0, "NewFeature", 2500000, 3).then((tx)=>{
            let event = tx.logs[0];
            let specId = 1;
            if(event) {
                specId = event.args['specID'].toString() - 0;
            }
            main.issueLicense(1, specId, {from: accounts[1], value: 2500000}).then(async ()=>{
                await sleep(4000);
                let specs = await main.licenseSpecsInfo.call(1,specId);
                let info = await main.licenseInfo.call(1);
                let hasOne = await main.userHasValidLicense(accounts[1], 1, specId);
                if(hasOne) {
                    return done(new Error("Expected license to expire"));
                }
                
                done();
            })
        });
    });

    it("Should authenticate license ownership", done=>{
        main.registerLicenseSpecs(1, 0, "NewFeature", 2500000, 86400).then(()=>{
            main.issueLicense(1, 1, {from: accounts[1], value: 2500000}).then(async ()=>{
                let lid = await main.findLicenseID(accounts[1], 1, 1);
                if(lid == 0) {
                    return done(new Error("Did not find valid license ID"));
                }
                let token = await main.generatePermissionHash(accounts[1], lid);
                let sig = await web3.eth.sign(token, accounts[1]);
                let {
                    r,s,v
                } = getSignatureParameters(sig);
                
                let isValid = await main.verifyLicense(accounts[1], lid, v, r, s);
                if(!isValid) {
                    return done(new Error("Expected signature to verify license ownership"));
                }
                
                done();
            })
        });
    });
    

    /*

    it("Should be able to change main logic and not affect storage", done=>{
        LicenseProxy.deployed().then((proxy)=>{
            LicenseMain.deployed().then(main=>{
                let con = new web3.eth.Contract(main.abi, proxy.address);
                con.methods.registerProduct("NewProduct").send({from: accounts[0]}).then(()=>{
                    con.methods.productInfo.call(2).then(info=>{
                        if(info[3] !== 'NewProduct') {
                            return done(new Error("Expected new product in name field: " + info[3]));
                        }

                        

                    });
                });
            });
        });
    });

    */
});

const sleep = (ms) => {
    return new Promise(done=>{
        setTimeout(done, ms);
    })
}