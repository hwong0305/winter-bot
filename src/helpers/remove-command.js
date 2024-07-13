const { REST, Routes } = require('discord.js')
require('dotenv').config()

const rest = new REST().setToken(process.env.DISCORD_TOKEN)

;(async () => {
  try {
    const data = await rest.get(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      )
    )

    const commands = data.map(command => command.id)

    for (const command of commands) {
      await rest.delete(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          process.env.DISCORD_GUILD_ID
        ) +
          '/' +
          command
      )
    }
  } catch (err) {
    console.error(err)
  }
})()
