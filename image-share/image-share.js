Images = new Mongo.Collection('images');
console.log('image-share.js', Images.find().count());

if (Meteor.isClient) {
  // var img_data = [{
  //   img_src: 'laptops.jpg',
  //   img_alt: 'some laptops',
  // },
  // {
  //   img_src: 'bass.jpg',
  //   img_alt: 'a bass player',
  // },
  // {
  //   img_src: 'beard.jpg',
  //   img_alt: 'some musicians with beards',
  // },
  // ];
  //
  Template.images.helpers({imgs: Images.find({}, {sort: {rating: -1}})});

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

  });
}

if (Meteor.isServer) {
  console.log('I am the server');
}
