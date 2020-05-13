import mongoose, { Schema } from 'mongoose';

const PollSchema = new Schema({
  question: {type: String},
  answers: [
    {
      text: "",
      count: 0,
    }
  ],
  associated_article: {type: Schema.Types.ObjectId, ref: 'Article' },
  created_at: {type: Date, default: Date.now()},
});

const PollModel = mongoose.model('Poll', PollSchema);

export default PollModel;
