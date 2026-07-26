/**
 * One-off helper to (re)generate a Spotify refresh token.
 *
 * Spotify now expires user refresh tokens after 6 months
 * (https://developer.spotify.com/blog/2026-06-18-refresh-token-expiration),
 * so this needs to be re-run periodically and the resulting refresh token
 * pasted into the SPOTIFY_REFRESH_TOKEN GitHub Actions secret.
 *
 * Usage:
 *   yarn auth:spotify
 *
 * Requires in .env:
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_SECRET
 *   SPOTIFY_ACCOUNT_URL        (e.g. https://accounts.spotify.com)
 *   SPOTIFY_REDIRECT_URI       (must be registered exactly in the Spotify app dashboard)
 */
import * as http from 'http';
import * as crypto from 'crypto';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_SECRET;
const ACCOUNT_URL = process.env.SPOTIFY_ACCOUNT_URL;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SCOPES = 'user-read-currently-playing user-read-recently-played';

if (!CLIENT_ID || !CLIENT_SECRET || !ACCOUNT_URL || !REDIRECT_URI) {
  console.error(
    'Missing one of SPOTIFY_CLIENT_ID, SPOTIFY_SECRET, SPOTIFY_ACCOUNT_URL, SPOTIFY_REDIRECT_URI in .env',
  );
  process.exit(1);
}

const state = crypto.randomBytes(16).toString('hex');
const port = new URL(REDIRECT_URI).port || '8888';

const authUrl = new URL(`${ACCOUNT_URL}/authorize`);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('scope', SCOPES);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('state', state);

console.log('\nOpen this URL in your browser and approve access:\n');
console.log(authUrl.toString());
console.log(`\nWaiting for redirect on port ${port}...\n`);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '', REDIRECT_URI);
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  // Browsers auto-request things like /favicon.ico after the redirect lands;
  // those have no code/state and must be ignored, not treated as a failed callback.
  if (!code && !error) {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (error) {
    res.end(`Authorization failed: ${error}`);
    console.error('Authorization failed:', error);
    server.close();
    process.exit(1);
  }

  if (returnedState !== state) {
    res.end('State mismatch, aborting.');
    console.error('State mismatch, aborting.');
    server.close();
    process.exit(1);
  }

  res.end('Success! You can close this tab and go back to the terminal.');
  server.close();

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    'base64',
  );

  try {
    const { data } = await axios.post(
      `${ACCOUNT_URL}/api/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basicAuth}`,
        },
      },
    );

    console.log('\nrefresh_token:', data.refresh_token);
    console.log(
      '\nUpdate the SPOTIFY_REFRESH_TOKEN secret in GitHub with the value above.\n',
    );
  } catch (err: any) {
    console.error(
      'Failed to exchange code for tokens:',
      err.response?.data || err.message,
    );
    process.exit(1);
  }
});

server.listen(Number(port));
