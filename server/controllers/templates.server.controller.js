const mongoose = require('mongoose');
const Template = require('../models/Template.model');
const Profile = require('../models/Profile.model');
const errors = require('../utils/errors');

/** Returns a list of all templates */
async function get(req, res) {
  try {
    const templates = await Template.find().exec();
    return res.send({ templates });
  } catch (error) {
    res.status(500);
    return res.send({ message: errors.other.UNKNOWN });
  }
}

/** Adds a template to the database. */
async function add(req, res) {
   if (!req.body || !req.body.fileName || !req.body.buffer) {
    res.status(400);
    return res.send({ message: errors.other.MISSING_PARAMETER });
  }

  var templateTitle = req.body.fileName;

  var template = await Template.findOne({
    title: templateTitle
  }).exec();

  var msg = 'TEMPLATE_UPDATE';

  if (!template) {
    template = new Template();
    template.title = req.body.fileName;
    msg = 'TEMPLATE_CREATE';
  }

  template.template = req.body.buffer;
  template.priceInCents = 5;
  await template.save();

  res.status(200);
  return res.send({ message: msg });
}


/** Adds templates to the user's account. */
async function purchase(req, res) {
  if (!req.body || !req.body.templateIds) {
    res.status(400);
    return res.send({ message: errors.other.MISSING_PARAMETER });
  }

  // todo: check if templateids is an array

  const purchasedTemplates = await Template.find({
    _id: { $in: req.body.templateIds.map((templateId) => mongoose.Types.ObjectId(templateId)) },
  }).exec();

  const profile = await Profile.findOne({ accountId: req.session.accountId }).exec();

  const ownedTemplates = profile.ownedTemplates || [];
  for (const template of purchasedTemplates) {
    if (!ownedTemplates.includes((t) => t._id === template._id)) {
      ownedTemplates.push(template);
    }
  }

  profile.ownedTemplates = ownedTemplates;
  await profile.save();

  return res.send();
}

module.exports = {
  get,
  add,
  purchase,
};
