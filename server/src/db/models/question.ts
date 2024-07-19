export interface Question {
	number: number;
	explanation: string;
	correctAnswer: number;
	answers: string[];
	time?: number; // in seconds
}
