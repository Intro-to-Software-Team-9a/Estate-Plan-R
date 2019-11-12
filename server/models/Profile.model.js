const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Contains user information and is the thing that "owns" all the
 * documents and questionnaire responses.
 */

const ProfileSchema = new Schema({
  // ref of the corresponding account
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },

  // user information
  name: String,

  // permissions for the user
  role: {
    isUser: Boolean,
    isAdmin: Boolean,
  },

  // all templates owned by the user
  ownedTemplates: [{ type: Schema.Types.ObjectId, ref: 'Template' }],
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
