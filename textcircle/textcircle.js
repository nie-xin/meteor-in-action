this.Documents = new Mongo.Collection('documents');

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
        });
      }
    },
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (!Documents.findOne()) {
      Documents.insert({title: 'my new doc'});
    }
  });
}
