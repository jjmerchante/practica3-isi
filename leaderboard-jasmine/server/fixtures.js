//Create random players
function generateRandomPlayers() {
    // Players created by pepe
    var namesPepe = ["Ada Lovelace",
                             "Grace Hopper",
                             "Marie Curie"];
    var idPepe = Accounts.findUserByEmail("pepe@gmail.com")._id;
    for (var i = 0; i < namesPepe.length; i++) {
        Players.insert({name: namesPepe[i],
                                score: _randomScore(),
                                createdBy: idPepe});
    }

    //Players created by pipo
    var namesPipo = [
                             "Carl Friedrich Gauss",
                             "Nikola Tesla",
                             "Claude Shannon"];
    var idPipo = Accounts.findUserByEmail("pipo@gmail.com")._id;
    for (var i = 0; i < namesPipo.length; i++) {
        Players.insert({name: namesPipo[i],
                                score: _randomScore(),
                                createdBy: idPipo});
    }
    
}

function _randomScore () {
    return Math.floor(Random.fraction() * 10) * 5
}



// FIXTURES
if (process.env.IS_MIRROR) {
    Meteor.methods({
        'loadFixtures': function(){
            console.log('Loading default fixtures');
            // TODO: add your fixtures here
            Accounts.createUser({
                email: 'pepe@gmail.com',
                password: 'mipassword'
            });
            Accounts.createUser({
                email: 'pipo@gmail.com',
                password: '123456'
            });
            generateRandomPlayers();
            console.log('Finished loading default fixtures');
        },

        'clearDB': function(){
            console.log('Clear DB');

            var collectionsRemoved = 0;
            var db = Meteor.users.find()._mongo.db;
            db.collections(function (err, collections) {
                var appCollections = _.reject(collections, function (col) {
                    return col.collectionName.indexOf('velocity') === 0 ||
                    col.collectionName === 'system.indexes';
                });

                _.each(appCollections, function (appCollection) {
                    appCollection.remove(function (e) {
                        if (e) {
                            console.error('Failed removing collection', e);
                            fut.return('fail: ' + e);
                        }
                        collectionsRemoved++;
                        console.log('Removed collection');
                        if (appCollections.length === collectionsRemoved) {
                            console.log('Finished resetting database');
                        }
                    });
                });
            });
            console.log('Finished clearing');
        }
    });
}
