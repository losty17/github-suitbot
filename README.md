# github-suitbot

> A GitHub App built with [Probot](https://github.com/probot/probot) that @suitable-foodservice&#x27;s GitHub automations

## Setup

```sh
# Install dependencies
npm install

# Compile
npm build

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t github-suitbot .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> github-suitbot
```

## Contributing

If you have suggestions for how github-suitbot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2026 Vinícius Kappke
