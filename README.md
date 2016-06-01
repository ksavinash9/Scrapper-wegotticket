Simple Node.js Scrapper
===================

This nodejs app scraps www.wegottickets.com/searchresults/all for event details.

## Usage

Installation
-----------
```sh
$ npm install
```

Running
-----------
```sh
$ node scrap.js 
$ node scrap.js 2
```

Testing
-----------
```sh
$ mocha test
```
![testing-image](https://raw.githubusercontent.com/swarnavinash/Scrapper-wegotticket/master/Mochaunitest.png)


## Specs

- [x] should scrap the total number of pages
- [x] should scrap all events-urls in a page
- [x] should scrap all the event details from the event-url page
- [x] should store the event details in mongodb
- [x] should output the event details in a json file - wegottickets.json
- [x] focus on the speed and asynchronous nature of the scrapper
- [x] Properly tested with mocha, chai, sinon, nock. 


The sitemap is returned as a JSON file in this format:

```json
"http://www.wegottickets.com/f/9998": {
  "artist": "99 CLUB LEICESTER SQUARE COMEDY - WED 1ST JUNE",
  "city": "London",
  "venue": "",
  "date": "Wed 1st Jun, 2016 Doors: 7:30pm  Starts: 8:30pm  Ends: 10:30pm",
  "price": "£9.90"
}
```

## References
1. [Website Scrapper](https://sitescraper.googlecode.com/files/sitescraper.pdf)