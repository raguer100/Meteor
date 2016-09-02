if (Meteor.isClient) {
	Template.task.events({
    "click .oneTask": function(event) {
      Meteor.call("deleteTasks", this._id);
    },
    "click .checkbox": function(event) {
      Meteor.call("updateTasks", this._id, this.checked);
    },
    "click .privateButton": function(event) {
      Meteor.call("setPrivate", this._id, this.private);
    }
  });

  Template.task.helpers({
    isOwner: function() {
      return this.owner === Meteor.userId();
    }
  });
}