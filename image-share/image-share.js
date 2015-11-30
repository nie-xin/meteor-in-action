Images = new Mongo.Collection('images');
console.log('image-share.js', Images.find().count());

if (Meteor.isClient) {

  Template.images.helpers({imgs: Images.find({}, {sort: {createdOn: -1, rating: -1}})});

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
    }

  });

  Template.image_add_form.events({
    'submit .js-add-image': function(event) {
      var img_src, img_alt;
      img_src = event.target.img_src.value;
      img_alt = event.target.img_alt.value;

      Images.insert({
        img_src: img_src,
        img_alt: img_alt,
        createdOn: new Date()
      });

      $('#image_add_form').modal('hide');

      return false;
    }
  });
}

if (Meteor.isServer) {
  console.log('I am the server');
}
