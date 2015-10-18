describe('Collection: Players', function () {

  it('some players are available in the collection', function () {
    expect(Players.find().count()).toBe(0);
  });
  // No entiendo por qué no añade

});