var async = require('async');
var cheerio = require('cheerio');
var fs = require('fs');
var request = require('superagent');
var mongoose = require('mongoose');

var config = require('./config.js');
var db = mongoose.createConnection(config.mongoDbPath);
var Event = require('./models/events')

/**
    ProcessDetailPage
    Function to process the Event-Detail Page and scrap the details of 
    events like artist, city, venue, date and price. 

    The Event-Details are stored in MongoDB using Event Models

    This function also appends the event details in /data/wegottickets.json file. 

    @author Swarn Avinash
    @param  url, callback

    @example - processDetailPage(url, cb)
*/
function processDetailPage(url, cb) {
    var id = url.split('/').pop();
    request
        .get(url)
        .end(function(err, res) {
            if (err) return console.error();
            if (res.status === 200) {
                console.log('Processing detail page : ', id);

                // Get the details from the page
                var $ = cheerio.load(res.text);
                var content = $('#Content div.content div.event-information')
                var price = $('#Content div.content div div div div strong') || $('div.content div.block-group div div div.diptych.right.text-right div strong')
                var venue = $('#Content div.EventLocation') || $(content).find('h2').text();
                var regex = /(\£\d+.\d+)/g;
                var info = {
                    artist: $(content).find('h1').text(),
                    city: $(content).find('.venue-details h2').text().split(' ')[0],
                    venue: $(venue).find('ul li:nth-child(1) p').text(),
                    date: $(content).find('.venue-details h4').text(),
                    price: $(price).text().match(regex)[0],
                }
                var res = {};
                res[url] = info;
                fs.appendFileSync(process.cwd() + config.dataPath + '.json', JSON.stringify(res));
                var newEvent = new Event(info);

                // save new book in MongoDB
                newEvent.save(function(err, savedEvent) {
                    if (err) {
                        console.log(err);
                    }
                });
                cb();
            }
        });
};

function processDetailUrls(urls, cb) {
    async.eachLimit(urls, config.maxConcurrent, processDetailPage, cb);
};

/**
    getLastListPage
    Utility function to get the last page index.
    
    @param  html

    @example - getLastListPage(html)
*/
function getLastListPage(html) {
    var $ = cheerio.load(html);
    return parseInt($('.pagination_link').last().text());
};

/**
    ProcessListPage
    Function Process the list page and scrap the link of events. 
    
    @author Swarn Avinash
    @param  html, callback

    @example - processListPage(html, cb)
*/
function processListPage(html, cb) {
    var $ = cheerio.load(html);

    var urls = [];

    var rowele = $('#Content div.content.block-group div h2 a').each(function(idx, ele) {
        var data = $(ele).attr('href');
        urls.push(data);
        // console.log("LINK DATA", data);
    });
    processDetailUrls(urls, function(data) {
        fs.appendFileSync(process.cwd() + config.dataPath + '.json', data);
        cb();
    });
};

/**
    LoadNextListPage
    Recursive function to scrap the next page and the link of events. 
    
    @author Swarn Avinash
    @param index, maxpages, callback

    @example - loadNextListPage(idx,maxpages,cb)
*/
function loadNextListPage(idx, maxpages, cb) {
    if(idx > maxpages) {
        cb();
    }
    var url = 'http://www.wegottickets.com/searchresults/page/' + idx + '/all';
    request
        .get(url)
        .end(function(err, res, callback) {
            if (err) return console.error();
            if (res.status === 200) {
                console.log("Page Index - ", idx);
                processListPage(res.text, function() {
                    idx += 1;
                    if (idx <= maxpages) {
                        setTimeout(loadNextListPage(idx, maxpages, cb), config.listThrottle * 1000);
                    } else {
                        cb();
                    }
                });
            }
        });
};

/**
    scrapper
    Entry point function of the module
    It checks for the default configuration and call the recursive function
    
    @author Swarn Avinash
    @param maxpages, callback

    @example - scrapper(maxpages, callback)
*/
function scrapper(maxpages, callback) {
    var lists_start = config.lists_start;
    maxpages = maxpages || config.lists_end;
    console.log("Scrapping Starts");
    loadNextListPage(lists_start, maxpages, function(callback) {
        console.log("Scrapping Completed");
        // process.exit();
    });
}

module.exports = {
    scrapper: scrapper
}