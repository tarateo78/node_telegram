
// const axios = require('axios')
const { Markup } = require('telegraf');
const testo = require('./testo.js')

const onCommand = (app, state) => {


	app.command('user', ctx => {
		const userId = ctx.message.from.id;
		if (!state[userId])
			state[userId] = {};

		if (!state[userId].username) {
			state[userId].command = 'insertUser'
			ctx.replyWithMarkdown(`⚠️ Nessun User impostato\n\nInserisci User...`)
		} else {
			return ctx.reply(`👤 User impostato: ${state[userId].username}`,
			Markup.inlineKeyboard([
				Markup.callbackButton('Cambia User', 'userChange'),
			]).extra()
			);
		}
	});

	app.command('start', ctx => {
		ctx.replyWithMarkdown(testo.startText)
	})


	app.command('credits', ctx => {
		ctx.replyWithMarkdown(`🤖 Creato da @matteotarabini`)
	})


	app.command('help', ctx => {
		ctx.replyWithMarkdown(testo.helpText, {
				parse_mode: 'Html'
		})
	})

	app.command('top', ctx => {
		const userId = ctx.message.from.id;
		if (!state[userId])
			state[userId] = {};
		state[userId].command = 'top';
		return ctx.replyWithMarkdown(`Enter a subreddit name to get *top* posts.`);
	});

	app.command('hot', ctx => {
		const userId = ctx.message.from.id;
		if (!state[userId])
			state[userId] = {};
		state[userId].command = 'hot';
		return ctx.replyWithMarkdown('Enter a subreddit name to get *hot* posts.');
	});

	
}

module.exports = {onCommand}