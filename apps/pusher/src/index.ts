import "dotenv/config";
import { db } from "db/db";
import { redisClient } from "redis-client/redis-client";

async function main () {
  try {
    const websites = await db.query.websites.findMany({
      columns: {
        id: true,
        url: true
      }
    });

    console.log(websites.length)

    redisClient.xAddBuilk(websites)

  } catch (e) {
    console.log("error in the pusher", e);
  }
}

main()

// setInterval(main, 3 * 60 * 1000)
setInterval(main, 20 * 1000)