# Anyfetch high-level functional tests
![Build Status](https://circleci.com/gh/AnyFetch/anyfetch-test.png?circle-token=9188c634889764c48de9c9bfa823bb7cf45aba36
Here at Anyfetch, we enjoy providing the best user experience.
All our projects are thoroughly tested on [Travis](https://travis-ci.org/) after each push, and we aim to keep our test-suite as exhaustive as can possibly be. Heck, we even provide [mock servers](https://github.com/AnyFetch/anyfetch.js#helper-functions) to check your libraries locally!

However, sometimes testing a single codebase is not enough.
We also need to check the ops worked, everything is deployed and available on the Internet, that our cluster is securely running or simply that differents pieces of different repos in different data-centers interact properly.

Introducing this repo.

## How to use?
You'll need to set your own credentials using `CREDENTIALS=base64encoded`. This will create a [subcompany](http://developers.anyfetch.com/guides/tutorials/subcompanies.html) in your account, and remove it after the test.

A simple `npm test` can do the trick.

You may use `API_ENV=(dev|production|staging)` to select the env you wish to test.

### As a crontab...
The `bin/test.js` script can be used as a cron task.
You should then specify a `FLOWDOCK` env variable to send a notification to your Flowdock.
