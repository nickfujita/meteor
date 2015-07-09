// simple-todos.js
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      if(Session.get("hideCompleted")){
        return Tasks.find({checked: {$ne: true}},{sort: {createdAt: -1}});
      } else{
        return Tasks.find({},{sort: {createdAt: -1}});
      }
    },
    hideCompleted: function(){
      return Session.get("hideCompleted");
    },
    incompleteCount: function(){
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });

  Template.body.events({
  	//this function is called in the event that the new-task form is submitted
  	"submit .new-task": function (event) {
  		var text = event.target.text.value;

      //take this out in order to remove client direct calls to server db
  		// Tasks.insert({
  		// 	text: text,
  		// 	createdAt: new Date(),
    //     owner: Meteor.userId(),
    //     username: Meteor.user().username
  		// });

      Meteor.call("addTask", text);

  		//clear the form
  		event.target.text.value = "";

  		//prevent default form submit
  		return false;
  	},
    "change .hide-completed input": function (event){
      Session.set("hideCompleted",event.target.checked);
    }
  });

  Template.task.events({
  	"click .toggle-checked": function(){
  		//take this out in order to remove client direct calls to server db
      // Tasks.update(this._id, {$set: {checked: ! this.checked}});
      Meteor.call("setChecked", this._id, ! this.checked);
  	},
  	"click .delete": function(){
      //take this out in order to remove client direct calls to server db
  		// Tasks.remove(this._id);
      Meteor.call("deleteTask", this._id);
  	}
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });


}
//end of clinet side code



Meteor.methods({

  addTask: function(text){
    if(! Meteor.userId()){
      throw new Meteor.Error("not-auth");
    }

    Tasks.insert({
        text: text,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username
    });
  },

  deleteTask: function (taskId){
    Tasks.remove(taskId);
  },

  setChecked: function (taskId, setChecked){
    Tasks.update(taskId, {$set: {checked: setChecked}});
  }
});










