import { Collection, Intents } from 'discord.js'
import 'dotenv/config'

import location from './commands/location/index.js'
import './deploy-commands.js'
import Client from './utils/discord/Client.js'

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.commands = new Collection()
client.commands.set(location.data.name, location)

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName)

    if (!command) return

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error executing this command.',
        ephemeral: true,
      })
    }
  }

  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName)

    if (!command) return

    try {
      await command.executeAutocomplete(interaction)
    } catch (error) {
      console.error(error)
    }
  }
})

client.login(process.env.BOT_TOKEN)
