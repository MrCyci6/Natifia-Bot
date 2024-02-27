const Discord = require('discord.js')
const moment = require('moment')
const fs = require('fs')
const cheerio = require('cheerio')

const ticketLog = require('../../utils/ticketLog.js')
const db = require('../../utils/DBUtils.js')

module.exports = async (client, interaction) => {
	try {

	    if(interaction.isCommand()) {
	    	const color = client.config.embed.color
			const cmd = client.commands.get(interaction.commandName)
			if(cmd) await cmd.execute(client, interaction, color)
		}

		if(interaction.isButton()) {
			if(interaction.customId === "supp") {
				
				try {
					let conn = await db.db.getConnection()
				    let ticketInfos = await conn.query(`SELECT * FROM tickets WHERE channelid = "${interaction.channel.id}"`)
				    conn.release()

				    if(ticketInfos != "") {
				    	let openUser = interaction.guild.members.cache.get(ticketInfos[0].openuserid)
				    	let openDate = moment(ticketInfos[0].opendate).format('DD/MM/YYYY')

						await conn.query(`DELETE FROM tickets WHERE channelid = "${interaction.channel.id}"`)
						conn.release()

				    	let closeUser = interaction.guild.members.cache.get(interaction.user.id)
				    	let closeDate = moment(Date.now()).format('DD/MM/YYYY')

				    	if(!openUser) return
				    	ticketLog(client, openUser, closeUser, openDate, closeDate, interaction.channel.name, interaction.channel.topic, ticketInfos[0].id)
				    }
				} catch (e) {
					console.log(`[DATABASE ERROR][TICKET] - ${e}`)
				}
				
				interaction.channel.delete()
			}

		}

		if(interaction.customId == "ticket") {

			let button = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('supp')
                        .setLabel("❌ Supprimer")
                        .setStyle("Danger")
                        .setDisabled(false)
                )

		    let DejaUnChannel = interaction.guild.channels.cache.find(c => c.topic == interaction.user.id)

			if(DejaUnChannel) return interaction.reply({content: `:x: Vous avez déjà un ticket d'ouvert`, ephemeral: true})

			let c = await interaction.guild.channels.create({
				name: `ticket-${interaction.user.username}_${moment(Date.now()).format("DD-MM-YYYY")}`,
		        type: 0,
		        topic: `${interaction.user.id}`,
		        parent: `${client.config.categories.ticket}`,
		        permissionOverwrites: [
		            {   
		                id: interaction.guild.id,
		                deny: [Discord.PermissionsBitField.Flags.ViewChannel]
		            },
		            {
		                id: interaction.user.id,
		                allow: [Discord.PermissionsBitField.Flags.ViewChannel]
		            },
		            {
		                id: client.config.roles.staff,
		                allow: [Discord.PermissionsBitField.Flags.ViewChannel]
		            }
		        ]
		    })

	        const tick = new Discord.EmbedBuilder()
	            .setTitle(`🎟️ Support - ${interaction.values[0]}`)
	            .setColor(client.config.embed.color)
	            .setDescription(`
Bonjour ${interaction.user},

Merci d'avoir contacté le support de **${client.config.bot.name}**

Veuillez décrire votre problème afin que nous puissions vous aider au mieux`)
	            .setFooter({text: `© ${client.config.server.year} - ${client.config.server.name}`, iconURL: client.user.displayAvatarURL({dynamic: true})})

	        c.send({embeds: [tick], content: `${interaction.user}`, components: [button]})
	        interaction.reply({content: `:white_check_mark: Votre ticket à été ouvert avec succès. <#${c.id}>`, ephemeral: true})

	        try {
		        fs.readFile('./tickets/ticket-template.html', 'utf-8', (err, data) => {
					if(err) return console.log(err)

					const $ = cheerio.load(data, { decodeEntities: false })

					$('#participants').append(`

                        <div class="user-box">
                            <img
                                src="{PARTICIPANT_URL}"><a>{PARTICIPANT_NAME}#{PARTICIPANT_DISCRIMINATOR}</a>
                        </div>`
						.replaceAll("{PARTICIPANT_URL}", interaction.user.displayAvatarURL())
						.replaceAll("{PARTICIPANT_NAME}", interaction.user.username)
						.replaceAll("{PARTICIPANT_DISCRIMINATOR}", interaction.user.discriminator == 0 ? "0000" : interaction.user.discriminator))

					const newTicket = $.html().replaceAll("{CREATOR_NAME}", interaction.user.username)
						.replaceAll("{CREATOR_DISCRIMINATOR}", interaction.user.discriminator == 0 ? "0000" : interaction.user.discriminator)
						.replaceAll('{CREATOR_ID}', interaction.user.id)
						.replaceAll("{TICKET_DATE}", moment(Date.now()).format("DD/MM/YYYY"))
						.replaceAll("{TICKET_NAME}", c.name)
						.replaceAll("{SUPPORT}", interaction.values[0])
						.replaceAll("{PSEUDO}", interaction.user.username)

					fs.writeFile(`./tickets/${interaction.user.id}_${c.name}.html`, newTicket, 'utf-8', err => {
						if(err) return console.log(err)
					})
				})
			} catch (e) {
				console.log(`[TRANSCRIPTION ERROR] - ${e}`)
			}

	        try {
				await db.query(`INSERT INTO tickets (openuserid, channelid) VALUES ("${interaction.user.id}", "${c.id}")`)
	        } catch (e) {
	        	interaction.reply({content: `[DATABASE ERROR][TICKET] - Une erreur est survenue lors de la connexion à la base de données.\nConsulter la console pour plus d'informations`, ephemeral: true})
	        	console.log(`[DATABASE ERROR][TICKET] - ${e}`)
	        }
		}

	} catch (err) {
		console.log(err)
	}
}