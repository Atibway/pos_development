import { CronJob } from "cron";

const job = new CronJob("*/14 * * * *", async function () {
  const url = "http://pos-tiens-backend.onrender.com/api/health";
  console.log(`[${new Date().toISOString()}] [CRON] Sending GET to ${url}`);

  try {
    const res = await fetch(url); // 🔥 Use global fetch (Node 18+)
    if (res.ok) {
      console.log(`[${new Date().toISOString()}] [CRON] ✅ Success`);
    } else {
      console.log(`[${new Date().toISOString()}] [CRON] ❌ Failed: ${res.status}`);
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [CRON] 🚨 Error`, err);
  }
});

export default job;
