# BACKED BY STX

A decentralized crowdfunding application. Built on the Stacks blockchain + NextJS.

## Local Development

Local development requires [Node.js](https://nodejs.org/en), [Docker](https://www.docker.com/), and [Clarinet](https://github.com/hirosystems/clarinet).

### Install application dependencies

```
npm i
```

### Run contract unit tests

```
npm test:contracts
```

### Run the application locally

1. Run a local Stacks DevNet

```
clarinet devnet start
```

This will start a Stacks Devnet at `localhost:3999`. The terminal window will turn into an interface where you can browse mined blocks and the transactions within them. The DevNet will automatically deploy the `campaign-funding` smart contract, and make several local wallets available for testing (see `settings/Devnet.toml` for details).

If you make changes to the Smart Contract during development, you will need to stop and restart the DevNet.

Once the DevNet is running, note that you can use the [Stacks Explorer connected to your DevNet](https://explorer.hiro.so/sandbox/contract-call?chain=testnet&api=http://localhost:3999) to easily call functions, browse blocks, and request STX from the faucet to use for testing.

2. Run the web application

In a separate terminal window, run:

```
npm run dev
```

This will start the NextJS application at `localhost:3000`.

Visit `localhost:3000` in your browser.

## Smart Contract

Contract code can be found within the `contracts` directory.

Public functions

- `add-campaign`: create a new campaign.
- `update-campaign-data`: update data for a given campaign.
- `contribute-to-campaign`: make a contribution to a given campaign. the funds are collected from the caller's wallet and stored in the contract, awaiting the end of the campaign.
- `fund-campaign`: sends funds raised to the campaign owner. can be called exactly once, after a campaign has reached its end, and if the campaign has met its funding goal.
- `refund-contribution`: refunds a contribution back to a contributor. can be called exactly once per contributor, after a campaign has reached its end, and if the campaign did not meet its funding goal.

Read-only functions

- `get-campaign`: get details of a given campaign
- `get-campaign-funding-totals`: get the total amount raised and total number of contributions to a given campaign
- `is-campaign-expired`: check if a campaign has reached its end
- `get-contribution-info`: get info about a given contributor's contribution to a given campaign

## Application API

- `GET /api/campaigns`: get all campaigns and their funding info
- `POST /api/campaigns`: save a newly created campaign (the campaign is first created directly on-chain by the client via the user's STX wallet)
- `PUT /api/campaigns/{id}`: save updates to a campaign (the campaign is first updated directly on-chain by the client via the user's STX wallet)
- `GET /api/campaigns/{id}`: get campaign details
- `POST /api/contributions`: save info about a contribution made to a campaign (the contribution is first sent directly on-chain by the client via the user's STX wallet)
- `PUT /api/campaigns/close`: closes any campaigns that have reached their end. either sends the collected funds to the campaign owner, or refunds the contributors, depending on if the campaign reached its funding goal.
