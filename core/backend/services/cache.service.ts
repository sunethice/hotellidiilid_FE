// import * as NodeCache from 'node-cache';
import NodeCache from "node-cache";
// import * as PersistCache from 'persistent-cache';

class CacheService {

   private cache: NodeCache;
   // private persistent_cache: PersistCache;

    constructor() {
       this.cache = new NodeCache();
      //  this.persistent_cache = PersistCache();
    }

    set(key: string, value: any, expire: number): void {
       this.cache.set(key, value, expire);
      //  this.persistent_cache.putSync(key, value);
    }

    /**
     * @function get
     * @description Get value from cache
     * @param key key of the cache value
     */
    get(key: string): any {
       return this.cache.get(key);
      //  return this.persistent_cache.getSync(key);
    }

    /**
     * @function remove
     * @description Remove value from cache
     * @param key key of the cache value
     */
    remove(key: string): void{
        this.cache.del(key);
    }
}

export default new CacheService()
