# HF Jobs Cron

Triggering an Hugging Face Job via Cloudflare Cron.

## Configuration

### wrangler.jsonc

Configure your cron triggers in the `triggers.crons` array:

```json
{
  "triggers": {
    "crons": [
      "0 13 * * *"
    ]
  }
}
```

The cron expression `"0 13 * * *"` runs daily at 1:00 PM UTC.

### src/index.ts

Handle the scheduled events in your worker's `scheduled` function:

```typescript
export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) {
    switch (controller.cron) {
      case "0 13 * * *":
        await startHubStatsJob(env.HF_TOKEN);
        break;
    }
  },
};
```

## Resources

- [Cloudflare Workers Cron Triggers Documentation](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [Wrangler Configuration Reference](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Cron Expression Format](https://crontab.guru/)
