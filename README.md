# Anyfetch high-level functional tests

Here at Anyfetch, we enjoy providing the best user experience.
All our projects are thoroughly tested on [Travis](https://travis-ci.org/) after each push, and we aim to keep our test-suite as exhaustive as can possibly be. Heck, we even provide [mock servers](https://github.com/Papiel/anyfetch.js#helper-functions) to check your libraries locally!

However, sometimes testing a single codebase is not enough.
We also need to check the ops worked, everything is deployed and available on the Internet, that our cluster is securely running or simply that differents pieces of different repos in different data-centers interact properly.

Introducing this repo.

## What's the point?
* Checking every provider is up and running,
* Checking every hydrater is up and running,
* Checking the api is up and running,
* Checking complex hydration dependencies are properly executed
* Checking complex endpoints react properly.
