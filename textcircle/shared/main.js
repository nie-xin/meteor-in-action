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

  addEditingUser: function(docid) {
    var doc, user, eusers;
    doc = Documents.findOne({_id: docid});

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

  addComment: function(comment) {
    console.log('inside add comment')
    if (this.userId) {
      comment.owner = this.userId;
      console.log('add comment run: ', comment)
      return Comments.insert(comment);
    } else {
      return;
    }
  },
});
