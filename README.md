StickerImageBot
===============

Bot to export telegram stickers to images. [Here is a sample one to play with (Not sure it's running)](https://telegram.me/stickerset2packbot)

Send individual stickers or sticker links (something like `https://t.me/addstickers/AniColle`) to prepare a zip of sticker image file.

### Requirements

* Node.js v8.0.0^
* ImageMagick with webp support (Check with `identify -list format | grep -i 'webp'` on *nix systems)
* [lottieconv](https://crates.io/crates/lottieconv)

### Usage

1. git clone
2. Get a bot token from [@BotFather](https://telegram.me/BotFather)
3. Copy `config.js.example` to `config.js` and edit as your needs
4. `npm install && npm start`

### Restricting bot access

By default anyone can use the bot. To limit usage to specific people, set `allowed_users` in `config.js` to an array of numeric Telegram user IDs (get yours from a bot like [@userinfobot](https://telegram.me/userinfobot)):

```js
allowed_users: [123456789, 987654321],
```

Leave it as an empty array (`[]`, the default) to allow anyone.

### Deploying with Docker / Portainer

The repo includes a `Dockerfile` and `docker-compose.yml`. The image bundles Node.js and `ffmpeg` (needed to convert `.webm` video stickers), but **not** `lottie2gif` — animated `.tgs` sticker conversion will fail gracefully (per-sticker, not a crash) unless you add that binary yourself. The bot uses long-polling, so no port needs to be published.

**1. Prepare `config.js` on the host**, e.g. at `/opt/telegram-stickerimage-bot/config.js`:

```bash
mkdir -p /opt/telegram-stickerimage-bot
cd /opt/telegram-stickerimage-bot
curl -O https://raw.githubusercontent.com/zjw88282740/telegram-stickerimage-bot/master/config.js.example
mv config.js.example config.js
# edit config.js: set your bot token, and allowed_users if you want to restrict access
```

**2. Deploy the stack in Portainer** — pick one:

- **Git repository (recommended)**: Portainer → *Stacks* → *Add stack* → *Repository*. Enter this repo's URL, branch, and `docker-compose.yml` as the compose path. Portainer will build the image on the host from the `Dockerfile` in the repo. Then, in the created stack, go to the environment's *Volumes*/host filesystem and make sure `./config.js` in the compose file resolves next to where the stack is deployed — simplest is to edit the compose in Portainer's web editor to point the bind mount at the absolute host path instead, e.g.:
  ```yaml
  volumes:
    - /opt/telegram-stickerimage-bot/config.js:/app/config.js:ro
    - stickerimage-storage:/app/storage
  ```
- **Web editor (simpler)**: Portainer → *Stacks* → *Add stack* → *Web editor*. Paste the contents of `docker-compose.yml`, but change the `build: .` line to point at a git context Portainer can reach, or replace it with a pre-built `image:` (see below), and set the `config.js` bind mount to the absolute host path from step 1.

**3. (Optional) Build and push the image yourself** instead of letting Portainer build it, then just reference `image: your-registry/telegram-stickerimage-bot:latest` in the stack:

```bash
docker build -t your-registry/telegram-stickerimage-bot:latest .
docker push your-registry/telegram-stickerimage-bot:latest
```

**4. Deploy the stack.** Portainer will build/pull the image, create the `stickerimage-storage` volume for persistent working files, and start the bot. Check *Containers → logs* to confirm it connected (`[INTERNAL] [INFO] ...`).

To update after a config or code change, just redeploy the stack from Portainer (*Stacks → your stack → Pull and redeploy* if using an `image:`, or re-deploy to rebuild if using `build:`).

### License

MIT
