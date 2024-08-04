import { createClient } from 'redis';

class RedisClient {
  constructor () {
    this.client = createClient();
    this.client.on('error', (err) => {
      console.log(err);
      this.client = undefined;
    });
    this.client.connect();
  }

  isAlive() {
    if (this.client) {
      return true;
    }
    return false;
  }

  get(str) {
    try {
      const value = this.client.get(str);
      return value;
    } catch (err) {
      console.log(err);	    
    }
  }

  set(str, val, dur) {
    try {
      this.client.set(str, val);
      if (dur) {
        this.client.expire(str, dur);
      }
    } catch (err) {
      console.log(err);
    }
  }

  del(str) {
    try {
      this.client.del(str);
    } catch (err) {
      console.log(err);
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
