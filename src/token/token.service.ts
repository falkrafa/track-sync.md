import { Injectable } from '@nestjs/common';
import { authClient } from '../Utils/httpClient';

@Injectable()
export class TokenService {
  async getRefreshToken() {
    const mountRequestData = {
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
      client_id: process.env.SPOTIFY_CLIENT_ID,
    };
    const { data } = await authClient.post('/token', mountRequestData);

    if (!data.access_token) {
      throw new Error('Error getting token');
    }

    return data.access_token;
  }
}
