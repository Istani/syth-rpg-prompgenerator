var rpg_text = require("@syth/rpg-prompt");

async function dotest() {
  var count=0;
  var text="";
  var bild="";


  text = await rpg_text.Start_Story("Test");
  console.log(count++, text);

  text = await rpg_text.Spawn_Monster("Test");
  console.log(count++, text);

  for (var i = 0 ; i < 10; i++) {
    text = await rpg_text.Attack_Monster("Test", "Sascha");
    console.log(count++, text);

    text = await rpg_text.Attack_Monster("Test", "BobSanGG");
    console.log(count++, text);

    text = await rpg_text.Attack_Monster("Test", "Yunkeed");
    console.log(count++, text);

    text = await rpg_text.Attack_Monster("Test", "BobSanGG");
    console.log(count++, text);

    text = await rpg_text.Attack_Monster("Test", "Sascha");
    console.log(count++, text);

    text = await rpg_text.Defence_Monster("Test", "BobSanGG");
    console.log(count++, text);

    text = await rpg_text.Collect_Item("Test", "BobSanGG", "Heilkraut");
    console.log(count++, text);

    text = await rpg_text.Use_Item("Test", "BobSanGG", "Heilkraut");
    console.log(count++, text);
  }

  text = await rpg_text.Kill_Monster("Test", "BobSanGG");
  console.log(count++, text);

  text = await rpg_text.Party_Heros("Test");
  console.log(count++, text);

  //console.log("Attack_Monster");
  //bild = await rpg_text.Image_Story("Test");
  //console.log(bild);

  process.exit();
}

dotest();