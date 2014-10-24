#!/bin/bash

case $CIRCLE_NODE_INDEX in
  0) export API_ENV=staging; LONG=1 npm test ;;
  1) export API_ENV=production; LONG=1 npm test ;;
esac

