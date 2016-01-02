this.Documents = new Mongo.Collection('documents');
EditingUsers = new Mongo.Collection('editingUsers');

if (Meteor.isClient) {

  // update session every 1 second
  Meteor.setInterval(function() {
    Session.set('current_date', new Date());
  }, 1000);

  Template.editor.helpers({
    docid: function() {
      setupCurrentDocument();
      return Session.get('docid');
    },

    config: function() {
      return function(editor) {
        editor.on('change', function(cm_editor, info) {
          $('#viewer-iframe').contents().find('html').html(cm_editor.getValue());
          Meteor.call('addEditingUser');
        });
      };
    },
  });

  Template.editingUsers.helpers({
    users: function() {
      var users, doc, eusers;
      doc = Documents.findOne();

      if (!doc) {
        return;
      }

      eusers = EditingUsers.findOne({docid: doc._id});

      if (!eusers) {
        return;
      }

      users = new Array();
      var i = 0;
      for (var user_id in eusers.users) {
        users[i] = fixObjectKeys(eusers.users[user_id]);
        i++;
      }

      return users;
    },
  });

  Template.navbar.helpers({
    documents: function() {
      return Documents.find({});
    },
  });

  Template.docMeta.helpers({
    document: function() {
      return Documents.findOne({_id: Session.get('docid')});
    },
  });

  Template.editableText.helpers({
    userCanEdit: function(doc, Collection) {
      doc = Documents.findOne({_id: Session.get('docid'), owner: Meteor.userId()});

      if (doc) {
        return true;
      } else {
        return false;
      }
    },
  });

  //events
  Template.navbar.events({
    'click .js-add-doc': function(event) {
      event.preventDefault();
      if (!Meteor.user()) {
        alert('You need to login first');
      } else {
        Meteor.call('addDoc', function(err, res) {
          if (!err) {
            Session.set('docid', res);
          }
        });
      }
    },

    'click .js-load-doc': function(event) {
      Session.set('docid', this._id);
    },
  });

  Template.docMeta.events({
    'click .js-tog-private': function(event) {
      var doc = {
        _id: Session.get('docid'),
        isPrivate: event.target.checked,
      };
      Meteor.call('updateDocPrivacy', doc);
    },
  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    if (!Documents.findOne()) {
      Documents.insert({title: 'new doc'});
    }
  });
}

Meteor.methods({
  updateDocPrivacy: function(doc) {
    var realDoc = Documents.findOne({_id: doc._id, owner: this.userId});
    if (realDoc) {
      realDoc.isPrivate = doc.isPrivate;
      Documents.update({_id: doc._id}, realDoc);
    }
  },

  addDoc: function() {
    var doc;
    if (!this.userId) {
      return;
    } else {
      doc = {
        owner: this.userId,
        createdOn: new Date(),
        title: 'my new doc',
      };
      var id = Documents.insert(doc);
      return id;
    }
  },

  addEditingUser: function() {
    var doc, user, eusers;
    doc = Documents.findOne();

    if (!doc) {
      return;
    };

    if (!this.userId) {
      return;
    };

    user = Meteor.user().profile;

    eusers = EditingUsers.findOne({docid: doc._id});

    if (!eusers) {
      eusers = {
        docid: doc._id,
        users: {},
      };
    }

    user.lastEdit = new Date();
    eusers.users[this.userId] = user;

    EditingUsers.upsert({_id: eusers._id}, eusers);
  },
});

function fixObjectKeys(obj) {
  var newObj = {};
  for (key in obj) {
    var key2 = key.replace('-', '');
    newObj[key2] = obj[key];
  }

  return newObj;
}

function setupCurrentDocument() {
  var doc;
  if (!Session.get('docid')) {
    doc = Documents.findOne();
    if (doc) {
      Session.set('docid', doc._id);
    }
  }
}
