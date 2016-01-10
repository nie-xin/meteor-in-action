Meteor.startup(function() {
  if (!Documents.findOne()) {
    Documents.insert({title: 'new doc'});
  }
});

Meteor.publish('documents', function() {
  return Documents.find({
    $or: [
      {isPrivate: {$ne: true}},
      {owner: this.userId},
    ],
  });
});

Meteor.publish('editingUsers', function() {
  return EditingUsers.find();
});
