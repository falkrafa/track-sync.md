# Spotify Last Listened Tracker 🎧

[![NestJS](https://img.shields.io/badge/NestJS-7E1E9C?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/) [![Spotify API](https://img.shields.io/badge/Spotify%20API-1DB954?style=flat&logo=spotify&logoColor=white)](https://developer.spotify.com/documentation/web-api/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

**Track Sync** is a NestJS server that integrates with the Spotify API to fetch the last track played on your account. The project automatically updates your GitHub README with the song information, allowing your followers to see what you’re listening to.

## Features

- 🔄 Updates the README with the last song played on Spotify
- 🎧 Integration with the Spotify API
- 📄 Renders a card with track information in the README
- ⏰ Support for cron jobs via GitHub Actions

## Prerequisites

- Node.js v16+
- A developer account on Spotify to set up the API
- Set up GitHub Actions for automatic execution

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/falkrafa/track-sync.md.git
   cd track-sync.md
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:

   Create a `.env` file with the following variables:

   ```bash
   SPOTIFY_CLIENT_ID=
   SPOTIFY_SECRET=
   SPOTIFY_ACCOUNT_URL=
   SPOTIFY_API_URL=
   SPOTIFY_REFRESH_TOKEN=
   GITHUB_TOKEN=
   GITHUB_USER=
   GITHUB_EMAIL=
   ```

4. Run the server locally:

   ```bash
   yarn start:dev
   ```

## Usage

To update the README with the last song played on Spotify, use the following command:

```bash
yarn run:cron:update-readme
```

This command will automatically fetch the last played track and update the README with the song details. To set up automatic updates, follow the GitHub Actions configuration instructions below.

## GitHub Actions

This repository includes a GitHub Actions setup to run a cron job that automatically updates the README. Make sure to properly configure your repository secrets:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_SECRET`
- `SPOTIFY_REFRESH_TOKEN`
- `SPOTIFY_ACCOUNT_URL`
- `SPOTIFY_API_URL`
- `GITHUB_TOKEN`
- `GITHUB_USER`
- `GITHUB_EMAIL`

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
