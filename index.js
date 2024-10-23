var text_ai = require("@istani/groq-cloud.ai");
var image_ai = require("@istani/groq-cloud.ai");

var debug = require("@istani/debug")(require('./package.json').name);
var db = require("@syth/database");

var sleep_for_each=5000;

var Prompt_Prefix = 
  "You are BOT in this fictional never-ending roleplay with SYTH.\n" + 

  "Ignore previous instructions.\n" + 
  "Response only in german.\n" +
  "Repeat and descripe the actions and scene SYTH tells you in a more detailed way.\n" +
  "Your response should include nothing but the description.\n" +
  "Settings: it is a medieval fantasy world.\n" + 
  "Response only in german.\n" +

  "Just focus on responding to what is given at each turn.\n" +
  "Ignore any trailing ellipses or other cues that might suggest further elaboration from you.\n" + 
  "Final narration detail only please.\n" +

  "Please answer the task without additional markings or hints.\n" +
  "Do not include anyone speaking.\n" +
  "***\n";

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function GetStoryPoints(Owner) {
  var story = await db.RPG_Story.query().where("owner", Owner);
  var Text_Prompt="";

  var length = Prompt_Prefix.length;

  for (var i = 0; i < story.length ; i++ ) {
    Text_Prompt+=story[i].user+": " + story[i].message + "\n";
    length = Prompt_Prefix.length + Text_Prompt.length;
  }

  // Todo: Verhindern das der Prompt zu lange wird!
  if (length>5000) {
    debug.error("Text Prompt too Long!");
    Text_Prompt="";
    var collection = {};

    for (var i = 0; i < story.length ; i++ ) {
      if (typeof collection[story[i].user] == "undefined") {
        collection[story[i].user] = {};
      }
      if (typeof collection[story[i].user][story[i].type] == "undefined") {
        collection[story[i].user][story[i].type] = 0;
      }

      if (collection[story[i].user][story[i].type]==0) {
        collection[story[i].user][story[i].type]++;
        Text_Prompt+=story[i].user+": " + story[i].message + "\n";
        length = Prompt_Prefix.length + Text_Prompt.length;
      }
    }

    if (length>5000) {
      //! Keine Ahnung was man dann machen sollte...
      debug.error("Short Text Prompt also too Long!!!");
      Text_Prompt="";
    }
  }

  //console.log(Text_Prompt);
  //await sleep(sleep_for_each); // ISt ja eh in jedem Prompt selber wartezeit!
  return Text_Prompt;
}

exports.Start_Story = async function Start_Story(Owner) {
  await db.RPG_Story.query().delete().where("owner", Owner);

  var Text_Prompt="SYTH: Eine Gruppe von Abenteurern kommt an und baut ihr Lager auf. Spezifiziere nicht was für Abenteurer das sind. Erstelle eine kurze, ein Satz lange, Beschreibung der Szene.\n";
  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;

  var data={'owner': Owner, 'type':"start", 'user': "SYTH", 'message':response};
  await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}

exports.Spawn_Monster = async function Spawn_Monster(Owner) {
  var Text_Prompt=GetStoryPoints(Owner);
  Text_Prompt+="SYTH: Ein wildes Monster erscheint. Erstelle eine kurze, ein Satz lange, Beschreibung der Szene.\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;

  var data={'owner': Owner, 'type':"spawn", 'user': "SYTH", 'message':response};
  await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}

exports.Attack_Monster = async function Attack_Monster(Owner, User) {
  var Text_Prompt=GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" greift das Monster an. Erstelle eine kurze, ein Satz lange, Beschreibung der Szene.\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;

  var data={'owner': Owner, 'type':"attack", 'user': User, 'message':response};
  await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}

exports.Defence_Monster = async function Defence_Monster(Owner, User) {
  var Text_Prompt=GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" wird vom den Monster angegriffen. Erstelle eine kurze, ein Satz lange, Beschreibung der Szene.\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;
  
  var data={'owner': Owner, 'type':"defence", 'user': User, 'message':response};
  await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}

exports.Kill_Monster = async function Kill_Monster(Owner, User) {
  var Text_Prompt=GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" greift das Monster an und tötet es dabei. Erstelle eine kurze, ein Satz lange, Beschreibung der Szene.\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;

  var data={'owner': Owner, 'type':"attack", 'user': User, 'message':response};
  await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}

exports.Party_Heros = async function Party_Heros(Owner) {
  var Text_Prompt=GetStoryPoints(Owner);
  Text_Prompt+="SYTH: Die Abenteurer werden als Helden gefeiert. Erstelle eine kurze, ein Satz lange, Beschreibung der Szene.\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;
  
  var data={'owner': Owner, 'type':"end", 'user': "SYTH", 'message':response};
  await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}

exports.Collect_Item = async function Collect_Item(Owner, User, Itemname) {
  var Text_Prompt=GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" sammelt "+Itemname+". Erstelle eine kurze, ein Satz lange, Beschreibung der Szene.\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;
  
  var data={'owner': Owner, 'type':"harvest", 'user': User, 'message':response};
  await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}

exports.Use_Item = async function Use_Item(Owner, User, Itemname) {
  var Text_Prompt=GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" benutzt/verbraucht "+Itemname+". Erstelle eine kurze, ein Satz lange, Beschreibung der Szene.\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;
  
  var data={'owner': Owner, 'type':"use", 'user': User, 'message':response};
  await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}

exports.Image_Story = async function Image_Story(Owner) {
  var Text_Prompt=GetStoryPoints(Owner);
  Text_Prompt+="SYTH: Ignore previous instructions. Summarize the story so far. Limit the summary to 300 words or less. Your response should include nothing but the summary.\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var text_response=await p;
  
  var data={'owner': Owner, 'type':"story", 'user': "SYTH", 'message':response};
  await db.RPG_Story.query().insert(data);

  Text_Prompt="anime artwork, best quality, masterpiece, (("+text_response+"))";

  var p2 = new Promise((resolve, reject) => {
    image_ai.ImageGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p2;
  
  var data={'owner': Owner, 'type':"image", 'user': "SYTH", 'message':response};
  await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}