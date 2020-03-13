const axios = require('axios')
const Credenziali = require('../1_models/Credenziali')

const {
	Markup
} = require('telegraf');

const onMessage = (app, state) => {
	app.on('text', ctx => {
		const messaggio = ctx.message.text;
		const userId = ctx.message.from.id;
		if (!state[userId]) return



		switch (state[userId].command) {

			case 'insertUser':

				state[userId].username = messaggio
				ctx.replyWithMarkdown(`✅ Il nuovo User impostato è: ${messaggio}`)
				Credenziali.findOneAndUpdate({chatid:userId},{user:messaggio}, {new: true, useFindAndModify: false}, (err,res) => {
					console.log(res);
				})
				break

			case 'insertPass':

				state[userId].password = messaggio
				ctx.replyWithMarkdown(`✅ La nuova Pass impostata è: ${messaggio}`)
				Credenziali.findOneAndUpdate({chatid:userId},{pass:messaggio}, {new: true, useFindAndModify: false}, (err,res) => {
					console.log(res);
				})
				break

			default:

				const subreddit = ctx.message.text;
				const type = !state[userId] ?
					'top' :
					state[userId].command ?
					state[userId].command :
					'top';

				if (!state[userId])
					state[userId] = {};
				state[userId].index = 0;

				axios.get(`https://reddit.com/r/${subreddit}/${type}.json?limit=10`)
					.then(res => {
						const data = res.data.data;
						if (data.children.length < 1)
							return ctx.reply('The subreddit couldn\'t be found.');

						const link = `https://reddit.com/${data.children[0].data.permalink}`;
						console.log('test')
						return ctx.reply(link,
							Markup.inlineKeyboard([
								Markup.callbackButton('➡️ Next', subreddit),
							]).extra()
						);
					})
					.catch(err => console.log(err));
		}
	});
}

module.exports = {
	onMessage
}