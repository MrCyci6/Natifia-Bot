const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staff')
        .setDescription('Voir la liste des staffs'),

    async execute(client, interaction, color) {
        // interaction.guild.roles.cache.get('1061730204248191026').members.map(m=>m.user.id);

        let membersWithRoleFondateur = interaction.guild.roles.cache.get('1198231451209048074').members.map(m => m.user);
        let membersWithRoleAdmin = interaction.guild.roles.cache.get('1198231753425440798').members.map(m => m.user);
        let membersWithRoleResponsable = interaction.guild.roles.cache.get('1198232474304663612').members.map(m => m.user);
        let membersWithRoleModerateur = interaction.guild.roles.cache.get('1198232584493223976').members.map(m => m.user);
        let membersWithRoleGuide = interaction.guild.roles.cache.get('1198232638834618409').members.map(m => m.user);
        let membersWithRoleCM = interaction.guild.roles.cache.get('1198237247225466972').members.map(m => m.user);
        let membersWithRoleGraphiste = interaction.guild.roles.cache.get('1209275178672980019').members.map(m => m.user);
        let membersWithRoleDeveloppeur = interaction.guild.roles.cache.get('1198231894672818276').members.map(m => m.user);

        if (membersWithRoleAdmin.length < 1) membersWithRoleAdmin.push("``Aucun staff`");
        if (membersWithRoleResponsable.length < 1) membersWithRoleResponsable.push("`Aucun staff`");
        if (membersWithRoleModerateur.length < 1) membersWithRoleModerateur.push("`Aucun staff`");
        if (membersWithRoleGuide.length < 1) membersWithRoleGuide.push("`Aucun staff`");
        if (membersWithRoleCM.length < 1) membersWithRoleCM.push("`Aucun staff`");
        if (membersWithRoleGraphiste.length < 1) membersWithRoleGraphiste.push("`Aucun staff`");
        if (membersWithRoleDeveloppeur.length < 1) membersWithRoleGraphiste.push("`Aucun staff`");
        const embed = new Discord.EmbedBuilder()
            .setTitle(`${client.config.bot.name} » Liste des staffs`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(color)
            .addFields(
                {
                    name: `**👑・Fondateur**`,
                    value: `・${membersWithRoleFondateur.join("\n・")}`,
                    inline: true
                },
                {
                    name: `**🏆・Gérante Staff**`,
                    value: `・${membersWithRoleResponsableStaff.join("\n・")}`,
                    inline: true
                },
                {
                    name: `**♨️・Administrateur**`,
                    value: `・${membersWithRoleAdmin.join("\n・")}`,
                    inline: true
                },
                {
                    name: `**🔒・Responsable**`,
                    value: `・${membersWithRoleResponsable.join("\n・")}`,
                    inline: true
                },
                {
                    name: `**🎩・Modérateur**`,
                    value: `・${membersWithRoleModerateur.join("\n・")}`,
                    inline: true
                },
                {
                    name: `**🔎・Guide**`,
                    value: `・${membersWithRoleGuide.join("\n・")}`,
                    inline: true
                },
                {
                    name: `**💻・Développeur**`,
                    value: `・${membersWithRoleDeveloppeur.join("\n・")}`,
                    inline: true
                },
                {
                    name: `**📋・Communicant**`,
                    value: `・${membersWithRoleCM.join("\n・")}`,
                    inline: true
                },
                {
                    name: `**🎨・Graphiste**`,
                    value: `・${membersWithRoleGraphiste.join("\n・")}`,
                    inline: true
                }
            )
            .setFooter({ text: `© ${client.config.server.year} - ${client.config.server.name} » By Zelyphe` })
        interaction.reply({ embeds: [embed] });
    }
}