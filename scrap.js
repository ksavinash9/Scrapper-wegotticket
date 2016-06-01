/*
    Wrapper class to consume the Scrapper module.
    This is a simple console Wrapper which handles
    the number of pages to scrap
*/
var scrape = require("./scrapper");

/* 
Set default value for number of pages to scrap. 
*/
var maxPages = 10;
if (process.argv.length >= 2 && parseInt(process.argv[2]) > 0) {
    maxPages = process.argv[2];
}

scrape.scrapper(maxPages);