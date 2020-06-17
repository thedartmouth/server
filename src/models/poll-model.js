import mongoose, { Schema } from 'mongoose';

const PollSchema = new Schema({
  question: { type: String },
  answers: {
    type: Map,
    of: { type: Number, default: 0 },
  },
  associated_article: { type: Schema.Types.ObjectId, ref: 'Article' },
  usersVoted: [{ type: Schema.Types.ObjectID, ref: 'User', unique: true }],
  created_at: { type: Date, default: Date.now() },
});

const PollModel = mongoose.model('Poll', PollSchema);

export default PollModel;
