/* eslint-disable @typescript-eslint/no-explicit-any */
import { Keyboard, VK } from 'vk-io';

const vk = new VK({
	token: process.env.VK_TOKEN
});

vk.updates.on('message', (context, next) => {
	const { messagePayload } = context;

	context.state.command = messagePayload && messagePayload.command
		? messagePayload.command
		: null;

	return next();
});

// Simple wrapper for commands
const hearCommand = (name: any, conditions: any, handle?: any) => {
	if (typeof handle !== 'function') {
		handle = conditions;
		conditions = [`/${name}`];
	}

	if (!Array.isArray(conditions)) {
		conditions = [conditions];
	}

	vk.updates.hear(
		[
			(text: any, { state }: any) => (
				state.command === name
			),
			...conditions
		],
		handle
	);
};

// Handle start button
hearCommand('start', (context: { state: { command: string }; send: (arg0: string) => any }, next: () => any) => {
	context.state.command = 'help';

	return Promise.all([
		context.send('Hello!'),

		next()
	]);
});

hearCommand('help', async (context: { send: (arg0: { message: string; keyboard: any }) => any }) => {
	await context.send({
		keyboard: Keyboard.builder()
			.textButton({
				label: 'The help',
				payload: {
					command: 'help'
				}
			})
			.row()
			.textButton({
				label: 'The current date',
				payload: {
					command: 'time'
				}
			})
			.row()
			.textButton({
                color: Keyboard.PRIMARY_COLOR,
				label: 'Cat photo',
				payload: {
					command: 'cat'
				},
			})
			.textButton({
                color: Keyboard.PRIMARY_COLOR,
				label: 'Cat purring',
				payload: {
					command: 'purr'
				},
            }),
        message: `My commands list
            /help - The help
            /time - The current date
            /cat - Cat photo
            /purr - Cat purring`,
	});
});

hearCommand('cat', async (context: { send: (arg0: string) => any; sendPhotos: (arg0: string) => any }) => {
	await Promise.all([
		context.send('Wait for the uploads awesome 😻'),

		context.sendPhotos('https://loremflickr.com/400/300/')
	]);
});

hearCommand('time', ['/time', '/date'], async (context: { send: (arg0: string) => any }) => {
    console.log(vk);
	await context.send(String(new Date()));
});

const catsPurring = [
	'http://ronsen.org/purrfectsounds/purrs/trip.mp3',
	'http://ronsen.org/purrfectsounds/purrs/maja.mp3',
	'http://ronsen.org/purrfectsounds/purrs/chicken.mp3'
];

hearCommand('purr', async (context: { send: (arg0: string) => any; sendAudioMessage: (arg0: string) => any }) => {
	const link = catsPurring[Math.floor(Math.random() * catsPurring.length)];

	await Promise.all([
		context.send('Wait for the uploads purring 😻'),

		context.sendAudioMessage(link)
	]);
});


export function start() {
    return vk.updates.start();
}