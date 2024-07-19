import { Question } from "./models/question";
import { User } from "./models/user";
import { UserAnswer } from "./models/userAnswer";
import { Socket } from "socket.io";

class Db {
	public users: User[] = [];
	public questions: Question[] = [];
	public usersAnswers: UserAnswer[] = [];
}
const db = new Db();

export function createQuestions() {
	const q1: Question = {
		number: 1,
		explanation: "10 * 6 / 5 =",
		answers: ["12", "12.5", "15"],
		correctAnswer: 1
	};
	const q2: Question = {
		number: 2,
		explanation: "(4 - 11) / 2 =",
		answers: ["-2", "-2.5", "-3.5"],
		correctAnswer: 3
	};
	const q3: Question = {
		number: 3,
		explanation: "57 + 97 =",
		answers: ["143", "154", "144"],
		correctAnswer: 2
	};
	const q4: Question = {
		number: 4,
		explanation: "(26 + 91) / X = 39",
		answers: ["X = 3", "X = 4", "X = 2"],
		correctAnswer: 1
	};
	const q5: Question = {
		number: 5,
		explanation: "123450 * 15 * 0 * 6 + 10 / 2 =",
		answers: ["63456676", "0", "5"],
		correctAnswer: 3
	};
	db.questions = [q1, q2, q3, q4, q5];
}

export function updateUser(username: string, obj: Partial<User>) {
	const userIndex = db.users.findIndex((item) => item.username == username);
	if (userIndex >= 0) db.users[userIndex] = { ...db.users[userIndex], ...obj };
}

export function deleteUserByUsername(username) {
	for (let i = 0; i < db.users.length; i++) {
		if (db.users[i].username === username) {
			db.users.splice(i, 1);
		}
	}
}
export function deleteUserBySocketAddres(socket: Socket) {
	for (let i = 0; i < db.users.length; i++) {
		if (
			//   db.users[i].socket.remotePort === socket.remotePort &&
			db.users[i].socket.handshake.address === socket.handshake.address
		) {
			db.users.splice(i, 1);
		}
	}
}

export default db;
