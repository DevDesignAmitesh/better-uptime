import "dotenv/config";
import { db, schema } from "db/db";
import { redisClient } from "redis-client/redis-client";
import axios from "axios";

const REGION_ID = "c5bdeca3-16e2-4837-9f28-bdb6dcb80793";
const WORKER_ID = "india-a1";

async function main () {
  while (true) {
    const res = await redisClient.readGroup(REGION_ID, WORKER_ID);

    console.log(res);
    if(!res) {
      continue;
    }

    const promises = res.map((item) => 
        fetchWebsite({ websiteId: item.message.id, websiteUrl: item.message.url })
    );

    await Promise.all(promises);

    console.log(promises.length);

    redisClient.xAckBulk(REGION_ID, res.map((item) => item.id));

  }
}

async function fetchWebsite({ websiteUrl, websiteId }: {websiteUrl: string, websiteId: string}) {
  return new Promise<void>(async (res, rej) => {
    const start_time = Date.now()
    return await axios.get(websiteUrl)
      .then(async () => {
        const end_time = Date.now();
        await db.insert(schema.ticks).values({
          regionId: REGION_ID,
          websiteId,
          status: "Up",
          response_time: end_time - start_time
        });
        res();
      })
      .catch(async () => {
        const end_time = Date.now();
        await db.insert(schema.ticks).values({
          regionId: REGION_ID,
          websiteId,
          status: "Down",
          response_time: end_time - start_time
        })
        res();
      })
  })
}

main()