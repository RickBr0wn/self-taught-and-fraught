---
title: async-await
date: 2019-12-11 22:45:16
category: javascript
draft: true
---

Let us start with an uncomplicated example. This function when given a GitHub username, will return the real name and the location of that user.

```javascript
function showGitHubUser(username) {
  const url = `https://api.github.com/users/${username}`

  fetch(url)
    .then((res) => res.json())
    .then((user) => {
      console.log(user.name)
      console.log(user.location)
    })
}

showGitHubUser('RiCKBR0WN')
```

So lets convert this to use the `async` and `await` keywords.

The `async` keyword tells the javascript engine that this function is going to be asynchronous and enables us to use the `await` keyword. The `await` keyword pre cedes a `promise` and always waits for it be be `settled`.

> It is important to remember you can only use the `await` keyword inside of an `async` function.

```javascript
async function showGitHubUser(username) {
  const url = `https://api.github.com/users/${username}`

  const result = await fetch(url)
  const user = await result.json()
  console.log(user.name)
  console.log(user.location)
}

showGitHubUser('RiCKBR0WN')
```

So in our example, using `await` with the `fetch` promise, pauses further execution of the code until the `fetch` promise has either `resolved` or `rejected`, and then passes that into the placeholder `result`. It can then, and only then advance to the next line of code. This then runs, and (more importantly) reads just like `synchronous` code.
The second `await` does exactly the same. We use it here too, because like `fetch`, the `.json()` method also returns a promise.

Now lets alter our code to just return the `user` so that the consumer (let's imagine a larger codebase) can use the whole `user` object, and console.log the return value from our function.

```javascript
async function showGitHubUser(username) {
  const url = `https://api.github.com/users/${username}`

  const result = await fetch(url)
  const user = await result.json()
  return user
}

console.log(showGitHubUser('RiCKBR0WN'))
```

Did you expect to see an object in the console? It is important to realise that an `async` function **always** returns a `promise`. And as a promise, as we have already learned, it is then "then-able", and from there we can build a `.then()` chain.

```javascript
async function showGitHubUser(username) {
  const url = `https://api.github.com/users/${username}`

  const result = await fetch(url)
  await result.json()
  return user
}

showGitHubUser('RiCKBR0WN').then((user) => {
  console.log(user.name)
  console.log(user.location)
})
```

Now this code will work, but what if there is a network error or we change the url to something unobtainable like:

```javascript
const url = `https://api.github.com/us55555ers/${username}`
```
