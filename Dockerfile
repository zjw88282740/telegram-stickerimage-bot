FROM node:20-bookworm-slim

# ffmpeg is required to convert .webm video stickers to gif.
# gzip (used to decompress .tgs files) ships with the base image already.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY bot.js ./
COPY lang ./lang

# config.js is generated from environment variables at container start
# (see config.docker.js / docker-compose.yml) — no config file needs to
# be bind-mounted into the container.
COPY config.docker.js ./config.js

RUN mkdir -p /app/storage

VOLUME ["/app/storage"]

# The bot uses long-polling, not webhooks, so no port needs to be exposed.
CMD ["node", "bot.js"]
