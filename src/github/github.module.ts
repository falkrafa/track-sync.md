import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { TrackService } from 'src/track/track.service';
import { GithubService } from './github.service';

@Module({
  controllers: [GithubController],
  providers: [GithubService, TrackService],
})
export class GithubModule {}
