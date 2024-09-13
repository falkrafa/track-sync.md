import { Injectable } from '@nestjs/common';
import { githubClient } from '../Utils/httpClient';
import { TrackService } from '../track/track.service';

@Injectable()
export class GithubService {
  constructor(private trackService: TrackService) {}

  async getProfileReadme() {
    const { data } = await githubClient.get(
      `${process.env.GITHUB_USER}/${process.env.GITHUB_USER}/contents/README.md`,
    );
    const decodedContent = Buffer.from(data.content, 'base64').toString(
      'utf-8',
    );

    return {
      sha: data.sha,
      content: decodedContent,
    };
  }

  mountNewSection(lastListenedTrack: any, content: string) {
    const startMarker = '<!-- START_LAST_TRACK_SECTION -->';
    const endMarker = '<!-- END_LAST_TRACK_SECTION -->';

    const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');
    const cleanedContent = content.replace(regex, '');

    const newSection = `
  ${startMarker}
  <h3 align="left">What I'm currently listening to 🎵</h3>
  <div align="left">
    <img src="${lastListenedTrack.image}" width="70" height="70"/>
    <br/>
    <strong>${lastListenedTrack.name}</strong><br/>
    by <em>${lastListenedTrack.artist}</em>
  </div>
  ${endMarker}
  `;
    const newContent = `${cleanedContent}${newSection.trim()}`;

    return newContent;
  }

  async updateProfileReadme() {
    console.log('Updating profile readme...');
    const { sha, content } = await this.getProfileReadme();

    const lastTrack = await this.trackService.getRecentTracks();
    const lastListenedTrack = lastTrack[0];

    const newContent = this.mountNewSection(lastListenedTrack, content);

    return await githubClient.put(
      `${process.env.GITHUB_USER}/${process.env.GITHUB_USER}/contents/README.md`,
      {
        message: `updating last listened music - ${new Date().toDateString()}`,
        committer: {
          name: process.env.GITHUB_USER,
          email: process.env.GITHUB_EMAIL,
        },
        sha,
        content: Buffer.from(newContent).toString('base64'),
      },
    );
  }
}
