import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

import Loading from "../components/Loading";
import PageContainer from "../components/PageContainer";
import { useAppContext, Page, useSocketContext } from "../contexts";

const ResultPage = () => {
	const { onChangePage } = useAppContext();
	const { result } = useSocketContext();
	if (!result) return <Loading />;

	const sortedUsernames = Object.keys(result).sort((a, b) => result[b].score - result[a].score);
	return (
		<PageContainer>
			<div className="d-flex flex-column" style={{ minWidth: "200px" }}>
				<h4>Result</h4>
				<ListGroup numbered>
					{sortedUsernames.map((username) => (
						<ListGroup.Item key={username}>
							{username}: {result[username].score} Pts
						</ListGroup.Item>
					))}
				</ListGroup>
				<Button className="mt-4" variant="secondary" onClick={() => onChangePage(Page.Login)}>
					Play Again
				</Button>
			</div>
		</PageContainer>
	);
};

export default ResultPage;
