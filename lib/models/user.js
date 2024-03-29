'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * User Schema
 */
var UserSchema = new Schema({
  _id: String,
  name: String,
  email: { type: String, lowercase: true },
  hashedPassword: String,
  salt: String,
  guest: Boolean
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Basic info to identify the current authenticated user in the app
UserSchema
  .virtual('userInfo')
  .get(function() {
    return {
      'name': this.name,
      'email': this.email
    };
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
    };
  });
    
/**
 * Validations
 */

/* Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return hashedPassword.length;
  }, 'Password cannot be blank');


// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');


// Validate name is not taken
UserSchema
  .path('name')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({name: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified user name is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};*/

/**
 * Pre-save hook

UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword))
      next(new Error('Invalid password'));
    else
      next();
  });
 */

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Create a dummy user
   */
  create: function(newid) {
    var random = [
      'Baselerk',
      'Belcaperi',
      'Buddiesful',
      'Burroatyp',
      'Cistermoos',
      'Colosti',
      'CoverSra',
      'DotSlay',
      'Foulsize',
      'Funkenpold',
      'GotLife',
      'Icyrterry',
      'Influsouc',
      'LilAnn',
      'Luxtegr',
      'LyfeMuchQuey',
      'MitziLou',
      'Mlessale',
      'NanTheevil',
      'Objechpin',
      'Pikerser',
      'Receighla',
      'Rosesselay',
      'RosesSlimDogg',
      'RunSpin',
      'RyothClaw',
      'SeeLove',
      'Selforig',
      'SharkCrossed',
      'SizzlinFinest',
      'Afternock',
      'AngurisGlossy',
      'BabyWunderChirp',
      'Caseube',
      'Chathestfi',
      'Chronicleso',
      'Contrix',
      'Criticloon',
      'Digamical',
      'Dilemix',
      'Effecrepr',
      'EnjoyUr',
      'ExclusiveSon',
      'Fibeamet',
      'ForeverMrBradel',
      'Grayitea',
      'Hightfieli',
      'Horoller',
      'Klughtower',
      'LegendPeatear',
      'Lucytoiler',
      'NearlyActive',
      'Netcell',
      'PrimeWet',
      'Readroomma',
      'Reddynprols',
      'Ruddleup',
      'SheerFang',
      'Skyzomintro',
      'Spyglowbi'
    ];

    var User = mongoose.model('User');
    var user = new User();
    user._id      = newid;
    user.added    = Date.now();
    user.name     = random[Math.floor(Math.random() * random.length) + 1];
    user.password = '';
    user.email    = '';
    user.guest    = true;
    user.save(function(err, doc) {
      //handle error
      if (err) {
        console.log("ERROR: " + err);
      }
      return doc;
    });
  },

 /**
   * Get the user information
   * @param {String} id
   */
  get: function(id, socket) {
    this.model('User').findOne({'_id': id}, function(err, doc) {
        if (!doc) {
          doc = UserSchema.methods.create(id);
        }
        console.log(doc);
        socket.emit('user:profile', {'user': doc});
    });
  },

  register: function(info, socket) {
    this.model('User').findOne({'_id': info._id}, function(err, doc) {
      if (doc) {
        doc.name = info.name;
        doc.hashedPassword = info.password;
        doc.guest = false;
        doc.save();
        console.log(doc);
        socket.emit('user:profile', {'user': doc});
      }
    });
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

var User = mongoose.model('User', UserSchema);