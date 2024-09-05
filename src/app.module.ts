import { Module } from '@nestjs/common';
import { TokenModule } from './token/token.module';
import { TrackModule } from './track/track.module';
import { GithubModule } from './github/github.module';

@Module({
  imports: [TokenModule, TrackModule, GithubModule],
})
export class AppModule {}
