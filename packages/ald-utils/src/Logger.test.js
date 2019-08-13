import {Logger} from './'

describe("Logger", ()=>{
    it("should log default info level", done=>{
        let log = new Logger({component: "Test"});
       
        log.info("Test info message with", 1, "args");
        //should see if run DEBUG=Test:* npm test
        log.debug("Test debug message");
        done();
    })
});