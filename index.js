var text_ai = require("@istani/groq-cloud.ai");
var image_ai = require("@istani/horde.ai");

var debug = require("@istani/debug")(require('./package.json').name);
var db = require("@syth/database");

var sleep_for_each=1000;
var token_length=6000;

var Prompt_Prefix = 
  "You are BOT in this fictional medieval fantasy roleplay with SYTH.\n" + 
  
  "Your response should include nothing but the description.\n" +
  "Just focus on responding to what is given by SYTH at each turn.\n" +
  "Ignore any trailing ellipses or other cues that might suggest further elaboration from you.\n" + 

  "Please answer the task without additional markings or hints.\n" +
  "Do not include anyone speaking.\n" +
  "Response only in german.\n" +
  "***\n";

var Prompt_Suffix =
  "Erstelle eine 70 Zeichen lange Beschreibung der Szene.";

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function GetStoryPoints(Owner) {
  var story = await db.RPG_Story.query().where("owner", Owner);
  var Text_Prompt="";

  var length = Prompt_Prefix.length;

  for (var i = 0; i < story.length ; i++ ) {
    //Text_Prompt+=story[i].user+": " + story[i].message + "\n";
    Text_Prompt+="BOT: " + story[i].message + "\n";
    length = Prompt_Prefix.length + Text_Prompt.length;
  }

  if (length>token_length) {
    debug.error("Text Prompt too Long! " + length + " Characters");
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
        //Text_Prompt+=story[i].user+": " + story[i].message + "\n";
        Text_Prompt+="BOT: " + story[i].message + "\n";
        length = Prompt_Prefix.length + Text_Prompt.length;
      }
    }

    if (length>token_length) {
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

  var Text_Prompt="SYTH: Eine Gruppe von Abenteurern kommt an und baut ihr Lager auf. Spezifiziere nicht was für Abenteurer das sind. " + Prompt_Suffix + "\n";
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
  var Text_Prompt=await GetStoryPoints(Owner);
  Text_Prompt+="SYTH: Ein wildes Monster erscheint. " + Prompt_Suffix + "\n";

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
  var Text_Prompt=await GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" greift das Monster an. " + Prompt_Suffix + "\n";

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
  var Text_Prompt=await GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" wird vom den Monster angegriffen. " + Prompt_Suffix + "\n";

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
  var Text_Prompt=await GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" greift das Monster an und tötet es dabei. " + Prompt_Suffix + "\n";

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
  var Text_Prompt=await GetStoryPoints(Owner);
  Text_Prompt+="SYTH: Die Abenteurer werden als Helden gefeiert. " + Prompt_Suffix + "\n";

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
  var Text_Prompt=await GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" sammelt "+Itemname+". " + Prompt_Suffix + "\n";

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
  var Text_Prompt=await GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" benutzt/verbraucht "+Itemname+". " + Prompt_Suffix + "\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;
  
  var data={'owner': Owner, 'type':"use", 'user': User, 'message':response};
  await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}

exports.Summary_Story = async function Summary_Story(Owner) {
  var Text_Prompt=await GetStoryPoints(Owner);
  Text_Prompt+="SYTH: Ignore previous instructions. Summarize the story. Limit the summary to 220 characters or less. Your response should include nothing but the detailed summary.\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;
  
  // ToDo: Change Table for Longer Text: table.text('message','text')
  var data={'owner': Owner, 'type':"story", 'user': "SYTH", 'message':response};
  await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}

exports.Image_Story = async function Image_Story(Owner) {
  var text_response = await exports.Summary_Story(Owner);
  Text_Prompt="anime artwork, best quality, masterpiece, (("+text_response+"))";

  var p2 = new Promise((resolve, reject) => {
    image_ai.ImageGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var img_response=await p2;

  // Download file?
  var p3 = new Promise((resolve, reject) => {
    const http = require('https'); // 'http' for http:// URLs or 'https' for https:// URLs
    const fs = require('fs');
    const path = require('path');
    const moment = require("moment");

    var dwn_path=path.join(__dirname , 'data', Owner+"_"+moment().format("x")+".png");
    const file = fs.createWriteStream(dwn_path);

    const request = http.get(img_response, function(response) {
      response.pipe(file);
      file.on("finish", async () => {
          file.close();
          var data={'owner': Owner, 'type':"image", 'user': "SYTH", 'message':dwn_path};
          await db.RPG_Story.query().insert(data);

          await sleep(sleep_for_each);
          resolve(dwn_path);
      });
    });
  });
  return await p3;
}


exports.Failed_Collect_Item = async function Failed_Collect_Item(Owner, User) {
  var Text_Prompt=await GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" konnte kein Item finden. " + Prompt_Suffix + "\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;
  
  //var data={'owner': Owner, 'type':"harvest", 'user': User, 'message':response};
  //await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}
exports.Failed_Use_Item = async function Failed_Use_Item(Owner, User, Itemname) {
  var Text_Prompt=await GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" hat kein "+Itemname+" Item zum bennutzen. " + Prompt_Suffix + "\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;
  
  //var data={'owner': Owner, 'type':"use", 'user': User, 'message':response};
  //await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}

exports.Failed_Spawn_Monster = async function Failed_Spawn_Monster(Owner) {
  var Text_Prompt=await GetStoryPoints(Owner);
  Text_Prompt+="SYTH: Im Moment ist alles ruhig, es ist kein Monster zu sehen. " + Prompt_Suffix + "\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;

  //var data={'owner': Owner, 'type':"spawn", 'user': "SYTH", 'message':response};
  //await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}

exports.Failed_Attack_Monster = async function Failed_Attack_Monster(Owner, User) {
  var Text_Prompt=await GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" versucht das Monster anzugreifen, kann sich wegen Verletzungen aber nicht bewegen. " + Prompt_Suffix + "\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;

  //var data={'owner': Owner, 'type':"attack", 'user': User, 'message':response};
  //await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}

exports.Cooldown = async function Cooldown(Owner, User) {
  var Text_Prompt=await GetStoryPoints(Owner);
  Text_Prompt+="SYTH: "+User+" ist noch mit der vorherigen Aktion beschäftigt. " + Prompt_Suffix + "\n";

  var p = new Promise((resolve, reject) => {
    text_ai.TextGeneration(Prompt_Prefix + Text_Prompt+" BOT:", (response) => { resolve(response); });
  });
  var response=await p;

  //var data={'owner': Owner, 'type':"attack", 'user': User, 'message':response};
  //await db.RPG_Story.query().insert(data);

  await sleep(sleep_for_each);
  return response;
}
