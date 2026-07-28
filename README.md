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

The repo includes a `Dockerfile` and `docker-compose.yml`. The image bundles Node.js and `ffmpeg` (needed to convert `.webm` video stickers), but **not** `lottie2gif` -- animated `.tgs` sticker conversion will fail gracefully (per-sticker, not a crash) unless you add that binary yourself. The bot uses long-polling, so no port needs to be published.

Configuration is passed in entirely through **environment variables** (no config file needs to be created or bind-mounted on the host):

| Variable | Required | Default | Notes |
|---|---|---|---|
| `BOT_TOKEN` | yes | -- | from [@BotFather](https://telegram.me/BotFather) |
| `BOT_USERNAME` | no | `` | your bot's `@username` |
| `ALLOWED_USERS` | no | `` (everyone allowed) | comma-separated numeric Telegram user IDs, e.g. `123456789,987654321` -- get yours from [@userinfobot](https://telegram.me/userinfobot) |
| `MAX_IMAGES` | no | `50` | max stickers per pack |
| `MAX_FILE_BYTES` | no | `51380224` (49 MiB) | max zip part size |
| `FILE_STORAGE` | no | `./storage` | working directory inside the container |
| `DEFAULT_LANG` | no | `en` | see `lang/` for available codes |
| `LOTTIE2GIF_PATH` | no | `lottie2gif` | only needed if you added that binary to the image |

**1. Deploy the stack in Portainer** -- pick one:

- **Git repository (recommended)**: Portainer -> *Stacks* -> *Add stack* -> *Repository*. Enter this repo's URL (`https://github.com/zjw88282740/telegram-stickerimage-bot`), branch `master`, and `docker-compose.yml` as the compose path. Portainer will build the image on the host from the `Dockerfile` in the repo.
- **Web editor**: Portainer -> *Stacks* -> *Add stack* -> *Web editor*, paste the contents of `docker-compose.yml` directly. If you'd rather not let Portainer build, replace `build: .` with a pre-built `image:` (see step 2 below).

Either way, in the stack's **Environment variables** section (or directly in the `environment:` block of the compose you pasted), set at least `BOT_TOKEN`, and `ALLOWED_USERS` if you want to restrict access.

**2. (Optional) Build and push the image yourself** instead of letting Portainer build it, then just reference `image: your-registry/telegram-stickerimage-bot:latest` in the stack:

```bash
docker build -t your-registry/telegram-stickerimage-bot:latest .
docker push your-registry/telegram-stickerimage-bot:latest
```

**3. Deploy the stack.** Portainer will build/pull the image, create the `stickerimage-storage` volume for persistent working files, and start the bot. Check *Containers -> logs* to confirm it connected (`[INTERNAL] [INFO] ...`).

To update after a config or code change, just redeploy the stack from Portainer (*Stacks -> your stack -> Pull and redeploy* if using an `image:`, or re-deploy to rebuild if using `build:`).

If you'd rather manage a full `config.js` file yourself (e.g. to customize `sticker_sources` or `available_lang`), you can still bind-mount one over the baked-in config instead of using environment variables -- add `- /path/on/host/config.js:/app/config.js:ro` under `volumes:` in `docker-compose.yml`.

### License

MIT
