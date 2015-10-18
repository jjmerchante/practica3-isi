var selectGraceHopper = function (callback) {
  Session.set("selected_player", Players.findOne({name: "Grace Hopper"})._id);
  if (callback) {
    Deps.afterFlush(callback);
  }
};

var unselectPlayer = function () {
  Session.set("selected_player", null);
};

describe("Selecting Grace Hopper", function () {
  beforeEach(function (done) {
    Meteor.loginWithPassword("pepe@gmail.com", "mipassword", function(err){
      Tracker.afterFlush(done);
    });
  });

  beforeEach(function (done) {
    Meteor.autorun(function (c) {
      var grace = Players.findOne({name: "Grace Hopper"});
      if (grace) {
        c.stop();
        selectGraceHopper(done);
      }
    });
  });

  it("should show Grace above the give points button", function () {
    expect($("div.details > div.name").html()).toEqual("Grace Hopper");
  });

  it("should highlight Grace's name", function () {
    var parentDiv = $("span.name:contains(Grace Hopper)").parent();
    expect(parentDiv.hasClass('selected')).toBe(true);
  });
});

describe("Point Assignment", function () {
  beforeEach(function (done) {
    selectGraceHopper(done);
  });

  it("should give a player 5 points when he is selected and the button guive is pressed", function () {
    var graceInitialPoints = Players.findOne({name: "Grace Hopper"}).score;
    $("input.inc:button").click();
    expect(Players.findOne({name: "Grace Hopper"}).score).toBe(graceInitialPoints + 5);
  });

  it("should take a player 5 points when he is selected and the button take is pressed", function () {
    var graceInitialPoints = Players.findOne({name: "Grace Hopper"}).score;
    $("input.dec:button").click();
    expect(Players.findOne({name: "Grace Hopper"}).score).toBe(graceInitialPoints - 5);
  });

});

describe("Player Ordering", function () {
    beforeEach(function (done) {
      Meteor.loginWithPassword("pepe@gmail.com", "mipassword", function(err){
        Tracker.afterFlush(done);
      });
    });

  afterEach(function(done){
    Meteor.logout(function(){
      Tracker.afterFlush(done);
    });
  });
  it("should result in a list where the first player has as many or more points than the second player", function () {
    var players = PlayersService.getPlayerList().fetch();
    expect(players[0].score >= players[1].score).toBe(true);
  });
});
/*
describe("Adding players", function(){
  beforeEach(function (done) {
    Meteor.loginWithPassword("pepe@gmail.com", "mipassword", function(err){
      Tracker.afterFlush(done);
    });
  });

 afterEach(function(done){
    Meteor.logout(function(){
      Tracker.afterFlush(done);
    });
  });

  it("should add a new player", function(){
    $('input[name=playerName]').val("PEPITO"); 
    $("form[name=addPlayer]").submit()
    var name = Players.findOne({name:"PEPITO"}).name
    expect(name).toBe("PEPITO");
  });
});

describe("deleting players", function(){
  beforeEach(function (done) {
    Meteor.loginWithPassword("pepe@gmail.com", "mipassword", function(err){
      Tracker.afterFlush(done);
    });
    selectGraceHopper(done);
  });

 afterEach(function(done){
    Meteor.logout(function(){
      Tracker.afterFlush(done);
    });
  });
  it("should delete a player", function(){
    selectGraceHopper();
    $('input.remove').click();
    expect(Players.findOne({name: "Grace Hopper"})).toBe(undefined);
  });
});

*/