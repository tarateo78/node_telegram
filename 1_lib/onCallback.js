const axios = require('axios')
const { Markup } = require('telegraf');

const onCallback = (app, state) => {
	app.on('callback_query', ctx => {
		const chiamata = ctx.update.callback_query.data

		if (chiamata == 'userChange') {
			const userId = ctx.update.callback_query.from.id;

			state[userId].command = 'insertUser';
			return ctx.replyWithMarkdown(`👤 Inserisci un nuovo User...`)
			
		}
		else {
			
			const subreddit = ctx.update.callback_query.data;
			const userId = ctx.update.callback_query.from.id;
			
			let type;
			let index;
			try {
			type = state[userId].command ? state[userId].command : 'top';
			index = state[userId].index;
			} catch (err) {
			return ctx.reply('Send a subreddit name.');
			}
		
			//ctx.answerCallbackQuery('Wait...');
			
			axios.get(`https://reddit.com/r/${subreddit}/${type}.json?limit=10`)
			.then(res => {
				const data = res.data.data;
				if (!data.children[index + 1])
				return ctx.reply('No more posts!');
		
				const link = `https://reddit.com/${data.children[index + 1].data.permalink}`;
				state[userId].index = state[userId].index + 1;
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
	onCallback
}