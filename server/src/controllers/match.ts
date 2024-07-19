import db, { createQuestions } from "../db";
import { multiUnicast, unicast } from "../utils";
import { Message, MessageType } from "../db/models/message";

export const USER_NUMBER = 2;

let currentQIndex = 0;

const sleep = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function startMatch() {
	createQuestions();
	await sleep(2000);
	for (const _ of Array(db.questions.length)) {
		await sendQuestion(currentQIndex);
		await sleep(5000); // wait to see answer
		currentQIndex += 1;
	}
	endMatch();
}

const upsertAnswer = (data: Message) => {
	const answer = db.usersAnswers.find(
		(o) => o.username === data.username && o.questionNumber === data.questionNumber
	);
	if (answer) answer.answerNumber = data.answer;
	else {
		db.usersAnswers.push({
			username: data.username,
			questionNumber: data.questionNumber,
			answerNumber: data.answer
		});
	}
};
export function getAnswer(data: Message, socket) {
	if (data.username == null || data.answer == null) {
		unicast({ type: MessageType.Error, message: "Lack of info" }, socket);
		return;
	}
	if (data.questionNumber !== currentQIndex + 1) {
		unicast({ type: MessageType.Error, message: "Bad Request" }, socket);
		return;
	}
	upsertAnswer(data);
}

async function sendQuestion(qIndex: number) {
	let q = Object.assign({}, db.questions[qIndex]);
	console.log("question sent");
	delete q.correctAnswer;
	if (!q.time) q.time = 10;
	multiUnicast({ type: MessageType.Question, question: q });

	await sleep(11000); // wait to answer

	sendCorrectAnswer(db.questions[qIndex].correctAnswer, qIndex + 1);
}

function sendCorrectAnswer(correctAnswer: number, questionNumber: number) {
	multiUnicast({
		type: MessageType.CorrectAnswer,
		answer: correctAnswer,
		questionNumber
	});
}

export function sendUsers() {
	let users = db.users.map((user) => ({ username: user.username, ready: user.ready }));
	multiUnicast({ type: MessageType.Users, message: users });
}
function endMatch() {
	db.users.forEach((user) => {
		user.ready = false;
	});
	currentQIndex = 0;
	multiUnicast({
		type: MessageType.Results,
		message: calculateUserScores()
	});
	db.usersAnswers = [];
}

function calculateUserScores() {
	let usersScores = {};
	db.users.forEach((user) => {
		usersScores[user.username] = {};
		usersScores[user.username].score = 0;
	});
	db.usersAnswers.forEach((item) => {
		if (usersScores[item.username] && item.answerNumber === db.questions[item.questionNumber - 1].correctAnswer) {
			usersScores[item.username].score++;
		}
	});
	return usersScores;
}
