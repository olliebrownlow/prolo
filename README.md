<img src="./public/prolo_breathe_video_10.gif" alt="drawing" width="300"/>

## Quick Start Instructions

```
git clone 
cd prolo
touch .env.local // add your Magic API keys in your env variables
yarn install
yarn dev // starts app in http://localhost:3000
```

## Introduction

Simple crypto-currency profit/loss tracker. Does not rewuire any linking up with your real wallet or exchange transactions.

## File Structure

```txt
├── README.md
├── components
│   ├── email-form.js
│   ├── header.js
│   ├── layout.js
│   ├── loading.js
│   └── social-logins.js
├── config
│   └── navButtons.js
├── lib
│   ├── UserContext.js
│   └── magic.js
├── package.json
├── pages
│   ├── _app.js
│   ├── _document.js
│   ├── api
│   │   └── login.js
│   ├── balances.js
│   ├── callback.js
│   ├── index.js
│   ├── login.js
│   ├── settings.js
│   └── trades.js
├── public
│   └── (images)
└── yarn.lock
```
