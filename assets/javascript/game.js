$(document).ready(function() {
  //Create object by function
  function character(name, hp, icon, ap, cap) {
    this.name = name;
    this.hp = hp;
    this.icon = icon;
    this.ap = ap;
    this.cap = cap;
  }
  var c1 = new character("Chewbacca", 150, "assets/images/Chewbacca.png", 9, 6);
  var c2 = new character("Ewok", 180, "assets/images/Ewok.png", 5, 9);
  var c3 = new character("Jawa", 100, "assets/images/Jawa.png", 12, 7);
  var c4 = new character("Yoda", 130, "assets/images/Yoda.png", 7, 8);
  // Put all the characters(objects) into array.
  var c = [c1, c2, c3, c4];
  //Initialize the Game
  function initializeGame() {
    //hide start button after click
    $("#startBtn").hide();
    $("#allyCardHolder").empty();
    $("#enemyCardHolder").empty();
    $("#gameLog div").empty();
    x = 1;
  }
  //Character on stage
  $("#startBtn").click(function() {
    for (var i = 0; i < c.length; i++) {
      var card = $("<div>");
      //Build connecting between card and character.
      card.addClass("playcard").attr("index", i);
      //Create character card
      card.append(
        "<div>" + c[i].name + "</div>",
        "<img src= '" + c[i].icon + "'>",
        "<div>" + c[i].hp + "</div>"
      );
      $("#cardHolder").append(card);
    }

    initializeGame();
  });
  // Separate ally and enemy by class different. ** append ** automatic move in without copy action.
  $("#cardHolder").on("click", ".playcard", function() {
    $(this).addClass("ally");
    $("#enemyCardHolder").append($(".playcard").not(".ally"));
    $("#allyCardHolder").append(this);
    $(".playcard")
      .not(".ally")
      .addClass("enemy");
  });
  // Pick the defender
  $("#enemyCardHolder").on("click", ".enemy", function() {
    $("#defZone").append(this);
    $("#defZone .playcard.enemy").addClass("defender");
    $("#allyCardHolder div")
      .last()
      .replaceWith("<div>" + c[$(".ally").attr("index")].hp + "</div>");
    // Reset x to 1  = Reset ally's hp and attack point to original state.
    x = 1;
  });
  //Fighting Part = Math Part
  x = 1;
  $("#attackBtn").click(function() {
    x++;
    var allyCardIndex = $(".ally").attr("index");
    var enemyCardIndex = $("#defZone .playcard.enemy").attr("index");
    //ally's Hp left after x round fight with defender
    var allyHp = c[allyCardIndex].hp - c[enemyCardIndex].cap * x;
    //ally's current attacking point
    var allyCurrentAp = c[allyCardIndex].ap * x;
    //defender's(current enemy's) Hp left after x round fight with ally
    //defender's hp - the sum of ally's  attacking point
    var enemyHp =
      c[enemyCardIndex].hp - c[allyCardIndex].ap * ((x * (x + 1)) / 2);
    $("#allyCardHolder div")
      .last()
      .replaceWith("<div>" + allyHp + "</div>");
    $("#defZone div")
      .last()
      .replaceWith("<div>" + enemyHp + "</div>");
    $("#gameLog div")
      .first()
      .replaceWith(
        "<div>You attacked " +
          c[enemyCardIndex].name +
          " for " +
          allyCurrentAp +
          " damage.</div>"
      );
    $("#gameLog div")
      .last()
      .replaceWith(
        "<div>" +
          c[enemyCardIndex].name +
          " attacked you back for " +
          c[enemyCardIndex].cap +
          " damage.</div>"
      );

    if (allyHp <= 0) {
      $("#allyCardHolder.ally").addClass("dead");
      $("#gameLog div")
        .first()
        .replaceWith("<div>You been defeated...GAME OVER</div>");
      $("#startBtn")
        .text("RESTART")
        .show();
      $("#gameLog div")
        .last()
        .empty();
    }

    if (enemyHp <= 0) {
      $("#defZone div").addClass("dead");
      $("#startBtn")
        .text("RESTART")
        .show();
      // $("#gameLog div").first().replaceWith("<div>You have defeated " + c[enemyCardIndex].name + ", you can choose to fight with another enemy.</div>");
      $("#gameLog div")
        .last()
        .empty();
      if (
        $("#defZone div[class = 'playcard enemy defender dead']").length == 3
      ) {
        $("#gameLog div")
          .first()
          .replaceWith("<div>You defeated All The Enemy!</div>");
      } else {
        $("#gameLog div")
          .first()
          .replaceWith(
            "<div>You have defeated " +
              c[enemyCardIndex].name +
              ", you can choose to fight with another enemy.</div>"
          );
      }
    }
  });
}); //Ready
