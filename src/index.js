const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
const initDb = require('./init')
const logger = require('./lib/logger')
const path = require('node:path')
const fs = require('node:fs')

initDb().then(async () => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] })
  client.commands = new Collection()
  client.once(Events.ClientReady, readyClient => {
    logger.info(`Ready! Logged in as ${readyClient.user.tag}`)
  })

  const foldersPath = path.join(__dirname, 'commands', 'utility')
  const commandFiles = fs
    .readdirSync(foldersPath)
    .filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file)
    const command = require(filePath)
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    }
  }

  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) {
      logger.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      await command.execute(interaction)
    } catch (e) {
      logger.error(e)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      }
    }
  })

  client.login(process.env.DISCORD_TOKEN)
})
