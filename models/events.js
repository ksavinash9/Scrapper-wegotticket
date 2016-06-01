var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/mydb');

var eventSchema = new Schema({
    artist: String,
    city: String,
    venue: String,
    date: String,
    price: String
});

module.exports = mongoose.model('Event', eventSchema);