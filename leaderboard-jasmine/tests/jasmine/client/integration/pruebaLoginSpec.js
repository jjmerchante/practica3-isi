describe("User logged in", function () {

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

   it("should the user be logged in", function(){
    var user = Meteor.user();
    expect(user).not.toBe(null);
  });

});


describe("User logged out", function(){
    beforeEach(function(done){
      Meteor.logout(function(){
        Tracker.afterFlush(done);
      });
    });

  it("should the user be logged out", function(){
    var user = Meteor.user();
    expect(user).toBe(null);
  });

   it("should not show the addPlayerForm", function(){
    expect($('form[name=addPlayer]').html()).toBe(undefined);
   });

   it("should not show players in the leaderboard", function(){
    expect($('div.leaderboard > div.player').length).toBe(0);
   });
});
