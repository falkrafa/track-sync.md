import * as dotenv from 'dotenv';
import CronJobs from './index';
import { GithubService } from '../github/github.service';
import { TrackService } from '../track/track.service';

dotenv.config({ path: `${process.cwd()}/.env` });

(async () => {
  const cronName: string = process.argv[2];
  const CronJobClass = CronJobs[cronName];

  if (!CronJobClass) {
    console.error(`Cron job "${cronName}" not found.`);
    process.exit(1);
  }
  const trackService = new TrackService();
  const githubService = new GithubService(trackService);

  const cron = new CronJobClass(githubService);

  try {
    await cron.run();
  } catch (error) {
    console.error('Error running cron job:', error);
    process.exit(1);
  }

  process.exit();
})();
