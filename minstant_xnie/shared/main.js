Meteor.methods({
  addChat: function(users) {
    if (!Meteor.user()) {
      alert('You need to login first');
      return null;
    } else {
      var id = Chats.insert(users);
      return id;
    }
  },

  updateChat: function(chat) {
    var realChat = Chats.findOne({_id: chat._id})
    if (realChat) {
      Chats.update(chat._id, chat);
    }
  },
});
