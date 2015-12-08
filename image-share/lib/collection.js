Images = new Mongo.Collection('images');

// set up security on Images collection
Images.allow({
  insert: function(userId, doc) {
    if (Meteor.user()) {
      // user is messing about
      if (userId !== doc.createdBy) {
        return false;
      } else {
        return true
      }
    } else {
      return false;
    }
  },
})
