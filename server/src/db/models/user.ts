import { Socket } from "socket.io";
export interface User {
	username: string;
	score: number;
	socket: Socket;
	ready: boolean;
}
