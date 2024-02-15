# Rediscn
Rediscn is a modern, user-friendly Redis GUI built using the power of Remix, Bun, RedisIO, and Shadcn UI. It's designed to make interacting with Redis databases simpler, more intuitive, and visually appealing. Currently, we fully support string and hash data types, with plans to include lists, sets, sorted sets, and more in the near future.


https://github.com/reillyjodonnell/Rediscn/assets/65147216/983db7c0-6d93-4e33-be1c-a8aae884559e


## Features
- **Intuitive Interface**: A clean, responsive UI built with Shadcn UI that makes database management a breeze.
- **Data Type Support**: Full support for Redis strings and hashes, with more data types being added regularly.
- **Real-time Updates**: See your Redis data change in real-time as you interact with your database.
- **Easy Setup**: Run Rediscn with minimal setup using Bun and Docker.

## Getting Started
### Prerequisites
- Docker
- Bun
### Installation
1. **Start Redis Container**
To use Rediscn, you first need to have a Redis server running. You can easily start a Redis container with Docker:
```bash
docker run --name my-redis -p 6379:6379 -d redis
```
2. **Install Dependencies**
With Bun installed on your machine, run the following commands in the root directory of your Rediscn project:
```bash
bun install
```
3. **Start Development Server**
To run your local development server, execute:
```bash
bun dev
 ```
### Demo
Check out our [live demo](https://github.com/reillyjodonnell/Rediscn/assets/65147216/22c66aa9-a417-4411-94bb-2c89da542dd2) to see Rediscn in action.
## Contributing
We're constantly working to improve Rediscn and would love your help! Whether you're fixing bugs, adding new features, or improving documentation, your contributions are welcome.

- **Report Issues**: Found a bug or have a suggestion? Please use the [issues tab](https://github.com/reillyjodonnell/Rediscn/issues) to let us know.
- **Submit Pull Requests**: Want to contribute directly? Fork the repo, make your changes, and submit a pull request. We'll review it as soon as we can.
- ## License
- Rediscn is open-source software licensed under the MIT license.
## Support
If you need help or have any questions, please feel free to contact us via GitHub issues.
