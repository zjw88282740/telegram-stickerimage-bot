'use strict';

// Config loader used only inside the Docker image. Every value comes from
// an environment variable so the container can be configured entirely
// through `docker-compose.yml` / Portainer's stack env vars, without
// bind-mounting a config.js file. See docker-compose.yml for the list of
// supported variables.

function parseAllowedUsers(value) {
    if (!value) return [];
    return value.split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n));
}

module.exports = {
    token: process.env.BOT_TOKEN,
    username: process.env.BOT_USERNAME || '',

    lottie2gif: process.env.LOTTIE2GIF_PATH || 'lottie2gif',

    allowed_users: parseAllowedUsers(process.env.ALLOWED_USERS),

    maximages: Number(process.env.MAX_IMAGES) || 50,

    maxfilebytes: Number(process.env.MAX_FILE_BYTES) || 49 * 1024 * 1024,

    file_storage: process.env.FILE_STORAGE || './storage',

    sticker_sources: [
        'https://t.me/addstickers/',
        'https://telegram.me/addstickers/'
    ],

    default_lang: process.env.DEFAULT_LANG || 'en',
    available_lang: {
        'en': ['English', 'English'],
        'de': ['German', 'Deutsch'],
        'zh-hans': ['简体中文', '中国'],
        'zh-hant': ['正體中文', '中國'],
        'pt': ['Português (Portugal)'],
        'ru': ['Russian', 'Русский'],
        'ua': ['Ukrainian', 'Українська']
    }
};
