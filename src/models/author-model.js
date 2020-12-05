/* eslint-disable func-names */
import mongoose, { Schema } from 'mongoose'

const AuthorSchema = new Schema({
    _id: { type: String }, // in case this is ever convenient
    name: { type: String, index: true },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

// query helper to do case insensitive name lookup
AuthorSchema.query.byName = function (name) {
    return this.where({ name: new RegExp(`^${name}$`, 'i') })
}

const AuthorModel = mongoose.model('Author', AuthorSchema)

export default AuthorModel
