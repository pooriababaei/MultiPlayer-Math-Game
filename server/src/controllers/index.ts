import { Socket } from "socket.io";
import { deleteUserBySocketAddres } from "../db";
import { sendUsers } from "./match";

export function closeHandler(socket: Socket) {
	console.log("CLOSED:", socket.handshake.address);
	deleteUserBySocketAddres(socket);
	sendUsers();
}

// export function dataHandler(socket: Socket, data: Message) {
//   console.log('DATA from ' + socket.handshake.address + ' = ' + data);
//   switch (data.type) {
//     case MessageType.SIGNIN:
//       signIn(data, socket);
//       break;
//     case MessageType.ANSWER:
//       getAnswer(data, socket);
//       break;
//     case MessageType.READY:
//       ready(data, socket);
//       break;
//   }
// }
