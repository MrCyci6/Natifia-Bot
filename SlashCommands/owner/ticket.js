const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Panel des tickets'),

	async execute(client, interaction, color) {
		if(client.config.owners.includes(interaction.user.id)) {

	       let row = new Discord.ActionRowBuilder()
                .addComponents(
	                new Discord.StringSelectMenuBuilder()
	                    .setCustomId('ticket')
	                    .setPlaceholder('Aucune catégorie sélectionnée')
	                    .addOptions([
	                        {
	                            label: '❓ Problème en jeu',
	                            description: 'Bugs,Duplication,etc...',
	                            value: '❓ Problème en jeu',
	                        },
	                        {
	                            label: '💎 Autres',
	                            description: 'Autres questions/problèmes.',
	                            value: '💎 Autres',
	                        },
	                        {
	                            label: '💸 Problème boutique',
	                            description: 'Problème avec un achat.',
	                            value: '💸 Problème boutique',
	                        },
	                        {
	                            label: '🎥 Partenaire',
	                            description: 'Demande de grade.',
	                            value: '🎥 Partenaire',
	                        }
	                    ]),
                )
                     
			const embed = new Discord.EmbedBuilder()
				.setTitle(`🎟️ ${client.config.server.name} » Support`)
				.setColor(color)
				.setFooter({text: `© ${client.config.server.year} - ${client.config.server.name} » Tickets`, iconURL: client.user.displayAvatarURL({dynamic: true})})
				.setDescription(`
Contactez notre support grâce à un ticket, il sera pris en charge dès que possible !

Afin de créer un ticket et obtenir de l'aide, réagissez avec la catégorie juste en dessous. :envelope_with_arrow:

:warning: Merci de préciser votre pseudo en expliquant votre problème, plainte ou requête !`)
				.setThumbnail(client.user.displayAvatarURL())

	        interaction.reply({embeds: [embed], components: [row]})
	    } else {
            interaction.reply({content: client.config.messages.noperm, ephemeral: true})
        }
	}
}