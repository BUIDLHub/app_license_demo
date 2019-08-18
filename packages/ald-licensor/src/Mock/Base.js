import Web3PromEvent from 'web3-core-promievent';
import uuid from 'uuid/v4';
import {sleep} from 'buidl-utils';

const HASH_EVENT = "transactionHash";
export default class Base {
    constructor(props) {
        this.db = props.db;
        this.account = props.account;
        this.simulatedDelay = props.simulatedDelay || 5000;
        [
            'promEvent',
            'sendTxnHash'
        ].forEach(fn=>this[fn]=this[fn].bind(this));
    }

    promEvent() { 
        let defer = new Web3PromEvent();
        defer.isResolved = false;
        let origResolve = defer.resolve;
        let origReject = defer.reject;

        defer.resolve = (v) => {
            if(!defer.isResolved) {
                defer.isResolved = true;
                return origResolve(v);
            }
        }
        defer.reject = (e) => {
            if(!defer.isResolved) {
                defer.isResolved = true;
                return origReject(e);
            }
        }

        return (work) => {
            //need delay so that downstream can subscribe to promiEvent callbacks.
            //otherwise, it completes before those subs can complete.
            sleep(300).then(()=>{
                work(defer).then(v=>{
                    if(!defer.isResolved) {
                        return defer.resolve(v);
                    }
                }).catch(e=>{
                    if(!defer.isResolved) {
                        return defer.reject(e);
                    }
                });
            });
            
            return defer.eventEmitter;
        }
    }

    sendTxnHash(defer) {
        let hash = uuid();
        console.log("Emitting txn hash", hash);
        defer.eventEmitter.emit(HASH_EVENT, hash);
    }
}