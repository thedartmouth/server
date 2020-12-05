import mongoose, { Schema } from 'mongoose'

const ArticleSchema = new Schema({
    _id: { type: String }, // slug of the article
    uuid: { type: String, unique: true }, // keep uuid in case
    associatedPolls: [{ type: Schema.Types.ObjectId, ref: 'Poll' }],
    viewedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // this.length = # views
    bookMarkedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // this.length = # bookmarks
    sharedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // may or may not need # shares per user
})

const ArticleModel = mongoose.model('Article', ArticleSchema)

export default ArticleModel
