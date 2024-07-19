import { Question } from "./question";
import { User } from "./user";
export interface Message {
	type: MessageType;
	username?: string;
	answer?: number;
	question?: Question;
	questionNumber?: number;
	ready?: boolean;
	users?: User[];
	time?: number; // seconds
	message?: any;
}
export enum MessageType {
	SignIn = "SignIn", // client
	Answer = "Answer", // client
	Ready = "Ready", // client

	Question = "Question", // server
	CorrectAnswer = "CorrectAnswer", // server
	Users = "Users", // server
	Results = "Results", // server
	StartMatch = "StartMatch", // server
	Error = "Error" // server
}
