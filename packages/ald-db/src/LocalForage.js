import localforage from 'localforage';
import {extendPrototype} from 'localforage-setitems';
import BaseDB, {
  createSchema,
  createBulkSchema,
  readSchema,
  readAllSchema,
  findSchema,
  updateSchema,
  removeSchema,
  iterateSchema
} from './BaseDB';
import _ from 'lodash';
import {Logger} from 'ald-utils';
import LocalFS from './LocalFSStorage';

extendPrototype(localforage);
const log = new Logger({component: "LocalForage"});
const dbNames = {};

export default class _LocalForage extends BaseDB {
  
  constructor(props) {
    super(props);
    
    [
      'create',
      'createBulk',
      'read',
      'readAll',
      'find',
      'update',
      'updateBulk',
      'remove',
      'clearAll',
      'iterate'
    ].forEach(fn=>{
      this[fn]=this[fn].bind(this)
    });
    this.querySizeLimit = props.querySizeLimit || 50;
  }

  async clearAll(dbs) {
    if(!dbs) {
      dbs = _.keys(dbNames);
    }
    for(let i=0;i<dbs.length;++i) {
      let k = dbs[i];
      if(!k) {
        continue;
      }
      let pfx = this.dbPrefix || "";
      let nm = pfx + k;
      let db = await this._getDB({database: k}, dbFactory);
      if(!db) {
        return;
      }
      log.info("Dropping DB", nm);
      await db.dropInstance();
      this.dbs[nm] = undefined;
      
    }
  }

  async create(props) {
    createSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    try {
      await db.ready().then(async ()=>{
        await db.setItem(props.key, props.data);
      })
      
    } catch (e) {
      log.error("Problem storing to", props.database, e);
    }

  }

  async createBulk(props) {
    createBulkSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    log.debug("Creating bulk items", props.items, "in DB", db.name);
    try {
      await db.setItems(props.items);
    } catch (e) {
      log.error("Problem storing items", props.database, e);
    }
  }

  async read(props) {
    readSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    log.debug("Reading entry with key", props.key, "from DB with name", db.name);
    let r = await db.getItem(props.key);
    log.debug("Results for key", props.key, r)
    return r;
  }

  async readAll(props) {
    readAllSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);

    let set = [];
    let sortFn = _buildSortFn(props);
    let limit = props.limit || this.querySizeLimit;
    let filterFn = props.filterFn;
    await db.iterate((v, k, itNum)=>{
      if(itNum > limit) {
        return set;
      }
      if(filterFn) {
        if(filterFn(v, k, itNum)) {
          set.push(v);
        }
      } else {
        set.push(v);
      }
    });
    if(sortFn) {
      sortFn(set);
    }
    return set;
  }

  async iterate(props) {
    iterateSchema.validateSync(props);
    if(typeof props.callback !== 'function') {
      throw new Error("Missing callback function");
    }
    let db = await this._getDB(props, dbFactory);
    await db.iterate(props.callback);
  }

  async find(props) {
    findSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    let set = [];
    let sortFn = _buildSortFn(props);
    let limit = props.limit || this.querySizeLimit;
    let selKeys = _.keys(props.selector);
    let offset = props.offset || 0;
    let includeTotal = props.includeTotal;
    let skipping = offset > 0;
    let endLength = offset + limit;

    let total = 0;
    await db.iterate((dbVal, dbKey, itNum)=>{
      let allMatch = true;
      //filter based on selectors first. This way we make
      //sure paging and sorting work with the same dataset
      //each time. This is terribly slow but localforage/indexedDB
      //doesn't offer skipping records. An optimization might be
      //to keep our own index of record counts so that at a minimum
      //we're not running through entire set each time. Skipping would
      //still require walk from beginning. I don't know what happens if
      //records are inserted during paging operation...would we miss an
      //item if it's key were iterated earlier than the page we skipped?
      //This needs more thought.
      for(let i=0;i<selKeys.length;++i) {
        let p = selKeys[i];
        let tgt = props.selector[p];
        let v = dbVal[p];
        if(!isNaN(v) && !isNaN(tgt)) {
          v -= 0;
          tgt -= 0;
        }
        if(v !== tgt) {
          allMatch = false;
          break;
        }
      }
      if(allMatch) {
        ++total;
        if(!skipping && set.length < endLength) {
          set.push(dbVal);
        } else if(!skipping && set.length >= endLength && !includeTotal) {
          return set;
        }
      }

      skipping = total < offset || set.length > (offset+limit);
    });

    if(sortFn) {
      sortFn(set);
    }
    if(includeTotal) {
      return {
        total,
        data: set
      }
    }
    return set;
  }

  async update(props) {
    updateSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    try {
      await db.ready().then(async ()=>{
        await db.setItem(props.key, props.data);
      });
    } catch (e) {
      log.error("Problem storing to", props.database, e);
    }
  }

  async updateBulk(props) {
    createBulkSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    log.debug("Storing", props.items.length,"items to",db.name);
    try {
      await db.ready().then(async ()=>{
        await db.setItems(props.items, null, null, (e,res)=>{
          if(e) {
            log.error("Problem storing bulk items", e);
          }
        });
      });
      
    } catch (e) {
      log.error("Problem storing items", props.database, e);
    }
  }

  async remove(props) {
    removeSchema.validateSync(props);
    let db = await this._getDB(props, dbFactory);
    try {
      await db.ready().then(async ()=>{
        await db.removeItem(props.key, (e, res)=>{
          if(e) {
            log.error("Problem removing item from DB", e);
          }
        })
      });
    } catch (e) {
      log.error("Problem removing item", prop.database, e);
    }
  }
}


const _buildSortFn = props => {
  if(!props.sort) {
    props.sort = [
      {
        field: "timestamp",
        order: "desc"
      }
    ];
  }

  let sorter = (set, fld, isAsc) => {
    set.sort((a,b)=>{
      let av = a[fld];
      let bv = b[fld];
      if(av > bv) {
        return isAsc ? 1 : -1;
      }
      if(av < bv) {
        return isAsc ? -1 : 1;
      }
      return 0;
    });
  };
  return set => {
    props.sort.forEach(s=>{
      sorter(set, s.field, s.order.toUpperCase() === 'ASC')
    });
  }
}

const canStoreInLS = () => {
  try {
    if(typeof localStorage === 'undefined') {
      log.debug("Cannot store in localstorage");
      return false;
    }

    localStorage.setItem("__test", "true");

    let i = localStorage.getItem("__test");
    log.debug("LS test", i);
    if(!i) {
      return false;
    }
    localStorage.removeItem("__test");
    return true;
  } catch (e) {
    log.error("Problem storing LS", e);
    return false;
  }
}

const localStorageValid = () => {
  log.debug("Testing local storage");
  return (typeof localStorage !== 'undefined') &&
            'setItem' in localStorage &&
            canStoreInLS()
}

const dbFactory = async props => {
  let lfProps = {
    name: props.name
  };
  dbNames[props.name] = true;
  if(!canStoreInLS()) {
    lfProps.driver = "localFSDriver";
    let local = new LocalFS();
      localforage.defineDriver(local).then(()=>{
        localforage.setDriver(local._driver);
      })
  }
  log.info("Creating DB", props.name);
  var db = await localforage.createInstance(lfProps);
  db.name = lfProps.name;
  return db;
}
