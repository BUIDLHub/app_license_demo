import DB from './';

describe("DB", ()=>{
    it("should store key value pair", done=>{
        let db = new DB();
        db.create({
            database: "test",
            key: "test-key",
            data: {
                content: "some data"
            }
        }).then(async ()=>{
            await db.create({
                database: "test2",
                key: "test-key2",
                data: {
                    content: "second db"
                }
            });
            let res = await db.read({
                database: "test",
                key: "test-key"
            });
            if(!res) {
                return done(new Error("Expected to retrieve data from DB"));
            }
            if(!res.content) {
                return done(new Error("Expected to have content field in result"));
            }
            res = await db.read({
                database: "test2",
                key: "test-key2"
            });
            if(!res || !res.content) {
                return done(new Error("Expeted to read data in 2nd db instance"));
            }
            await db.clearAll();
            done();
        })
        .catch(done);

    })
});