---
title: Webpack, React and Babel - 2020
date: 2020-04-14 23:04:87
category: webpack
draft: false
---

![](./images/webpack-react-babel-2020/aaron-burden-GFpxQ2ZyNc0-unsplash.jpg)

#

Create-React-App is a tremendous product, and really does help ease the new developer into the React framework. But there comes that time in every developers journey to branch out and learn the inner workings of a React project. It's actually easier than you would imagine.

## What you will learn

- Installation and setup of webpack.

- Installation and setup of babel.

- Installation of React.

- Bundling these files and presenting them in an HTML document.

- Installation and setup of webpack-dev-server.

- Installation and setup of loaders for things such as CSS files.

I will also try to offer links to short videos explaining the basic concepts of each section.

## Set up the project

Create a directory for the project:

```bash
mkdir webpack-react-babel-tutorial && cd webpack-react-babel-tutorial
```

Initialize the project by using:

```bash
npm init -y
```

## Set up webpack

> At its core, **webpack** is a _static module bundler_ for modern JavaScript applications. When webpack processes your application, it internally builds a [dependency graph](https://webpack.js.org/concepts/dependency-graph/) which maps every module your project needs and generates one or more _bundles_.

I found this [talk](https://youtu.be/Gc9-7PBqOC8) to be the most helpful, and insightful way to understand what webpack does "under the hood".

We will be installing everything as a dev dependency, because we won't be needing these packages in production. Let's start with:

```bash
yarn add -D webpack webpack-cli webpack-dev-server
```

Replace the "scripts" inside Package.json with:

```json
"scripts": {
  "build": "webpack --mode production"
},
```

## Setup Babel

> Babel is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards-compatible version of JavaScript in current and older browsers or environments. Here are the main things Babel can do for you:
>
> - Transform syntax
> - Polyfill features that are missing in your target environment (through [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill))
> - Source code transformations (codemods)
> - And more! (check out these [videos](https://babeljs.io/videos.html) for inspiration)

I found this [video](https://youtu.be/yLrNwo4wXOs), a neat way to explain the usage of Babel.

Install [babel](https://babeljs.io/docs/en/), [babel loader](https://github.com/babel/babel-loader) and the 2 presets that we are going to need:

- [babel preset env](https://babeljs.io/docs/en/babel-preset-env) for compiling modern Javascript to ES5
- [babel preset react](https://babeljs.io/docs/en/babel-preset-react/) for compiling JSX to Javascript

The babel-loader will receive our files, and return a `bundle.js.`

```bash
yarn add -D @babel/core @babel/preset-env @babel/preset-react babel-loader
```

Create a `.babelrc` file:

```bash
touch .babelrc
```

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

Create a minimal `webpack.config.js` file:

```bash
touch webpack.config.js
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
}
```

This is a very minimal webpack configuration file. But as webpack loops through all the files in our React App, any of those ending with a `.js` or `.jsx` extension will be passed through the `babel-loader`.

## Set up React

> React.js is an open-source JavaScript library that is used for building user interfaces specifically for single-page applications. It’s used for handling the view layer for web and mobile apps. React also allows us to create reusable UI components. React was first created by Jordan Walke, a software engineer working for Facebook. React first deployed on Facebook’s newsfeed in 2011 and on Instagram.com in 2012.
> React allows developers to create large web applications that can change data, without reloading the page. The main purpose of React is to be fast, scalable, and simple. It works only on user interfaces in the application. This corresponds to the view in the MVC template. It can be used with a combination of other JavaScript libraries or frameworks, such as Angular JS in MVC.

Install React and ReactDOM:

```bash
yarn add -D react react-dom
```

Create directory structure:

```bash
mkdir src && cd src
touch index.js
mkdir components && cd components
touch App.js
```

```js
// src/index.js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

ReactDOM.render(<App />, document.getElementById('container'))
```

```js
// src/components/App.js
import React from 'react'

const App = () => <h1>Webpack, React & Babel</h1>

export default App
```

Webpack expects the `entry point` to be `src/index.js`.

Build the project:

```bash
yarn build
```

We can now see the `dist` folder in the root of our project that contains our `main.js`, which is our bundled code.

## Set up HTML weback plugin

To view our React app in the browser, it must first be presented inside an HTML document.

Install and configure the HTML webpack plugin:

```bash
yarn add -D html-webpack-plugin html-loader
```

```javascript
// webpack.config.js
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
  ],
}
```

Navigate back to the `root` of the project, then:

```bash
mkdir public && cd public
touch index.html
```

```html
<!-- ./public/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Webpack, React and Babel 2020</title>
  </head>
  <body>
    <div id="container"></div>
  </body>
</html>
```

Navigate back to the `root` of the project, then:

```bash
yarn build
```

You will now see an `index.html` in your `dist` folder.

## Set up webpack-dev-server

Add this line to the `"scripts"` section in the `package.json` file:

```json
"start": "webpack-dev-server --config ./webpack.config.js --mode development",
```

```bash
yarn start
```

Your project is now served on a development web server and is ready to be consumed.

In the browser:

```http
http://localhost:8080
```

If you now edit the code, you will see in the terminal that webpack rebuilds the project, and updates the browser in "real-time".

If like me, you prefer `port 3000`, as per `create-react-app` specifications, and you find all that noise in the terminal off-putting, you can add this to the `webpack.config.js` file:

```javascript
// webpack.config.js
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  devServer: {
    stats: {
      colors: true,
      hash: false,
      version: true,
      timings: true,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: true,
      publicPath: false,
    },
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
  ],
}
```

## Set up CSS

Add a CSS file in the `./src` directory:

```bash

cd src && touch styles.css
```

```css
/* ./src/styles.css */
@import url('https://fonts.googleapis.com/css?family=Roboto:100,200,400,500,700');

\*,
\*::before,
\*::after {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

html {
  box-sizing: border-box;
  font-size: 62.5%;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 1.6rem;
  background-color: #eceff1;
}
```

Install new loaders to handle CSS files and urls:

```bash
yarn add -D css-loader style-loader url-loader
```

```javascript
// webpack.config.js
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  devServer: {
    stats: {
      colors: true,
      hash: false,
      version: true,
      timings: true,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: true,
      publicPath: false,
    },
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
  ],
}
```

Return to the root directory:

```bash

yarn && yarn start

```

Voila! You have a reusable webpack bundled, babel compiled, React project. Like all good developers, we are going to hoist it up to git hub. So we can re-use it countless times.

I hope you learned something along the way, thanks for reading. Please reach out and contact me if you have any questions about this post, or you if think we can work together.

The full project can be seen [here](https://github.com/RickBr0wn/webpack-react-babel)

##### ✏️ [Rick Brown]()

##### 📷 [Aaron Burden](https://unsplash.com/@aaronburden?utm_source=unsplash)
