# Anyfetch high-level functional tests

Here at Anyfetch, we enjoy providing the best user experience.
All our projects are thoroughly tested on [Travis](https://travis-ci.org/) after each push, and we aim to keep our test-suite as exhaustive as can possibly be. Heck, we even provide [mock servers](https://github.com/Papiel/anyfetch.js#helper-functions) to check your libraries locally!

However, sometimes testing a single codebase is not enough.
We also need to check the ops worked, everything is deployed and available on the Internet, that our cluster is securely running or simply that differents pieces of different repos in different data-centers interact properly.

Introducing this repo.

## How to use?
A simple `npm test` can do the trick.

If you want to test staging API, you'll need to set `API_URL=http://staging.api.anyfetch.com`. You can also set your own credentials using `CREDENTIALS=base64encoded`.

### As a crontab...
The `bin/test.js` script can be used as a cron task.
You should then specify a `FLOWDOCK` env variable to send a notification to your Flowdock.
