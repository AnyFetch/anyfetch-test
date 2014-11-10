#!/bin/bash

case $CIRCLE_NODE_INDEX in
  0)  export API_ENV=staging
      node bin/status
      export LONG=1
      export VERBOSE=1
      npm test
      ;;
  1)  export API_ENV=production
      node bin/status
      export LONG=1
      export VERBOSE=1
      npm test
      ;;
esac

