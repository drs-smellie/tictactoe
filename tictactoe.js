Boxes = new Mongo.Collection('boxes');

if (Meteor.isClient) {
  Session.set('player', 'X');

  var setNextPlayer = function(){
    if (Session.get('player') == 'X') {
      Session.set('player', 'O');
    } else {
      Session.set('player', 'X');
    }
  };

  var hasWon = function() {
    //make a plain array of our Collection so we can use native javascript Array methods
    var boxes = Boxes.find().fetch();
    var player = Session.get('player');
    //only check if there is such property
    if(boxes[0] && boxes[0].player) {
      //game rules
      //we have a winner in a row
      if (boxes[0].player == player && boxes[1].player == player && boxes[2].player == player) return true;
      if (boxes[3].player == player && boxes[4].player == player && boxes[5].player == player) return true;
      if (boxes[6].player == player && boxes[7].player == player && boxes[8].player == player) return true;

      //we have a winner in a column
      if (boxes[0].player == player && boxes[3].player == player && boxes[6].player == player) return true;
      if (boxes[1].player == player && boxes[4].player == player && boxes[7].player == player) return true;
      if (boxes[2].player == player && boxes[5].player == player && boxes[8].player == player) return true;

      //we have a winner in a diagonal
      if (boxes[2].player == player && boxes[4].player == player && boxes[6].player == player) return true;
      if (boxes[0].player == player && boxes[4].player == player && boxes[8].player == player) return true;
    }
    //no winner, no joy
    return false;
  };

  var resetGame = function(){
    //Reset game: make all boxes empty
    var boxes = Boxes.find().fetch();
    for (var i = 0; i < boxes.length; i++){
      //remove player property from all boxes
      Boxes.update({_id: boxes[i]._id}, {$set: {player: null}});
    }
    // Initialize the Session again.
    Session.set('player', 'X');
  };

  Template.gameboard.helpers({
    boxes: function(){
      return Boxes.find({});
    }
  });

  Template.gameboard.events({
    'click .reset-game': resetGame
  });

  Template.box.events({
    click: function(){
      var boxFilled = this.player;
      if (boxFilled) {
        return;
      }
      var sessionPlayer = Session.get('player');
      Boxes.update(this._id, { $set: { player: sessionPlayer } });
      if(hasWon()) {
        console.log("Player", Session.get('player'),"has won");
      } else {
        console.log('Player', Session.get('player'),'has NOT won');
        setNextPlayer();
      }
    }
  });

  Template.box.helpers({
    player: function(){
      return this.player;
    },
    disabled:function() {
      return this.player;
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    //just to be sure, we want to begin with a new collection
    Boxes.remove({});
    //and fill it with 9 boxes
    if(Boxes.find().count() === 0) {
      for(var i = 0; i < 9; i++){
        Boxes.insert({});
      }
    }
  });
}
