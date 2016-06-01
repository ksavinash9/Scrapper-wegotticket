var scrap = require('../scrapper');
var mocha = require('mocha');
var chai = require('chai');
var sinonChai = require("sinon-chai");
var sinon = require('sinon');
var fs = require('fs');

chai.use(sinonChai)
var expect = chai.expect;

describe('Test Scrapper -', function() {

    beforeEach(function() {
        sinon.spy(console, 'log');
    });

    afterEach(function() {
        console.log.restore();
    });

    it('should create the file for storing scrapped data"', function(done) {
        scrap.scrapper(1);
        expect(fs.existsSync(process.cwd() + '/data/wegottickets.json')).to.be.true;
        done();
    });

    it('should log "Scrapping Starts"', function(done) {
        scrap.scrapper(1, function(err) {
            expect(console.log).to.be.called;
            expect(console.log.calledWith("Scrapping Starts")).to.be.true;
        });
        expect(fs.existsSync(process.cwd() + '/data/wegottickets.json')).to.be.true;
        done();
    });

    it('should expect a timeout for invalid maxpage value', function(done) {
        scrap.scrapper(-99, function(err) {
            expect(console.log).to.have.been.calledWith("request failed: Error: getaddrinfo ENOTFOUND");
            this.timeout(5000);
            setTimeout(done, 5000);
        });
        done();
    });

});