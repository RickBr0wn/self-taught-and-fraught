---
title: publish a react custom hook on npm
date: 2019-11-27 20:10:16
category: react
draft: true
---

Before we start, I am assuming you have an account with npm. If not follow [these](<[https://docs.npmjs.com/creating-a-new-npm-user-account](https://docs.npmjs.com/creating-a-new-npm-user-account)>) instructions, before starting this tutorial.

Now lets create our custom hook package:

`npx create-react-hook`

This will start the CLI. To avoid any naming issues, we will prefix the `Package Name` with our npm username, for example, I will call this package: `@rickbrown/use-star-wars-quotes`. This prefix sets the package as [scoped](<[https://docs.npmjs.com/about-scopes](https://docs.npmjs.com/about-scopes)>), something which we will fix later.

The rest of the CLI, should all be self-explanatory.

The CLI will then run yarn (to install all the required dependencies), set up all the boilerplate code, create an example folder so we can provide a working example of our custom hook & yarn link, so we can test that working example in the example folder.

When the CLI has finished we should we open the project in code favorite code editor

```bash
code .
```

Now the boilerplate is quite weighty, but all we need to concern ourselves with is:

- dist - This is where [roll-up](<[https://rollupjs.org/guide/en/](https://rollupjs.org/guide/en/)>) will bundle all of our output.
- example - This is a stand-alone [create-react-app](<[[https://www.npmjs.com/package/create-react-app](https://www.npmjs.com/package/create-react-app)]>), that we can use to demonstrate and test our hook locally. Its important to realise that it has both its own `package.json`, and `.test.js` file. Note: for the duration of this blog post i will refer to create-react-app as CRA.
- src - This is the source folder for our custom hook.

To get this running, we're going to need a console with 2 tabs.

- Tab 1 - navigate to the root folder of the project (i'll be calling that `{root}/` from now on), and type `yarn && yarn start`. You will see roll-up doing it's thing and end up looking something like this: IMAGE#2
- Tab 2 - navigate to the root folder, and type `cd example && yarn && yarn start`. This will then start the example CRA.

You should now see the default custom hook being displayed at `localhost: 3000`, which in this case should be a counter counting up in seconds.

So lets edit that custom hook, grab the one we wrote in a [previous blog post](<[]()>), and copy and paste it over the top of the contents of the`{root}/src/index.js` file.

Then in the `{root}/example/src/App.js` file you can test/demonstrate your hooks api. Here is a basic example:

    // example/src/App.js
    import  React  from  'react';
    import { useStarWarsQuote } from  '@rickbrown/use-star-wars-quote';

    const  App  = () => {
    	const { quote, loading } =  useStarWarsQuote();
        return  <div>{loading ? <p>loading..</p> : <p>{quote}</p>}</div>;
    };

    export default  App;

Now it is important that we restart roll-up in `tab 1` so it can re-bundled the new code that we pasted in, and then restart the CRA in `tab 2`, and bingo! We should see a quotation from the star wars films in our browser on `localhost: 3000`. Yes it looks terrible, but this is about the re-useability and publishing of our custom hooks, and not a deep dive in css. So that part is up to you.

So lets now test this hook. For this we will use the amazing [react-hooks-testing-library](<[https://www.npmjs.com/package/@testing-library/react-hooks](https://www.npmjs.com/package/@testing-library/react-hooks)>). We will also install React as a dev-dependency. To get started, lets just follow the documentation, but instead of `npm` as they suggest, I am going to use yarn and the `current` latest package versions. These packages are to be added to the package.json file located in `{root}/` and **not** `{root}/example/`

```bash
  yarn add -D react@16.12.0 @testing-library/react-hooks react-test-renderer@16.12.0
```

Now if we run `$ yarn test`, we will get an error referencing eslint. I must be honest, why this happens is a mystery to me, but can be easily solved by following the instructions given by the error. All of these actions take place in the `{root}` directory.

- Delete the `yarn.lock` file.
- Delete the `node_modules` folder.
- Remove the line `"eslint": "5.16.0",` from the `package.json` file.

When this is complete type `$ yarn` and yarn will re-install the required dependencies and the error will go.. Except of course, the dev life isn't that easy.

We will now face another error, when typing `$ yarn test`, stating:

```bash
  No tests found, exiting with code 1
  Run with `--passWithNoTests` to exit with code 0
```

This ones easy though. Our test runner, Jest is simply looking for files that end `.test.js` or `.spec.js`. So lets simply rename `{root}/src/test.js` to `{root}/src/useStarWarsQuote.test.js`, and before once again running the `$ yarn test` command prepare ourselves for another incomming error, that our test is obviously going to fail, because we no longer have a test called `useMyHook`. But we do now know that we can run tests. 🤓

So lets change our `{root}/src/useStarWarsQuote.test.js` file to read:

    // src/useStarWarsQuote.test.js
    import { renderHook, cleanup } from  '@testing-library/react-hooks';
    import { useStarWarsQuote } from  './';

    afterEach(cleanup);

    describe('useStarWarsQuote', () => {
        it('should return an object with the keys: quote, loading', () => {
    	    const { result } =  renderHook(() =>  useStarWarsQuote());
    	    expect(result.current).toHaveProperty('loading');
    	    expect(result.current).toHaveProperty('quote');
    		expect(result.current).not.toBe(undefined);
    	});

        it('should set loading to true after initial call', () => {
    	    const { result } =  renderHook(() =>  useStarWarsQuote());
    	    expect(result.current.loading).toBe(true);
    	});

        it('should return a quote and set loading to false', async () => {
    	    const { result, waitForNextUpdate } =  renderHook(() =>  useStarWarsQuote());
    	    await  waitForNextUpdate();

    	    expect(typeof result.current.quote).toBe('string');
    	    expect(result.current.quote).not.toBe(null);
    	    expect(result.current.quote).not.toBe('');
    	    expect(result.current.loading).toBe(false);
        });
    });

Obvioulsy, if you are using your own custom hook, you'll need to supply tests relevant for your hook. Again, this is about deployment and publishing your custom hook. I will soon point to another blog post on testing cutom hooks, using react-hooks-testing-library. But, for now, back to the point in hand..

Now lets prepare the package before we deploy to npm. looking at `{root}/package.json` we can see the version is set at `1.0.0`, lets change . that back to `0.0.0`.
Now of course you can keep manually updating this figure everytime you update your hook, but I prefer using [npm-version](<[https://docs.npmjs.com/cli/version](https://docs.npmjs.com/cli/version)>), because it will also create a version commit and tag.

Now before we start this process, it is important that we start from a clean git working directory. So if you have not fully pushed all to github, now is the time to do so.

`npm-publish` is a really useful library, and I encourage you to read through the docs. Due to the increasing length of thi blob, I am going to move through it, without explaining. (If you want me to write a blog post about its functionality, let me know).

When your git working directory is clean, simply type `$ npm version major`.

As you can see, it now has adjusted the `{root}/package.json` file, to correctly show the version number, and a `$ git tag`, will return the current version number.

To facilitate this process a little easier, lets add a `postpublish` script, to our `{root}/package.json` file, which should look like this:

    "scripts": {
        // ..scripts
        "postpublish": "git push --tags"
    },

next change the:

    "peerDependencies": {
        "react": "16.8.6"
    },

to

    "peerDependencies": {
    	 "react": ">=16.8.6"
    }

and after `devDependencies` add `publishConfig`, like so:

    "devDependencies": {
    	// ...devDependencies
    },
    "publishConfig": {
        "access": "public"
    }

The reason for the `publishConfig` is that by default npm packages are set to `public` by default, but `scoped` packages (like we used in this example) are by default `private`.

Next we need to fix the README.md file. Looking at it, it is currently showing the api for the default hook that we deleted.

Go to `{root}/use-star-wars-quote/example/src/App.js` and copy the api from their and replace it into the relevant section in your README.md. This is important because when we publish (yes, we really are going to get there), npm will use this README.md on your package details page.

Now back to the command line. In order to publish our custom hook, we need to be logged in to npm, so:
`$ npm login`
then enter your login details for npm..

and finally.. `$ npm publish`. My completed custom hook can be seen [here](<[https://docs.npmjs.com/creating-a-new-npm-user-account](https://docs.npmjs.com/creating-a-new-npm-user-account)>)

> Written with [StackEdit](https://stackedit.io/).
