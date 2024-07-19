import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { AppContextProvider, Page, useAppContext, SocketContextProvider, useSocketContext } from "./contexts";
import LoginPage from "./views/LoginPage";
import WaitingPage from "./views/WaitingPage";
import QuestionPage from "./views/QuestionPage";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import ResultPage from "./views/ResultPage";

const Views = () => {
	const { page } = useAppContext();
	switch (page) {
		case Page.Login:
			return <LoginPage />;
		case Page.Waiting:
			return <WaitingPage />;
		case Page.Question:
			return <QuestionPage />;
		case Page.Result:
			return <ResultPage />;
		default:
			return <div>Not Found</div>;
	}
};

const Main = () => {
	return (
		<main className="flex-fill d-flex align-self-center">
			<Views />
		</main>
	);
};

const Header = () => {
	const { isConnected } = useSocketContext();
	return (
		<header className="header">
			<Navbar bg="dark" variant="dark">
				<Container>
					<Navbar.Brand href="#home">Math Game</Navbar.Brand>
					<Navbar.Text>{isConnected ? "Connected!" : "Not Connected!"}</Navbar.Text>
				</Container>
			</Navbar>
		</header>
	);
	// return <header className="header">{isConnected ? "Connected!" : "Not Connected!"}</header>;
};
function App() {
	return (
		<AppContextProvider>
			<SocketContextProvider>
				<Header />
				<Main />
			</SocketContextProvider>
		</AppContextProvider>
	);
}

export default App;
