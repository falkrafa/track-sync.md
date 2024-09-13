import { GithubService } from '../github/github.service';

class UpdateReadmeCron {
  constructor(private readonly githubService: GithubService) {}

  async run(): Promise<void> {
    await this.githubService.updateProfileReadme();
  }
}

export default UpdateReadmeCron;
