Meteor.subscribe('documents');
Meteor.subscribe('editingUsers');

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
        Meteor.call('addEditingUser', Session.get('docid'));
      });
    };
  },
});

Template.editingUsers.helpers({
  users: function() {
    var users, doc, eusers;
    doc = Documents.findOne({_id: Session.get('docid')});

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
    return Documents.find();
  },
});

Template.docMeta.helpers({
  document: function() {
    return Documents.findOne({_id: Session.get('docid')});
  },

  canEdit: function() {
    var doc = Documents.findOne({_id: Session.get('docid')});
    if (doc) {
      if (doc.owner == Meteor.userId()) {
        return true;
      }
    } else {
      return false;
    }
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
