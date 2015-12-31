this.Documents = new Mongo.Collection('documents');
EditingUsers = new Mongo.Collection('editingUsers');

if (Meteor.isClient) {

  // update session every 1 second
  Meteor.setInterval(function() {
    Session.set('current_date', new Date());
  }, 1000);

  Template.editor.helpers({
    docid: function() {
      var doc = Documents.findOne();
      if (doc) {
        return doc._id;
      } else {
        return undefined;
      }
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
        console.log(eusers.users[user_id])
        users[i] = fixObjectKeys(eusers.users[user_id]);
        i++;
      }

      return users;
    }
  });

  //events
  Template.navbar.events({
    'click .js-add-doc': function(event) {
      event.preventDefault();
      if (!Meteor.user()) {
        alert('You need to login first');
      } else {
        Meteor.call('addDoc');
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    if (!Documents.findOne()) {
      Documents.insert({title: 'my new doc'});
    }
  });
}

Meteor.methods({
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
      Documents.insert(doc);
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
  }
});

function fixObjectKeys(obj) {
  var newObj = {};
  for (key in obj) {
    var key2 = key.replace('-', '');
    newObj[key2] = obj[key];
  }

  return newObj;
}
