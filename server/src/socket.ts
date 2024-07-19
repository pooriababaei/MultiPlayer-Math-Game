import { Server } from "socket.io";
import { MessageType } from "./db/models/message";
import { ready, signIn } from "./controllers/signIn";
import { getAnswer } from "./controllers/match";

const HOST = "127.0.0.1";
const PORT = 6969;
const io = new Server({});
import { closeHandler } from "./controllers";
export function initServerSocket() {
	io.listen(PORT, { cors: { origin: "*" } });

	io.on("connection", (socket) => {
		socket.on(MessageType.SignIn, (data) => {
			console.log("SignIn:", data);
			signIn(data, socket);
		});
		socket.on(MessageType.Ready, (data) => {
			console.log("Ready");
			ready(data, socket);
		});
		socket.on(MessageType.Answer, (data) => {
			console.log("Answer");
			getAnswer(data, socket);
		});

		socket.on("close", (error: boolean) => {
			console.log("Close", error);
			closeHandler(socket);
		});

		socket.on("disconnect", () => {
			closeHandler(socket);
		});
	});

	console.log("Server listening on " + HOST + ":" + PORT);
}
