import { Page, useAppContext, useSocketContext } from "../contexts";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PageContainer from "../components/PageContainer";

const LoginPage = () => {
	const { onChangePage } = useAppContext();
	const { onSignIn } = useSocketContext();

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const username = e.currentTarget.username.value;
		onSignIn(username);
		onChangePage(Page.Waiting);
	};
	return (
		<PageContainer>
			<Form onSubmit={onSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Username</Form.Label>
					<Form.Control name="username" type="text" placeholder="Username" required />
				</Form.Group>
				<Button variant="primary" type="submit">
					Sign In
				</Button>
			</Form>
		</PageContainer>
	);
};

export default LoginPage;
