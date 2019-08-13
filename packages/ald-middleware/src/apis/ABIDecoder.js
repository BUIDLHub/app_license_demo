import * as yup from 'yup';
import {Logger} from 'ald-utils';

const schema = yup.object({
    web3: yup.object().required("Missing web3 for ABI decoder"),
    abis: yup.array().min(1).required("Missing ABIs for decoder")
});

const log = new Logger({component: "ABIDecoder"});

export default class ABIDecoder {
    constructor(props) {
        schema.validateSync(props);
        let abis = props.abis;
        this.web = props.web3;
        this.fnDefs = {};
        this.evtDefs = {};
        [
            'decode',
            'decodeFn'
        ].forEach(fn=>this[fn].bind(this));
        abis.forEach(a=>{
            if(a.type === 'function') {
                if(!a.signature) {
                    throw new Error("Invalid ABI. Must have signatures pre-computed for functions/events");
                }
                this.fnDefs[a.signature] = a;
            } else if(a.type === 'event') {
                if(!a.signature) {
                    throw new Error("Invalid ABI. Must have signatures pre-computed for functions/events");
                }
                this.evtDefs[a.signature] = a;
            }
        });
    }

    decodeFn(txn) {
        if(txn.input && txn.input.length > 2) {

            //get the fn signature (4-bytes plus 0x)
            let sig = txn.input.substring(0, 10);
            //lookup the fn definition by this sig
            let def = this.fnDefs[sig];
            if(def) {
              //if we found a matching fn, tag the transaction with the
              //fn's name. This will be used downstream as a context for
              //all attached log events
              return def.name;
            }
        }
        return undefined;
    }

    decode(block, txn) {
        let out = [];
        let fn = this.decodeFn(txn);

        let logs = txn.receipt.logs;
        //for all logs in the receipt
        for(let i=0;i<logs.length;++i) {
          let log = logs[i];
  
          //get the topic part of the event. Topic contains the
          //event signature and up to three indexed attributes
          let topics = log.topics;
  
          //all remaining attributes are held in data part of log
          let data = log.data;
  
          //pull the sig as the first topic
          let sig = topics.shift();
  
          //see if we know about it
          let def = this.eventSigs[sig];
          if(def) {
            let fields = null;
            try {
              //do actual decode of the log using the definition's input types, the data and
              //remaining indexed topic attributes
              fields = this.web3.eth.abi.decodeLog(def.inputs, data, topics);
            } catch (e) {
              //ignore
            }
            if(fields) {
              //if we have field data, we create a new event locally. This format
              //mimics web3's log event format
              let payload = {
                sender: txn.from.toLowerCase(),
                fnContext: fn,
                transactionHash: txn.hash,
                blockNumber: block.number,
                transactionIndex: txn.transactionIndex,
                signature: sig,
                address: log.address?log.address.toLowerCase():undefined,
                logIndex: i,
                timestamp: block.timestamp,
                event: def.name,
                returnValues: fields
              };
              out.push(payload);
            } else {
              log.error("Failed to decode event", def.name);
            }
          } else {
            log.warn("No log definition with signature", sig);
          }
        }
        return out;
    }
}