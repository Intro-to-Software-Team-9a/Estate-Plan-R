const bcrypt = require('bcrypt');
const config = require('../config/config');

const mongooseUtils = require('../utils/mongoose');
const errors = require('../utils/errors');
const Account = require('../models/Account.model');
const Profile = require('../models/Profile.model');


const saltRounds = config.password.saltRounds;

function addToSession(account, req) {
  req.session.accountId = account._id;
}

/**
 * @param email {String}
 * @param password {String}
 */
async function createAccount(req, res) {
  // validate
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(400);
    res.send({ message: errors.accounts.MISSING_CREDENTIALS });
  }

  // hash the plaintext password
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);

  try {
    // create account
    const account = new Account({ email, passwordHash: hash });
    const profile = new Profile({ accountId: account });
    await account.save();
    await profile.save();

    // update session
    addToSession(account, req);

    return res.send();
  } catch (e) {
    if (mongooseUtils.getErrorType(e) === mongooseUtils.ErrorTypes.DUPLICATE_KEY) {
      res.status(400);
      res.send({ message: errors.accounts.ACCOUNT_ALREADY_EXISTS });
    }

    res.status(500);
    return res.send({ message: errors.other.UNKNOWN });
  }
}


/**
 * @param email {String}
 * @param password {String}
 */
async function login(req, res) {
  // validate request
  if (!req.body.email || !req.body.password) {
    res.status(400);
    res.send({ message: errors.accounts.MISSING_CREDENTIALS });
  }

  // find account
  const { email, password } = req.body;
  const account = await Account.findOne({ email }).exec();

  if (!account) {
    res.status(404);
    return res.send({ message: errors.accounts.ACCOUNT_DOESNT_EXIST});
  }

  // check password match
  if (!bcrypt.compareSync(password, account.passwordHash)) {
    res.status(401);
    return res.send({ message: errors.accounts.WRONG_CREDENTIALS });
  }

  // update session
  addToSession(account, req);

  return res.send();
}

module.exports = {
  login,
  createAccount,
};
