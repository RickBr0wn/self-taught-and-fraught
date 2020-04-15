---
title: promise api
date: 2019-11-27 22:26:46
category: javascript
draft: true
---

This post is going to be a fairly deep dive into the Promise API in javascript. Again, as are all of my blog posts, they are a way of me learning a subject. Once I've written a blog post on what I just learned, I know that I just learned it.
So, to begin, let us describe the problem the Promise API fixes. Let imagine we are building an app, and we require some user details from an external REST_API. We want to make a call to the API and return the result. Now, let us remember that HTTP requests are asynchronous and do not return the required data immediately. The time a function takes to run is a matter of milliseconds, whereas an HTTP request takes much longer. Rather than building a REST API for this example, let us mock a REST_API call with this basic function.

```javascript
function fakeApiCall() {
  setTimeout(() => {
    return { name: 'Rick', location: 'UK' }
  }, 3000)
}

const data = fakeApiCall()

console.log(data)
```

So this fakeApiCall function is simply a function that after 3 seconds (3000 milliseconds) returns a javascript object, with the keys name and location. Which is a good (although exaggerated) demonstration of the time delay when making a call to an external REST_API and awaiting the response. So what happens when we run the code above? The value of data is undefined and not the javascript object that we expected.
So before Promises, the way to solve this was to use a callback function. Let us add a callback function to our fakeApiCall function:

```javascript
function fakeApiCall(callback) {
  setTimeout(() => {
    const data = { name: 'Rick', location: 'UK' }
    callback({ name: 'Rick', location: 'UK' })
  }, 3000)
}

const data = fakeApiCall(function () {
  console.log(res)
})

data && console.log(data)
```

What did we do? In the function declaration, we added a callback parameter, allowing our fakeApiCall function to accept a function as a parameter. Inside of the setTimeout block, we called the callback function with our response. Remember, this callback only fires once the asynchronous action has resolved. When we call the fakeApiCall function in the returnedData declaration, we add an anonymous function (although it can be a named function too) which handles the response. And lastly, we added a && operator, which in this use case means, 'when the expression on the left (returnedData) returns true' then console.log(returnedData).
Using this pattern, we can now handle not only the response but with a little more code; we can also handle any errors that may occur. Many errors can occur when obtaining data from REST_API, such as network errors or connection errors. Lets fake an error, by setting data to false and then handle it.
const fakeApiCall = function(callback) {
setTimeout(() => {
const data = false
if (data) {
callback(null, data)
} else {
callback("there has been a network error!", null)
}
}, 3000)
}

const returnedData = fakeApiCall(function(err, res) {
if (err) {
throw new Error(err)
}
console.log(res)
})

returnedData && console.log(returnedData)
Let's go through what we changed. Inside of the fakeApiCall function, we added a conditional statement, that if data is true, it fires the callback function with no 'err' as the first parameter and the 'data' as the second. But if data returns false (and we change it to false, to force the error), it fires the callback function with an error (in this case a string) as the first parameter, and null in the second.
Then in the anonymous callback function passed to the returnedData function, we add another conditional to 'throw a new Error', in the case of there being an error (error === true).
Running this code should now display in the console.log Error: there has been a network error!.
This pattern works exactly the way we require. But what about if we needed to make a second API call inside of the first one. Then a third one inside of the second, to stall the data for 9 seconds. Things can get out of hand pretty quickly, so much so that the pattern is known as 'callback hell'. Imagine this contrived example:
const returnedData = fakeApiCall(url, function(err, res) {
if (err) {
throw new Error(err)
}
fakeApiCall(res, function(secondErr, secondRes) {
if (secondErr) {
throw new Error(err)
} else {
fakeApiCall(secondRes, function(thirdErr, thirdRes) {
if (thirdErr) {
throw new Error(err)
} else {
// This will take 9 seconds to fire 🔥
console.log(thirdRes)
}
})
}
})
})

So if callback hell is the problem, how do Promises in javascript provide the answer? Let's write another example, but this time using the built-in fetch API bundled in javascript. The fetch method returns a promise object; we can prove that here:
const userPromise = fetch('https://jsonplaceholder.typicode.com/users/1')

console.log(userPromise)
// returns : Promise {status: "pending"}
Now is a good time to briefly look at the three states that a Promise object can be, this snippet is from MDN:
pending: initial state, neither fulfilled nor rejected.
fulfilled: meaning that the operation completed successfully.
rejected: meaning that the operation failed.
In our console.log example above, we can see the Promise, with its status of pending. If the status is either fulfilled (resolved) or rejected (error) the promise is regarded as settled. Once the status is 'settled' it remains settled permanently, and its status (resolved or rejected) cannot be changed.
So lets use the response promise:
const userPromise = fetch('https://jsonplaceholder.typicode.com/users/1')

userPromise.then(resolve => {
console.log(resolve)
})

console.log(userPromise)
Now we can see the response in the console, but we now need to parse the response object that we have into a JSON object. This can be done with the .json() method. The .json() method actually returns a promise too:
const userPromise = fetch('https://jsonplaceholder.typicode.com/users/1')

userPromise.then(resolve => {
return resolve.json()
})

console.log(userPromise)
With the second promise we can now build a promise chain and use a second .then():
const userPromise = fetch("https://jsonplaceholder.typicode.com/users/1")

userPromise
.then(resolve => resolve.json())
.then(jsonObj => console.log(jsonObj))

console.log(userPromise)
The use of ES2016 arrow functions explicit return means we can clean the code. As you can see the promise chain is very readable. This .then() block is known as a fulfilment handler. It is essential to realise that whatever returns from the first fulfilment handler becomes the parameter for the next fulfilment handler, and so on. This looping is why it is called a promise chain. Running the code above should show a user from the JSONPlaceholder API.
Lets now create an error by polluting the URL, and it returns to its pending state. We haven't handled the rejected status:
// added 'XXXX' to the url
const userPromise = fetch("https://jsonplaceholder.typicode.com/useXXXXrs/1")

userPromise
.then(resolve => resolve.json())
.then(data => console.log(data))

console.log(userPromise)
// returns : Promise {status: "pending"}
Because the initial fulfilment handler only handles the fulfilled status, the promise remains pending when there is an error. When we called the initial fulfilment handler we used 'resolve' as a parameter, this is an 'onFulfilled' handler. Still, there is also an 'onRejection' handler too, which returns the reason for the rejection. Let's use it to handle our error by calling it error:
