var mongoose = require('mongoose');
var Event = require('../models/events');
var config = require('../config');
var mocha = require('mocha');
var chai = require('chai');
var sinonChai = require("sinon-chai");
var sinon = require('sinon');
var fs = require('fs');

chai.use(sinonChai)
var expect = chai.expect;

var db = mongoose.createConnection(config.mongoDbPath);



describe('Test Scrapper Database -', function() {

    beforeEach(function() {
        sinon.spy(console, 'log');
    });

    afterEach(function() {
        console.log.restore();
    });

    it('should be able to store event', function(done) {
        info = {
            "artist": "ALLO",
            "city": "BIRKENHEAD:",
            "venue": "BIRKENHEAD: The Little Theatre",
            "date": "WED 1ST JUN, 2016 7:00pm",
            "price": "£8.00"
        }
        var newEvent = new Event(info);
        newEvent.save(function(err, savedEvent) {
            if (err) {
                console.log(err);
            }
            done();
        });
    });
    it('should not be able to store irregular data', function(done) {
        info = {};
        var newEvent = new Event(info);
        newEvent.save(function(err, savedEvent) {
            if (err) {
                console.log(err);
            }
        });
        done();
    });
    it('should be able to find the stored event Mongo', function(done) {
        Event.findOne({
            "artist": "ALLO"
        }, function(err, event) {
            if (err) {
                console.log(err);
            }
            expect(event).to.be.an('object');
            expect(event).to.exist;
            done();
        });
    });
    it('should be able to find the count of stored events', function(done) {
        Event.count({
            "artist": "ALLO"
        }, function(err, event) {
            if (err) {
                console.log(err);
            }
            expect(event).to.exist;
            expect(event).to.be.above(0);
            done();
        });
    });

    it('should be able to update the stored events', function(done) {
        info = {
            "artist": "ALLO",
            "city": "BIRKENHEAD:",
            "venue": "BIRKENHEAD: The Little Theatre",
            "date": "WED 1ST JUN, 2016 7:00pm",
            "price": "£8.00"
        }
        query = {
            "artist": "ALLO"
        }
        var newEvent = new Event(info);
        Event.update(query, {
            "artist": "ALLO",
            "city": "LONDON"
        }, function(err, event) {
            if (err) {
                console.log(err);
            }
            expect(event).to.exist;
            expect(event).to.have.any.keys('ok', 'n');
            done();
        });
    });

    it('should be able to remove the stored events', function(done) {
        query = {
            "artist": "ALLO",
            "city": "BIRKENHEAD:",
            "venue": "BIRKENHEAD: The Little Theatre",
            "date": "WED 1ST JUN, 2016 7:00pm",
            "price": "£8.00"
        }
        Event.update(query, {
            $unset: {
                field: 1
            }
        }, function(err, event) {
            if (err) {
                console.log(err);
            }
            expect(event).to.exist;
            expect(event).to.have.any.keys('ok', 'n');
            done();
        });
    });

});