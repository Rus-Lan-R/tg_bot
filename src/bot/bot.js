const { RecipeSearchClient } = require("edamam-api");
require("dotenv").config();
const UserTG = require("../model/user.tg.model");
const { pictures } = require("../helpers/pictures");

const client = new RecipeSearchClient({
  appId: process.env.AppId,
  appKey: process.env.AppKey,
});
const fetch = require("node-fetch");
const TelegramBot = require("node-telegram-bot-api");
// Create a bot that uses 'polling' to fetch new updates
const Promise = require("bluebird");
Promise.config({
  cancellation: true,
});
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const { COMMANDS, getHelp } = require("./constants/constants");
const LoggsTG = require("../model/loggs.tg.model");

const botListiner = async () => {
  let response = {};
  let currentRecipe;
  bot.setMyCommands(COMMANDS);

  // bot.sendMessage(chatId, "Привет,!?", {
  //   // прикрутим клаву
  //   reply_markup: {
  //     inline_keyboard: [[{ text: "text", callback_data: "/path" }]],
  //   },
  // });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    try {
      await LoggsTG.create({ ...msg, botName: "Cats" });
    } catch (err) {
      console.log("error linne 39", err);
    }

    try {
      await UserTG.findOneAndUpdate(
        { chatId },
        { $inc: { count_requests: +1 } },
      );
    } catch (error) {
      bot.sendMessage(chatId, `error - ${error.code}`);
      console.log("error linne 39", error);
    }

    switch (msg.text) {
      case "/lipsiha":
        bot.sendAudio(
          chatId,
          "https://zamp3.net/uploads/music/2021/09/instasamka-lipsi-ha-mp3.mp3",
        );
        break;
      case "/location":
        bot
          .sendLocation(msg.chat.id, 35.804819, 51.43407, {
            live_period: 86400,
          })
          .then(() => console.log("sad"));

        break;
      case "/stats":
        bot
          .getChatMembersCount(chatId)
          .then((data) => bot.sendMessage(chatId, `count - ${data}`));

        break;

      case "/start":
        try {
          await UserTG.create({
            botName: "Cats",
            chatId: msg.from.id,
            is_bot: msg.from.is_bot,
            first_name: msg.from?.first_name,
            last_name: msg.from?.last_name,
            username: msg.from?.username,
            language_code: msg.from?.language_code,
          });

          bot.sendMessage(chatId, "ok");
        } catch (error) {
          console.log(error);
          bot.sendMessage(chatId, `error - ${error.code}`);
        }

        break;
      case "/help":
        bot.sendMessage(
          chatId,
          `${msg.from.username} - на этом мои полномочия все, тут уже ничем не помочь  :-)`,
        );

        break;
      case "/cat": {
        bot.sendMessage(chatId, "#туттипакат");

        const request = await fetch("https://aws.random.cat/meow");
        const response = await request.json();

        bot.sendPhoto(chatId, response.file);
      }

      case "/wish":
        bot.sendMessage(chatId, "#туттипапажэлание");

        bot.sendPhoto(
          chatId,
          pictures[Math.floor(Math.random() * (pictures.length - 1)) + 1],
        );
        break;

      case "/stephani": {
        bot.sendMessage(
          1040051527,
          ` - лови кота и пожелание - \n  - только ты бесплатно получаешь -`,
        );
        bot.sendPhoto(
          1040051527,
          pictures[Math.floor(Math.random() * (pictures.length - 1)) + 1],
        );
        const request = await fetch("https://aws.random.cat/meow");
        const response = await request.json();

        bot.sendPhoto(1040051527, response.file);
      }
      case "/tat": {
        bot.sendMessage(
          965155230,
          ` - лови кота и пожелание - \n- только ты бесплатно получаешь -`,
        );
        bot.sendPhoto(
          965155230,
          pictures[Math.floor(Math.random() * (pictures.length - 1)) + 1],
        );
        bot.sendAudio(
          965155230,
          "https://zamp3.net/uploads/music/2021/09/instasamka-lipsi-ha-mp3.mp3",
        );
        const request = await fetch("https://aws.random.cat/meow");
        const response = await request.json();

        bot.sendPhoto(1040051527, response.file);
      }

      case msg.text:
        bot.sendMessage(
          chatId,
          `${msg.from.username}  сейчас бы на кнопки всякие нажимать `,
          {
            reply_markup: {
              keyboard: [
                ["/wish", "/cat"],
                ["/help", "какая-то х-та", "самоуничтожение"],
                [
                  {
                    text: "https://pozhelaniya-cats.herokuapp.com/",
                    url: "https://pozhelaniya-cats.herokuapp.com/",
                  },
                ],
              ],
            },
          },
        );
        break;
    }

    // bot.onText("/location", (msg) => {
    //   const opts = {
    //     reply_markup: JSON.stringify({
    //       keyboard: [
    //         [{ text: "Location", request_location: true }],
    //         [{ text: "Contact", request_contact: true }],
    //       ],
    //       resize_keyboard: true,
    //       one_time_keyboard: true,
    //     }),
    //   };
    //   console.log("location");
    //   bot.sendMessage(msg.chat.id, "Contact and Location request", opts);
    // });

    // bot.on("location", (msg) => {
    //   console.log(msg.location.latitude);
    //   console.log(msg.location.longitude);
    // });
  });
};

module.exports = { botListiner };
