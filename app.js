var RPG_AI_Text = require("@syth/rpg-prompt");

async function dotest() {
  var Owner = "Test";
  // --------------------------

  await RPG_AI_Text.Start_Story(Owner);
  await RPG_AI_Text.Spawn_Monster(Owner);

  for (var i = 0 ; i < 5; i++) {
    await RPG_AI_Text.Attack_Monster(Owner, "Sascha");
    await RPG_AI_Text.Attack_Monster(Owner, "BobSanGG");
    await RPG_AI_Text.Attack_Monster(Owner, "Yunkeed");
    await RPG_AI_Text.Attack_Monster(Owner, "BobSanGG");
    await RPG_AI_Text.Attack_Monster(Owner, "Sascha");
    await RPG_AI_Text.Defence_Monster(Owner, "BobSanGG");
    await RPG_AI_Text.Attack_Monster(Owner, "Sascha");
    await RPG_AI_Text.Attack_Monster(Owner, "Yunkeed");
    await RPG_AI_Text.Attack_Monster(Owner, "BobSanGG");
    await RPG_AI_Text.Attack_Monster(Owner, "Lydia");
    await RPG_AI_Text.Attack_Monster(Owner, "Rene");
    await RPG_AI_Text.Defence_Monster(Owner, "BobSanGG");
    await RPG_AI_Text.Collect_Item(Owner, "BobSanGG", "Heilkraut");
    await RPG_AI_Text.Use_Item(Owner, "BobSanGG", "Heilkraut");
  }

  await RPG_AI_Text.Kill_Monster(Owner, "BobSanGG");
  await RPG_AI_Text.Party_Heros(Owner);
  await RPG_AI_Text.Image_Story(Owner);


  var db = require("@syth/database");
  var story = await db.RPG_Story.query().where("owner", Owner);
  for (var i = 0; i < story.length ; i++ ) {
    //console.log((i+1) + ". "+story[i].user+" ["+story[i].type+"]: " + story[i].message)
    console.log((i+1) + ": ["+story[i].type+"]" + story[i].message.length + " - " + story[i].message);
  }

  
  // Die passieren nicht in der Datenbank:
  console.log(" --- Ohne DB ---");
  console.log(await RPG_AI_Text.Failed_Collect_Item(Owner, "Istani"));
  console.log(await RPG_AI_Text.Failed_Use_Item(Owner, "Istani", "Heilkraut"));
  console.log(await RPG_AI_Text.Failed_Spawn_Monster(Owner));
  console.log(await RPG_AI_Text.Failed_Attack_Monster(Owner, "Istani"));


  process.exit();
}

dotest();
