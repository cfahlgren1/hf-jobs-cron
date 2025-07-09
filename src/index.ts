interface Env {
	HF_TOKEN: string;
}

const startHubStatsJob = async (hfToken: string) => {
	if (!hfToken) {
		throw new Error("HF_TOKEN is not set");
	}

	const response = await fetch("https://huggingface.co/api/jobs/cfahlgren1", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			dockerImage: "ghcr.io/astral-sh/uv:python3.11-bookworm",
			command: [
				"/bin/bash",
				"-c",
				'uv run https://huggingface.co/datasets/cfahlgren1/job-scripts/raw/main/hub-stats.py'
			],
			secrets: {
				HF_TOKEN: hfToken,
			},
			flavor: "cpu-upgrade",
			timeoutSeconds: 3600,
		})
	});

	if (!response.ok) {
		throw new Error(`Failed to start hub stats job: ${response.status} ${response.statusText}`);
	}

	return response.json();
};

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
