import { Module } from '@nestjs/common';
import { TokenModule } from './token/token.module';
import { TrackModule } from './track/track.module';

@Module({
  imports: [TokenModule, TrackModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
