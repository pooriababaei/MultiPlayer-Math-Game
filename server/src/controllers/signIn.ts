import { Socket } from "socket.io";
import db, { updateUser } from "../db";
import { Message, MessageType } from "../db/models/message";
import { User } from "../db/models/user";
import { multiUnicast, unicast } from "../utils";
import { startMatch, USER_NUMBER, sendUsers } from "./match";

export function signIn(data: Message, socket: Socket) {
	if (data.username && db.users.length < USER_NUMBER) {
		const newUser: User = {
			username: data.username,
			score: 0,
			socket,
			ready: false
		};
		db.users.push(newUser);
	}
	sendUsers();
}

export function ready(data: Message, socket: Socket) {
	if (enoughReadyUsers()) {
		unicast(
			{
				type: MessageType.Error,
				message: "There are already " + USER_NUMBER + " users"
			},
			socket
		);
		return;
	}
	if (data.username) {
		updateUser(data.username, { ready: true });
		sendUsers();
		if (areAllUsersReady() === true && db.users.length === USER_NUMBER) {
			multiUnicast({ type: MessageType.StartMatch });
			// TODO: need ack from all users
			startMatch();
		}
	}
}

function enoughReadyUsers(): boolean {
	const readyUsers = db.users.reduce((count, user) => (user.ready ? count + 1 : count), 0);

	if (readyUsers >= USER_NUMBER) return true;
	return false;
}
function areAllUsersReady() {
	let result = true;
	db.users.forEach((item) => {
		if (item.ready == null || item.ready == false) result = false;
	});
	return result;
}
