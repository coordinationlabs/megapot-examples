# Watch Events

Utilizing Alchemy's SDK we setup event listeners to process event data from the Megapot contract.

# Overview
This is a basic script that shows you how to subscribe to the various Megapot events emitted from the Jackpot contract.  You can use this as a foundation for building event triggers.  When an event comes in for the specific event, you can handle processing of that data in any way you like.

# Setup

[Megapot Examples Repo](https://github.com/coordinationlabs/megapot-examples)

```
# Clone repository
git clone git@github.com:coordinationlabs/megapot-examples.git

# Change into directory
cd watch-events

# Install dependencies
pnpm install

# Copy env example
cp .env.example .env

# Edit .env & add API token
# ALCHEMY_API_KEY='<your-alchemy-api-key>'

# Start the server
pnpm start index.ts
```

## Events
You can view the event types in [event-abis.ts](./lib/event-abis.ts) and choose which events you want to act on by importing that event ABI into the consumers inside [index.ts](./index.ts)