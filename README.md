# 🚀 SCRT SIBYL

![scrt sybil image](./public/images/readmeImage.png)


⚡️ This is the client side for SCRTSibyl, made with the developer experience in mind: Next.js, TypeScript, ESLint, Prettier, Husky, Lint-Staged, VSCode, PostCSS, Tailwind CSS.

### Tutorial (NEW)
- Get started on SCRTSibyl with [this](https://medium.com/@michael_brink/tutorial-on-using-scrtsibyl-a202b3014c8) tutorial (~9 min)

### Features

Developer experience first:

- 🔥 [Next.js](https://nextjs.org) for a Server Side Rendered Static Site
- 🎨 Integrated with [Tailwind CSS](https://tailwindcss.com) & [Ant Design](https://ant.design/)
- 🎉 Type checking [TypeScript](https://www.typescriptlang.org)
- ✏️ Linter with [ESLint](https://eslint.org) (default NextJS, NextJS Core Web Vitals and Airbnb configuration)
- 💡 Absolute Imports
- 🛠 Code Formatter with [Prettier](https://prettier.io)
- 🦊 Husky for Git Hooks
- 🚫 Lint-staged for running linters on Git staged files
- 🗂 VSCode configuration: Debug, Settings, Tasks and extension for PostCSS, ESLint, Prettier, TypeScript
- 🤖 SEO metadata, JSON-LD and Open Graph tags with Next SEO

### Requirements

- Node.js and npm or yarn

### Getting started

Run the following command on your local environment:

```
git clone  ... my-project-name
cd my-project-name
yarn install
```

### Credentials Required

Your browser will require the Keplr Chrome extension, downloadable [here.](https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en)

Create a .env.local file in your root folder: 

```
NEXT_BASE_URL=http://localhost:3000
PLAID_CLIENT_ID=your_client_id
PLAID_URL_SANDBOX=sandbox.plaid.com
PLAID_SECRET_KEY_SANDBOX=your_sandbox_key

COINBASE_CLIENT_ID=your_client_Id
COINBASE_CLIENT_SECRET=your_client_secret
COINBASE_BASE_AUTHORIZE_URL=https://www.coinbase.com/oauth/authorize
COINBASE_ACCESS_TOKEN_URL=http://www.coinbase.com/oauth/token
BACKEND_BASE_URL=https://dev-scrt-sybil-backend.herokuapp.com
COINMARKET_KEY=your_coinmarketcapapikey
NEXT_PUBLIC_MAINNET_API_URL=https://secret-4--lcd--full.datahub.figment.io/apikey/6f3333914b9755607855cdc5efb0b341/


```

You will need to create an account on [Plaid](https://dashboard.plaid.com/) OR [Coinbase](https://developers.coinbase.com/) in order to receive client ids and client secrets for your api. 


Then, you can run locally in development mode with live reload. Ensure you run this command after `cd` into the local folder where you cloned the repo.



```
yarn dev
```

Open http://localhost:3000 with your favorite browser to see your project.

note: you will want to get some testnet tokens in your wallet, which you can get [here](https://faucet.secrettestnet.io/). Make sure you select the pulsar-2 network from the keplr dropdown. 

### Deploy to production

You can see the results locally in production mode with:

```
$ yarn build
$ yarn start
```

The generated HTML and CSS files are minified (built-in feature from Next js). It will also removed unused CSS from [Tailwind CSS](https://tailwindcss.com).

You can create an optimized production build with:

```
yarn build-prod
```


### License

Licensed under the MIT License, Copyright © 2022

---


Credits to [ixartz](https://github.com/ixartz/Next-js-Boilerplate) for the NextJS boilerplate
