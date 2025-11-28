import { createClient, RedisClientType } from "redis";

interface WebsiteEvent {
  url: string;
  id: string
}

class RedisClient {
  private static instance: RedisClient;
  private static redis_instance: RedisClientType;
  private STREAM_NAME = "betteruptime:website";

  public static getInstance(): RedisClient{
    if(!RedisClient.instance) {
      RedisClient.instance = new RedisClient()
    }
    return RedisClient.instance;
  }

  public static getRedisInstance(): RedisClientType{
    if(!RedisClient.redis_instance) {
      RedisClient.redis_instance = createClient()
      RedisClient.redis_instance.on("error", (error) => console.log("redis client error", error))
    }
    return RedisClient.redis_instance;
  }

  async xAdd({ url, id }: WebsiteEvent) {
    try {
      const client = RedisClient.getRedisInstance();
      await client.xAdd(this.STREAM_NAME, "*", {
        url,
        id
      })
    } catch (e) {
      console.log("error while xAdd", e)
    }
  }

  async xAddBuilk(websites: WebsiteEvent[]) {
    try {
      for(let i = 0; i <= websites.length; i++) {
        const elm = websites[i];
        
        if (!elm) {
          continue;
        }

        this.xAdd({
          url: elm.url,
          id: elm.id
        })
      }
    } catch (e) {
      console.log("error while xAddBuilk", e)
    }
  }
}

export const redisClient = RedisClient.getInstance();