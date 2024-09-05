import { Controller, Get, Put } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private githubService: GithubService) {}

  @Get('profile-readme')
  async getProfileReadme() {
    return this.githubService.getProfileReadme();
  }

  @Put('profile-readme')
  async updateProfileReadme() {
    return this.githubService.updateProfileReadme();
  }
}
