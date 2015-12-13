Websites = new Mongo.Collection("websites");

Websites.allow({
  insert: function(userId, doc) {
    if (Meteor.user()) {
      return true
    } else {
      return false;
    }
  },
  update: function(userId, doc) {
    if (Meteor.user()) {
      return true
    } else {
      return false;
    }
  },
});

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function() {
  this.render('navbar', {
    to: 'navbar'
  });
  this.render('website_main', {
    to: 'main'
  });
});

Router.route('/website/:_id', function() {
  this.render('navbar', {
    to: 'navbar'
  });
  this.render('website_detail', {
    to: 'main',
    data: function() {
      return Websites.findOne({_id: this.params._id})
    }
  });
});


if (Meteor.isClient) {

  // Add username filed to login
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });



  /////
  // template helpers
  /////
  Template.navbar.helpers({
    username: function() {
      if (Meteor.user()) {
        return Meteor.user().username;
      } else {
        return 'Anonymous user';
      }
    },
  });

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites: function() {
			return Websites.find({}, {sort: {up: -1}});
		}
	});


	/////
	// template events - up & down vote
	/////
  Template.website_detail.events({
    "click .js-validate": function(event) {
      if (Meteor.user()) {
        var website_id = this._id;
        var commentInput = document.querySelector("#comment");

        var comment = Websites.findOne({_id: website_id}).comment;
        comment.push(commentInput.value);

        Websites.update({_id: website_id}, {$set: {comment: comment}});
      }
    },
  });

  Template.website_list.events({
    "click .js-search": function(event) {
      var searchValue = document.querySelector('.search').value;
      var found = Websites.findOne({title: searchValue});

      if (found) {
        console.log(this)
      }
    }
  });

	Template.website_item.events({
		"click .js-upvote": function(event) {
			var website_id = this._id;
      var up = Websites.findOne({_id: website_id}).up;
      Websites.update({_id: website_id}, {$set: {up: up + 1}});

			return false;// prevent the button from reloading the page
		},

		"click .js-downvote": function(event) {
      var website_id = this._id;
      var down = Websites.findOne({_id: website_id}).down;
      Websites.update({_id: website_id}, {$set: {down: down + 1}});

			return false;// prevent the button from reloading the page
		}
	});


	Template.website_form.events({
		"click .js-toggle-website-form": function(event){
			$("#website_form").toggle('slow');
		},

		"submit .js-save-website-form": function(event){
      if (Meteor.user()) {
        var url = event.target.url.value;
        var title = event.target.title.value;
        var description = event.target.description.value;

        Websites.insert({
          title: title,
          url: url,
          description: description,
          createdOn: new Date(),
          up: 0,
          down: 0,
          comment: []
        });

        $("#website_form").toggle('slow');
      }

			return false;// stop the form submit from reloading the page

		}
	});
}


if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department",
    		url:"http://www.gold.ac.uk/computing/",
    		description:"This is where this course was developed.",
    		createdOn:new Date(),
        up: 0,
        down: 0,
        comment: []
    	});
    	 Websites.insert({
    		title:"University of London",
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    		description:"University of London International Programme.",
    		createdOn:new Date(),
        up: 0,
        down: 0,
        comment: []
    	});
    	 Websites.insert({
    		title:"Coursera",
    		url:"http://www.coursera.org",
    		description:"Universal access to the world’s best education.",
    		createdOn:new Date(),
        up: 0,
        down: 0,
        comment: []
    	});
    	Websites.insert({
    		title:"Google",
    		url:"http://www.google.com",
    		description:"Popular search engine.",
    		createdOn:new Date(),
        up: 0,
        down: 0,
        comment: []
    	});
    }
  });
}
