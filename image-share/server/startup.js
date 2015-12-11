Meteor.startup(function() {
  if (Images.find().count() === 0) {
    Images.insert(
      {
        img_src: 'laptops.jpg',
        img_alt: 'some laptops',
      }
    )

    Images.insert(
      {
        img_src: 'bass.jpg',
        img_alt: 'a bass player',
      }
    )

    Images.insert(
      {
        img_src: 'beard.jpg',
        img_alt: 'some musicians with beards',
      }
    )
  }
});
