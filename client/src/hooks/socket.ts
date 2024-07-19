import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:6969");

export type Question = {
	number: number;
	explanation: string;
	correctAnswer: number;
	answers: string[];
	selectedAnswer?: number;
	time: number;
};

export type User = {
	username: string;
	ready: boolean;
};

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

export type OnAnswerProps = { answer: number; questionNumber: number };
export enum Status {
	isNotReady = "isNotReady",
	isReadyAndWaiting = "isReadyAndWaiting",
	Starting = "Starting"
}

export type Result = Record<string, { score: number }> | null;
export const useSocket = () => {
	const [isConnected, setIsConnected] = useState(socket.connected);

	const [username, setUsername] = useState<string>();

	const [error, setError] = useState<string>("");

	const [users, setUsers] = useState<User[]>([]);

	const [status, setStatus] = useState(Status.isNotReady);

	const [questions, setQuestions] = useState<Question[]>([]);

	const [result, setResult] = useState<Result>(null);

	const onSignIn = (username: string) => {
		socket.emit(MessageType.SignIn, { username });
		setQuestions([]);
		setUsername(username);
	};

	const onAnswer = (props: OnAnswerProps) => {
		const question = questions.find((q) => q.number === props.questionNumber);
		if (!question || question.correctAnswer) return;

		setQuestions((questions) =>
			questions.map((q) => (q.number === question.number ? { ...q, selectedAnswer: props.answer } : q))
		);
		socket.emit(MessageType.Answer, { username, ...props });
	};

	const onReady = () => {
		setStatus(Status.isReadyAndWaiting);
		socket.emit(MessageType.Ready, { username });
	};

	const handleResults = (result: Result) => {
		setStatus(Status.isNotReady);
		setResult(result);
	};
	useEffect(() => {
		socket.on("connect", () => {
			setIsConnected(true);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
		});

		socket.on("message", (rawData: string) => {
			const { type, message, question, questionNumber, answer }: Message = JSON.parse(rawData);

			if (type !== MessageType.Error && error) setError("");
			console.log(type, { message, question, questionNumber, answer });
			switch (type) {
				case MessageType.Error:
					return setError(message);
				case MessageType.Users:
					return setUsers(message);
				case MessageType.StartMatch:
					return setStatus(Status.Starting);
				case MessageType.Results:
					return handleResults(message);
				case MessageType.Question:
					return setQuestions([...questions, question!]);
				case MessageType.CorrectAnswer:
					return setQuestions((questions) =>
						questions!.map((q) => (q.number === questionNumber ? { ...q, correctAnswer: answer! } : q))
					);
				default:
					console.log("Unknown message type", type);
			}
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("message");
		};
	}, []);

	return { isConnected, username, users, status, questions, result, onAnswer, onSignIn, onReady };
};
