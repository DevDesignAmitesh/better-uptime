import { createClient, RedisClientType } from "redis";

interface WebsiteEvent {
  url: string;
  id: string;
}

interface MessageType {
  id: string;
  message: {
    url: string;
    id: string;
  };
}

class RedisClient {
  private static instance: RedisClient;
  private static redis_instance: RedisClientType;
  private readonly STREAM_NAME = "betteruptime:website";
  private readonly GROUPS: string[] = [
      "c5bdeca3-16e2-4837-9f28-bdb6dcb80793", 
      "d5176337-f3ed-428e-a112-fa1e6be3a7b5"
  ];

  constructor() {
    this.createGroup();
  }

  private createGroup = async () => {
    try {
      const client = await RedisClient.getRedisInstance();
      const grps = await client.xInfoGroups(this.STREAM_NAME);
      this.GROUPS.map(async (item) => await client.xGroupDestroy(this.STREAM_NAME, item) )
      this.GROUPS.map(
        async (grp) =>
          await client.xGroupCreate(this.STREAM_NAME, grp, "0", {
            MKSTREAM: true,
          })
        );
      console.log(grps);

    } catch (e) {
      console.log("error in createGroup", e);
    }
  };

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public static getRedisInstance = async (): Promise<RedisClientType> => {
    if (!RedisClient.redis_instance) {
      RedisClient.redis_instance = createClient();
      await RedisClient.redis_instance.connect();
      RedisClient.redis_instance.on("error", (error) =>
        console.log("redis client error", error)
      );
    }
    return RedisClient.redis_instance;
  };

  private xAdd = async ({ url, id }: WebsiteEvent) => {
    try {
      console.log("this is what we are adding", url, id);
      const client = await RedisClient.getRedisInstance();
      await client.xAdd(this.STREAM_NAME, "*", {
        url,
        id,
      });
    } catch (e) {
      console.log("error while xAdd", e);
    }
  };

  xAddBuilk = (websites: WebsiteEvent[]) => {
    try {
      for (let i = 0; i <= websites.length; i++) {
        const elm = websites[i];

        if (!elm) {
          continue;
        }

        this.xAdd({
          url: elm.url,
          id: elm.id,
        });
      }
    } catch (e) {
      console.log("error while xAddBuilk", e);
    }
  };

  // have the find the type of the message
  readGroup = async (
    consumerGroup: string,
    workerId: string
  ): Promise<MessageType[] | undefined> => {
    try {
      const client = await RedisClient.getRedisInstance();

      const res = await client.xReadGroup(
        consumerGroup,
        workerId,
        {
          key: this.STREAM_NAME,
          id: ">",
        },
        {
          COUNT: 5,
        }
      );

      console.log("this is the response after reading the group", res);

      if (!res || !Array.isArray(res) || !res[0]) {
        return undefined;
      }


      return res[0].messages as MessageType[]
    } catch (e) {
      console.log("error in readGroup", e);
      return undefined;
    }
  };

  private xAck = async (consumerGroup: string, eventId: string) => {
    try {
      console.log("this is what getting ackowledged", consumerGroup, eventId);
      const client = await RedisClient.getRedisInstance();

      await client.xAck(this.STREAM_NAME, consumerGroup, eventId);
    } catch (e) {
      console.log("erro in xAck", e);
    }
  };

  xAckBulk = (consumerGroup: string, eventId: string[]) => {
    try {
      eventId.map(async (ev) => await this.xAck(consumerGroup, ev));
    } catch (e) {
      console.log("error in xAckBulk", e);
    }
  };
}

export const redisClient = RedisClient.getInstance();
