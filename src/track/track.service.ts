import { Injectable } from '@nestjs/common';
import { baseClient } from '../Utils/httpClient';

@Injectable()
export class TrackService {
  mountTrackData(data: any) {
    const track = data.track || data.item;

    const mountedTrackData = {
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      image: track.album.images[0].url,
    };

    return mountedTrackData;
  }

  async getCurrentTrack() {
    const { data } = await baseClient.get('me/player/currently-playing');

    return this.mountTrackData(data);
  }

  async getRecentTracks() {
    const { data } = await baseClient.get('me/player/recently-played');

    return data.items.map((item: any) => this.mountTrackData(item));
  }
}
