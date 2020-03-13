const {
	Markup
} = require('telegraf');
const testo = require('./testo.js')
const Credenziali = require('../1_models/Credenziali')

const onCommand = (app, state) => {


	app.command('user', async ctx => {
		const userId = ctx.message.from.id;
		if (!state[userId])
			state[userId] = {};

		await Credenziali.findOne({
			chatid: userId
		}, (err, res) => {
			if (res.user) state[userId].username = res.user


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
		})
	});


	app.command('pass', async ctx => {
		const userId = ctx.message.from.id;
		if (!state[userId])
			state[userId] = {};

		await Credenziali.findOne({
			chatid: userId
		}, (err, res) => {
			if (res.pass) state[userId].password = res.pass


			if (!state[userId].password) {
				state[userId].command = 'insertPass'
				ctx.replyWithMarkdown(`⚠️ Nessuna Pass impostata\n\nInserisci Pass...`)
			} else {
				return ctx.reply(`🔑 Pass impostata: ${state[userId].password}`,
					Markup.inlineKeyboard([
						Markup.callbackButton('Cambia Pass', 'passChange'),
					]).extra()
				);
			}
		})
	});


	app.command('save', ctx => {
		const userId = ctx.message.from.id;
		if (!state[userId])
			state[userId] = {};
		const credenziali = new Credenziali({
			chatid: userId,
			user: state[userId].username,
			pass: state[userId].password,
		})
		credenziali.save()
	})


	app.command('restore', ctx => {
		const userId = ctx.message.from.id;
		if (!state[userId])
			state[userId] = {};
		Credenziali.findOne({
			chatid: userId
		}, (err, res) => {
			console.log(res);

		})
	})


	app.command('start', ctx => {
		ctx.replyWithMarkdown(testo.startText)
		const userId = ctx.message.from.id;

		// upsert se non esiste
		Credenziali.findOneAndUpdate({
				chatid: userId
			}, {
				random: "x"
			}, {
				upsert: true,
				new: true,
				setDefaultsOnInsert: true,
				useFindAndModify: false
			},
			(err, res) => {
				console.log(res);
			}
		)

	})


	app.command('id', ctx => {
		ctx.replyWithMarkdown(`La tua chat id è: ${ctx.message.chat.id}`)
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

module.exports = {
	onCommand
}