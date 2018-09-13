$(document).ready(function() {
  //Create object by function
  function character(name, hp, ap, cap) {
    this.name = name;
    this.hp = hp;
    this.icon = `assets/images/${this.name}.jpg`;
    this.ap = ap;
    this.cap = cap;
    //damage output by now
    this.damageOutputByNow = function(t) {
      return (this.ap * (t * (t + 1))) / 2;
    };
  }

  const c1 = new character("chewbacca", 150, 9, 6);
  const c2 = new character("boba", 180, 5, 9);
  // const c3 = new character("emperor", 100, 12, 7);
  const c4 = new character("han", 130, 7, 10);
  // const c5 = new character("kylo", 150, 9, 6);
  // const c6 = new character("leia", 180, 5, 9);
  const c7 = new character("obi", 100, 12, 7);
  // const c8 = new character("rey", 130, 7, 8);
  // const c9 = new character("yoda", 130, 7, 8);

  // Put all the characters(objects) into array.
  const c = [c1, c2, c4, c7];
  var x = 0;
  //Initialize the Game

  $("#content").hide();

  function initializeGame() {
    //hide start button after click
    $("#startBtn").hide();
    $("#allyCardHolder").empty();
    $("#enemyCardHolder").empty();
    $("#gameLog div").empty();
    $("#defZone").empty();
    $("#attackBtn").hide();
    x = 0;
  }
  //Character on stage
  $("#startBtn").click(function() {
    $("#startImg").fadeOut(1000);
    $("#content").fadeIn(2000);
    initializeGame();
    for (let i = 0; i < c.length; i++) {
      let card = $("<div>");
      //Build connecting between card and character.
      card.addClass("playCard").attr("index", i);
      //Create character card
      card.append(
        `<div> ${c[i].name} </div>
         <img src= "${c[i].icon}">
         <div>${c[i].hp}</div>
         <div class="cardOverlay">
            <div class = "text"> Attack:${c[i].ap}</div>
            <div> Counter:${c[i].cap}</div>
         </div>`
      );
      $("#cardHolder").append(card);
    }
  });
  // Separate ally and enemy by class different. ** append ** automatic move in without copy action.
  $("#cardHolder").on("click", ".playCard", function() {
    //remove the AP and CAP display
    $("div.cardOverlay").remove();
    // Reorder the chosen card to first
    $(this).insertBefore($("#cardHolder div:first"));
    // div for vsSymbol
    let vsSymbol = `<div id = "vsSymbol" class = "playCard">
                        <img src = "assets/images/vs.png">
                    </div>`;

    $(this).addClass("ally allyAnimation");
    $(".playCard")
      .not(".ally")
      .addClass("enemy enemyAnimation");
    $(vsSymbol).insertAfter(this);
    $("#vsSymbol").show(3000, () => {
      $("#vsSymbol").hide();
      $(".ally").fadeOut();
      $(".enemy").fadeOut();
      $(".ally").removeClass("allyAnimation");
      $(".enemy").removeClass("enemyAnimation");
      setTimeout(() => {
        $("#enemyCardHolder").append($(".playCard").not(".ally"));
        $("#allyCardHolder").append(this);
        $(".enemy").fadeIn();
        $(".ally").fadeIn();
      }, 800);
    });
  });
  // Pick the defender
  $("#enemyCardHolder").on("click", ".enemy", function() {
    if ($("#defZone .defender").length === 0) {
      $("#gameLog div").empty();
      $("#defZone").append(this);
      $("#attackBtn").show();
      $("#defZone .playCard.enemy").addClass("defender");
      $("#allyCardHolder div:last").replaceWith(
        `<div>${c[$(".ally").attr("index")].hp}</div>`
      );
      // Reset x to 0  = Reset ally's hp and attack point to original state after the first click.
      x = 0;
    }
    $("#attackBtn").prop("disabled", false);
  });

  //Fighting Part = Math Part
  // x = 0;
  $("#attackBtn").click(function() {
    x++;
    var allyCardIndex = $(".ally").attr("index");
    var enemyCardIndex = $("#defZone .playCard.enemy").attr("index");
    //ally's Hp left after x round fight with defender
    var allyHp = c[allyCardIndex].hp - c[enemyCardIndex].cap * x;
    //ally's current attacking point
    var allyCurrentAp = c[allyCardIndex].ap * x;
    //defender's(current enemy's) Hp left after x round fight with ally
    //defender's hp - the sum of ally's  attacking point
    var enemyHp = c[enemyCardIndex].hp - c[allyCardIndex].damageOutputByNow(x);
    $("#allyCardHolder div:last").replaceWith(`<div> ${allyHp}</div>`);
    $("#defZone div:last").replaceWith(`<div> ${enemyHp}</div>`);
    $("#gameLog div:first").replaceWith(
      `<div>You attacked ${
        c[enemyCardIndex].name
      } for ${allyCurrentAp} damages.</div>`
    );
    $("#gameLog div:last").replaceWith(
      `<div> ${c[enemyCardIndex].name} attacked you back for ${
        c[enemyCardIndex].cap
      } damages.</div>`
    );

    if (allyHp <= 0) {
      $("#allyCardHolder").empty();
      $("#gameLog div:first").replaceWith(
        "<div>You been defeated...GAME OVER</div>"
      );
      $("#startBtn")
        .text("RESTART")
        .show();
      $("#gameLog div:last").empty();
    }

    if (enemyHp <= 0) {
      // if enemy dead, remove card from defZone
      $("#defZone").empty();
      $("#attackBtn").prop("disabled", true);

      $("#gameLog div:last").empty();
      if ($("#enemyCardHolder div").length === 1) {
        $("#gameLog div:first").replaceWith(
          "<div>You defeated All The Enemy!</div>"
        );
      } else {
        $("#gameLog div:first").replaceWith(
          `<div>You have defeated ${c[enemyCardIndex].name},</div>`
        );
        $("#gameLog div:last").replaceWith(
          `<div>you can choose to fight with another enemy.</div>`
        );
      }
    }
  });
}); //Ready
