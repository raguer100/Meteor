collections = new Mongo.Collection("collections");

if (Meteor.isClient) {

  Meteor.subscribe("collections");

  Template.body.helpers({
    Tasks: function() {
      if(Session.get("hideCompleted")) {
        return collections.find({checked : {$ne : true}}, {sort: {createdAt: -1}});
      } else {
        return collections.find({}, {sort: {createdAt: -1}});
      }
    },
    hideChecked: function() {
      return Session.get("hideCompleted");
    }
  });

  Template.body.events({
    "submit .new-task": function(event){
      var title = event.target.title.value;

      if(title != "") {
        Meteor.call("addTasks", title);
      }

      event.target.title.value = "";
      return false;
    },
    "change .partlyCheckbox": function(event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });
  
  Accounts.ui.config({
    passwordSignupFields : "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("collections", function() {
    return collections.find(
      {$or: [{private: {$ne: true}}, {owner: this.userId}]},
      {sort: {createdAt: -1}}
      );
  });
}

Meteor.methods({
  addTasks: function(title) {
    collections.insert({
      title: title,
      createdAt: new Date(),
      owner: Meteor.userId()
    });
  },

  deleteTasks: function(_id) {
    var task = collections.findOne(_id);

    if(task.owner !== Meteor.userId()) {
      throw new Meteor.Error("Not-Authorized");
    }
    
    collections.remove(_id);
  },

  updateTasks: function(_id, checked) {
    var task = collections.findOne(_id);
    
    if(task.owner !== Meteor.userId()) {
      throw new Meteor.Error("Not-Authorized");
    }

    collections.update(_id, {$set: {checked : ! checked}});
  },

  setPrivate: function(_id, private) {
    var task = collections.findOne(_id);

    if(task.owner !== Meteor.userId()) {
      throw new Meteor.Error("Not-Authorized");
    }

    collections.update(_id, {$set: {private : ! private}});
  }
})
