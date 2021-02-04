#!/bin/bash
/home/ubuntu/.nvm/versions/node/v14.15.4/bin/node ~/sales-rack-puppeteer/index.js

# Every hour in crontab via this script
# 0 * * * * ~/sales-rack-puppeteer/init_scrape.sh
# Every 10 mins - direcly
# */10 * * * * /home/ubuntu/.nvm/versions/node/v14.15.4/bin/node ~/sales-rack-puppeteer/