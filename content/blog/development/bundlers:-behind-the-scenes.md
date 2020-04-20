---
title: 'Bundlers: behind the scenes'
date: 2020-04-19 02:04:25
category: webpack
thumbnail: { thumbnailSrc }
draft: true
---

![](./images/bundlers/bundlers.jpg)

Webpack, Roll-Up, Parcel to name a few are invaluable tools when it comes to Javascript frameworks. In this post I hope to help clarify whats going on behind the scenes.

This blog post is taken from a talk that I watched in reference to webpack. The code shown here is from the talk, and I make no claim to it. I really did enjoy watching the talk, and felt like I wanted to see it written down. So here goes.

> Bundlers work with all Javascript frameworks. In this post I will reference their relationship to React, but the principles will be the same for any frontend framework that you choose.

## What is a bundler?

When we write code in React, we tend to break our components down into individual files, or modules. This is dependent on the `lodash` module:

```js
import _ from 'loadash'
```

And this is what we expose from our module:

```js
export default myComponent
```

We need a bundler to take all of these dependencies and exposures and create a map of the project with a link of all the required dependences.

The same can be true with `commonJS` or node:

```js
const _ = require('loadash')

module.exports = someValue
```

## Entry Point

The bundler starts from an entry file. This entry is supplied by us, and is its start point. It starts by reading the entry file, and determining which dependencies and exposures this file has. It then moves through each of these dependencies in that file, mapping out their depencies and exposures. It continues this process recursively until it has created a complete dependency graph for the enitre project.

## Implementation Overview

- Parse a single file and extract its dependencies.
- Recursively build a dependency graph.
- Package everything into a single file.

## Set up the project

From a clean working directory:

```bash
mkdir my-simple-bundler && cd my-simple-bundler
```

Create the base files which we will be bundling together:

```bash
touch entry.js && touch message.js && touch name.js
```

Edit each file:

```js
// entry.js
import message from './message'

console.log(message)
```

```js
// message.js
import { name } from './name'

export default `hello ${name}!`
```

```js
// name.js
export const name = 'world'
```

## Dependencies

This application might be tiny, but it perfectly demonstrates one file having a dependency with a file it doesn't reference.

- `entry.js` has a dependency of `message.js`.

- `message.js` has a dependency of `name.js`.

- indirectly `entry.js` has a dependency of `name.js`.

## Implement a simple bundler

Create a single file to holder our bundler:

```bash
touch bundler.js
```

```js
const fs = require('fs')

function createAsset(file) {
  const content = fs.readFileSync(file, 'utf-8')
  console.log(content)
}

createAsset('./entry.js)
```

If we run:

```bash
node bundler.js
```

We see the text output of our `entry.js` file in the console. We did this by using a library built into node library called `fs`. More can be read [here](https://nodejs.org/api/fs.html#fs_file_system). We pass the [readFileSync](https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options) function two parameters, the file itself and `utf-8` which simply requests a `string`.

So now we can read our entry file. Next we need to work out which dependencies this entry file has.

TODO: @6m:35secs

We pass the bundler a filename, and we intend to extract data out of it.

The full project can be seen [here](https://github.com/RickBr0wn/webpack-react-babel)

##### ✏️ [Rick Brown](https://github.com/RickBr0wn)

##### 📷 [Kelly Sikkema](https://unsplash.com/@kellysikkema)
