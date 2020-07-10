import mongoose, { Schema } from 'mongoose';

const PollSchema = new Schema({
  question: { type: String },
  answers: { type: Map },
  associatedArticle: { type: String, ref: 'Article'}, // default: "" in case there is no associated article 
  usersVoted: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  created_at: { type: Date, default: Date.now() },
});

const PollModel = mongoose.model('Poll', PollSchema);

export default PollModel;
