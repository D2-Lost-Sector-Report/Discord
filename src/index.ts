import {Client} from 'discord.js'
import {config} from './config'
import {commands} from './commands'
import {deployCommands} from './deploy-commands'

const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'DirectMessages'],
})

client.once('ready', () => {
  console.log('Bot is ready!')

  deployCommands()
    .then(() => {
      console.log('Registered commands successfully!')
    })
    .catch((error) => {
      console.error('Failed to register commands:', error)
    })
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }
  const {commandName} = interaction
  if (commands[commandName as keyof typeof commands]) {
    await commands[commandName as keyof typeof commands].execute(interaction)
  }
})

client.login(config.DISCORD_TOKEN)
  .then(() => {
    console.log('Logged in successfully!')
  })
  .catch((error) => {
    console.error('Failed to log in:', error)
  })