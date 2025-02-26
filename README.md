# Caching Proxy

https://roadmap.sh/projects/caching-server

A simple caching proxy server built with Express.js, Axios, and Redis.

## Features
- Proxies requests to a specified origin server.
- Caches responses in Redis to reduce API load.
- Supports cache clearing via CLI option.

## Installation
```sh
npm install
```

## Usage
### Start the proxy server
```sh
npx tsx ./src/caching-proxy-cli.ts --port <port> --origin <origin-url>
```
Example:
```sh
npx tsx ./src/caching-proxy-cli.ts --port 3000 --origin https://catfact.ninja
```

### Clear the cache
```sh
npx tsx ./src/caching-proxy-cli.ts --clear-cache
```

## Requirements
- Node.js
- Redis

## License
MIT

