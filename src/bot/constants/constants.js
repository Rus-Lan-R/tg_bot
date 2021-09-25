const COMMANDS = [
  {
    command: "start",
    description: "Зарегистрироваться",
  },
  {
    command: "commands",
    description: "тут типа какая-то команда",
  },
  {
    command: "help",
    description: "Показать справку",
  },
  {
    command: "cat",
    description: "Получить кота",
  },
];

const getHelp = (chatId, bot) => {
  let helpText = `Телеграм-бот.\n*Доступные команды:*\n`;
  helpText += COMMANDS.map((command) => `*/${command.command}* ${command.description}`).join(`\n`);
  return bot.sendMessage(chatId, helpText, {
    parse_mode: "Markdown",
  });
};

module.exports = { COMMANDS, getHelp };
