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

}

if (Meteor.isServer) {
  Meteor.startup(function() {
    if (!Documents.findOne()) {
      Documents.insert({title: 'my new doc'});
    }
  });
}

Meteor.methods({
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
