var rpg_text = require("@syth/rpg-prompt");

async function dotest() {
  var count=1;
  var text="";
  var bild="";
  var Owner = "Test";

  // --------------------------

  text = await rpg_text.Start_Story(Owner);
  count++;

  text = await rpg_text.Spawn_Monster(Owner);
  count++;

  for (var i = 0 ; i < 1; i++) {
    text = await rpg_text.Attack_Monster(Owner, "Sascha");
    count++;

    text = await rpg_text.Attack_Monster(Owner, "BobSanGG");
    count++;

    text = await rpg_text.Attack_Monster(Owner, "Yunkeed");
    count++;

    text = await rpg_text.Attack_Monster(Owner, "BobSanGG");
    count++;

    text = await rpg_text.Attack_Monster(Owner, "Sascha");
    count++;

    text = await rpg_text.Defence_Monster(Owner, "BobSanGG");
    count++;

    text = await rpg_text.Collect_Item(Owner, "BobSanGG", "Heilkraut");
    count++;

    text = await rpg_text.Use_Item(Owner, "BobSanGG", "Heilkraut");
    count++;
  }

  text = await rpg_text.Kill_Monster(Owner, "BobSanGG");
  count++;

  text = await rpg_text.Party_Heros(Owner);
  count++;

  /*
  bild = await rpg_text.Image_Story(Owner);
  console.log(bild);
  */

  var db = require("@syth/database");
  var story = await db.RPG_Story.query().where("owner", Owner);
  for (var i = 0; i < story.length ; i++ ) {
    //console.log((i+1) + ". "+story[i].user+" ["+story[i].type+"]: " + story[i].message)
    console.log((i+1) + ": " + story[i].message.length + " - " + story[i].message);
  }

  process.exit();
}

dotest();
