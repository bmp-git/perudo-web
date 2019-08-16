var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
var Schema = mongoose.Schema;

var HistoryRecord = new Schema({
    date: {
        type: Date,
        require: true
    },
    rank: {
        type: Number,
        required: 'The rank is required'
    },
    plays: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('HistoryRecord', HistoryRecord);


var RankHistorySchema = new Schema({
    user_id: {
        type: String,
        unique : true,
        required: 'The user_id is required'
    },
    history: [HistoryRecord]

});
RankHistorySchema.plugin(uniqueValidator);

module.exports = mongoose.model('RankHistory', RankHistorySchema);
