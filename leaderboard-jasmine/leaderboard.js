// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

/**
 * Separate player logic into an own service singleton for better testability and reusability.
 * @type {{}}
 */
PlayersService = {
  getPlayerList: function () {
    var currentId = Meteor.userId();
    return Players.find({createdBy: currentId}, {sort: {score: -1, name: 1}});
  },
  getPlayer: function (playerId) {
    return Players.findOne(playerId);
  },
  rewardPlayer: function (playerId) {
    Players.update(playerId, {$inc: {score: 5}});
  },
  penaltyPlayer: function(playerId){
    Players.update(playerId, {$inc: {score: -5}});
  },
  playersExist: function () {
    return Players.find().count() > 0;
  },
  insertPlayer: function(playerName){
    var currentId = Meteor.userId();
    Players.insert({name: playerName, score: 0, createdBy: currentId});
  },
  removePlayer: function(playerId) {
    Players.remove(playerId);
  }
};

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    players: function () {
      return PlayersService.getPlayerList();
    },

    selected_name: function () {
      var player = PlayersService.getPlayer(Session.get("selected_player"));
      return player && player.name;
    }
  });

  Template.leaderboard.events({
    'click input.inc': function () {
      PlayersService.rewardPlayer(Session.get("selected_player"));
    },

    'click input.dec': function(){
      PlayersService.penaltyPlayer(Session.get("selected_player"));
    },

    'click input.remove': function(){
      PlayersService.removePlayer(Session.get("selected_player"));
    }
  });


  Template.player.helpers({
    selected: function () {
      return Session.equals("selected_player", this._id) ? "selected" : '';
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });


  Template.addPlayerForm.events({
    'submit form': function(event){
      event.preventDefault();
      PlayersService.insertPlayer($('[name=playerName]').val());
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish('players', function(){
      return Players.find();
    });
  });
}

