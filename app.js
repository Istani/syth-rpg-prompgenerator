var rpg_text = require("@syth/rpg-prompt");

async function dotest() {
  var Owner = "Test";
  // --------------------------

  await rpg_text.Start_Story(Owner);
  await rpg_text.Spawn_Monster(Owner);

  for (var i = 0 ; i < 7; i++) {
    await rpg_text.Attack_Monster(Owner, "Sascha");
    await rpg_text.Attack_Monster(Owner, "BobSanGG");
    await rpg_text.Attack_Monster(Owner, "Yunkeed");
    await rpg_text.Attack_Monster(Owner, "BobSanGG");
    await rpg_text.Attack_Monster(Owner, "Sascha");
    await rpg_text.Defence_Monster(Owner, "BobSanGG");
    await rpg_text.Attack_Monster(Owner, "Sascha");
    await rpg_text.Attack_Monster(Owner, "Yunkeed");
    await rpg_text.Attack_Monster(Owner, "BobSanGG");
    await rpg_text.Attack_Monster(Owner, "Lydia");
    await rpg_text.Attack_Monster(Owner, "Rene");
    await rpg_text.Defence_Monster(Owner, "BobSanGG");
    await rpg_text.Collect_Item(Owner, "BobSanGG", "Heilkraut");
    await rpg_text.Use_Item(Owner, "BobSanGG", "Heilkraut");
  }

  await rpg_text.Kill_Monster(Owner, "BobSanGG");
  await rpg_text.Party_Heros(Owner);
  await rpg_text.Image_Story(Owner);

  var db = require("@syth/database");
  var story = await db.RPG_Story.query().where("owner", Owner);
  for (var i = 0; i < story.length ; i++ ) {
    //console.log((i+1) + ". "+story[i].user+" ["+story[i].type+"]: " + story[i].message)
    console.log((i+1) + ": " + story[i].message.length + " - " + story[i].message);
  }

  process.exit();
}

dotest();
