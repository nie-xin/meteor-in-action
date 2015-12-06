Images = new Mongo.Collection('images');
console.log('image-share.js', Images.find().count());

if (Meteor.isClient) {

  Session.set('imageLimit', 6);

  var lastScrollTop = 0;
  $(window).scroll(function(event) {
    if ($(window).scrollTop() + $(window).height() > $(document).height() -  100) {
      var scrollTop = $(this).scrollTop();

      if (scrollTop > lastScrollTop) {
        Session.set('imageLimit', Session.get('imageLimit') + 4);
      }
      lastScrollTop = scrollTop;
    }
  });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });

  Template.images.helpers({
    imgs: function() {
      if (Session.get('userFilter')) {
        return Images.find({createdBy: Session.get('userFilter')}, {sort: {createdOn: -1, rating: -1}});
      } else {
        return Images.find({}, {sort: {createdOn: -1, rating: -1}, limit: Session.get('imageLimit')});
      }
    },

    filtering_images: function() {
      if (Session.get('userFilter')) {
        return true;
      } else {
        return false;
      }
    },

    getUser: function(user_id) {
      var user = Meteor.users.findOne({_id: user_id});
      if (user)
        return user.username;
      else
        return 'anonymous user';
    },

    getFilterUser: function() {
      if (Session.get('userFilter')) {
        var user = Meteor.users.findOne({_id: Session.get('userFilter')});
        return user.username;
      } else {
        return false;
      }
    }
  });

  Template.body.helpers({username: function() {
    if (Meteor.user()) {
      return Meteor.user().username;
    } else {
      return 'Anonymous user';
    }
  }});

  Template.images.events({
    'click .js-image': function(event) {
      $(event.target).css("width", "50px");
    },

    'click .js-rate-image': function(event) {
      var rating = $(event.currentTarget).data('userrating');
      var img_id = this.id;
      Images.update({_id: img_id},
                    {$set: {rating: rating}});
    },

    'click .js-show-image-form': function(event) {
      $('#image_add_form').modal('show');
    },

    'click .js-set-image-filter': function(event) {
      Session.set('userFilter', this.createdBy);
    },

    'click .js-unset-image-filter': function(event) {
      Session.set('userFilter', undefined);
    }

  });

  Template.image_add_form.events({
    'submit .js-add-image': function(event) {
      var img_src, img_alt;
      img_src = event.target.img_src.value;
      img_alt = event.target.img_alt.value;

      if (Meteor.user()) {
        Images.insert({
          img_src: img_src,
          img_alt: img_alt,
          createdOn: new Date(),
          createdBy: Meteor.user()._id,
        });
      }

      $('#image_add_form').modal('hide');

      return false;
    }
  });
}

if (Meteor.isServer) {
  console.log('I am the server');
}
