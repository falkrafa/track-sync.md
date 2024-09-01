import { Controller, Get } from '@nestjs/common';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get('current-track')
  async getCurrentTrack() {
    return this.trackService.getCurrentTrack();
  }

  @Get('recent-tracks')
  async getRecentTracks() {
    return this.trackService.getRecentTracks();
  }
}
