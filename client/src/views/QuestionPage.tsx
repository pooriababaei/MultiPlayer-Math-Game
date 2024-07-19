import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import PageContainer from "../components/PageContainer";
import { useSocketContext, SocketContextType, useAppContext, Page } from "../contexts";
import { useCountdown } from "../hooks/countdown";
import { useEffect } from "react";
import { Question, Status } from "../hooks/socket";
import Loading from "../components/Loading";

type OptionsProps = {
	question: SocketContextType["questions"][number];
	onAnswer: SocketContextType["onAnswer"];
	disabled: boolean;
};

type OptionProps = OptionsProps & {
	answer: string;
	index: number;
};

type ExplanationProps = {
	question: SocketContextType["questions"][number];
};

const useOption = ({ question, index, disabled, onAnswer }: OptionProps) => {
	const isSelected = (index: number) => question.selectedAnswer === index + 1;
	const isCorrect = (index: number) => question.correctAnswer === index + 1;
	const isNotCorrectSelected = (index: number) => question.correctAnswer && !isCorrect(index) && isSelected(index);

	const onClickOption = () => {
		if (disabled) return;
		if (!question.correctAnswer) onAnswer({ questionNumber: question.number, answer: index + 1 });
	};

	let variant: "success" | "danger" | "dark" | undefined;
	if (isCorrect(index)) variant = "success";
	else if (isNotCorrectSelected(index)) variant = "danger";
	else if (isSelected(index)) variant = "dark";

	return { onClickOption, variant };
};

const useTimer = (question: Question) => {
	const { countdown, isCounting, setIsCounting, resetCountdown } = useCountdown(question?.time);
	useEffect(() => {
		if (!isCounting) {
			resetCountdown();
			setIsCounting(true);
		}
	}, [question?.number]);

	return { countdown, isCounting };
};

const Timer = ({ countdown, isCounting }: any) => {
	if (!isCounting) return <div>Your time is up!</div>;

	return <div>{countdown} seconds left</div>;
};

const Explanation = ({ question }: ExplanationProps) => {
	return (
		<Card style={{ minWidth: "300px" }}>
			<Card.Header className="border-0">
				Question {question.number} <small>/ 5</small>
			</Card.Header>
			<Card.Body>{question.explanation}</Card.Body>
		</Card>
	);
};

const Choice = ({ question, answer, disabled, ...rest }: OptionProps) => {
	const { onClickOption, variant } = useOption({ question, answer, disabled, ...rest });
	return (
		<ListGroup.Item action={!question.correctAnswer} variant={variant} onClick={onClickOption} key={answer}>
			{answer}
		</ListGroup.Item>
	);
};

const Choices = ({ question, onAnswer, disabled }: OptionsProps) => {
	return (
		<ListGroup numbered>
			{question.answers.map((answer, index) => (
				<Choice
					key={answer}
					disabled={disabled}
					question={question}
					answer={answer}
					index={index}
					onAnswer={onAnswer}
				/>
			))}
		</ListGroup>
	);
};

const QuestionPage = () => {
	const { questions, onAnswer, status } = useSocketContext();
	const { onChangePage } = useAppContext();
	useEffect(() => {
		if (status === Status.isNotReady) onChangePage(Page.Result);
	}, [status]);

	const question = questions[questions.length - 1];
	const { countdown, isCounting } = useTimer(question);
	if (!questions.length) return <Loading />;

	return (
		<PageContainer>
			<div className="d-flex flex-column">
				<div className="text-center mb-4">
					<Timer countdown={countdown} isCounting={isCounting} />
				</div>
				<Explanation question={question} />
				<div className="mt-4">
					<Choices question={question} onAnswer={onAnswer} disabled={!isCounting} />
				</div>
			</div>
		</PageContainer>
	);
};

export default QuestionPage;
