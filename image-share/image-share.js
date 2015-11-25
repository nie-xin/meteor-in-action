Images = new Mongo.Collection('images');
console.log(Images.find().count());

if (Meteor.isClient) {
  var img_data = [{
    img_src: 'laptops.jpg',
    img_alt: 'some laptops',
  },
  {
    img_src: 'bass.jpg',
    img_alt: 'a bass player',
  },
  {
    img_src: 'beard.jpg',
    img_alt: 'some musicians with beards',
  },
  ];

  Template.images.helpers({imgs: img_data});

  Template.images.events({
    'click .js-image': function(event) {
      $(event.target).css("width", "50px");
    },
  });
}

if (Meteor.isServer) {
  console.log('I am the server');
}
