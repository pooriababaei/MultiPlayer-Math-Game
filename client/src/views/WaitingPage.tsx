import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Loading from "../components/Loading";
import PageContainer from "../components/PageContainer";
import { Page, useAppContext, useSocketContext } from "../contexts";
import { Status, User } from "../hooks/socket";
import ListGroup from "react-bootstrap/ListGroup";
import { useCountdown } from "../hooks/countdown";

const ChangeRouteDelay = 2 as const;

const UserList = ({ users, status, username }: any) => {
	return (
		<div>
			<div className="text-center">Users</div>
			<ListGroup style={{ width: "200px" }}>
				{users.map((user: User) => (
					<ListGroup.Item key={user.username}>
						<span className="fw-bold">{user.username === username ? "You" : user.username}</span>:
						{user.ready ? " Ready" : " Not Ready"}
					</ListGroup.Item>
				))}
			</ListGroup>
		</div>
	);
};

const IsNotReady = ({ onClickReady, users, username }: any) => {
	return (
		<div>
			<Button onClick={onClickReady} variant="primary" className="mb-4 w-100">
				Ready
			</Button>
			<UserList users={users} status={Status.isNotReady} username={username} />
		</div>
	);
};

const Waiting = ({ users, username }: any) => {
	return (
		<div className="d-flex flex-column align-items-center">
			<Loading className="my-4" />
			<UserList users={users} status={Status.isReadyAndWaiting} username={username} />
		</div>
	);
};

const Starting = ({ users }: any) => {
	const { onChangePage } = useAppContext();
	const { countdown, isCounting } = useCountdown(ChangeRouteDelay);
	useEffect(() => {
		if (!isCounting) onChangePage(Page.Question);
	}, [isCounting]);
	return (
		<div>
			<p>Starting in {countdown}...</p>
			<UserList users={users} status={Status.Starting} />
		</div>
	);
};

const StatusSection = () => {
	const { onReady, status, users, username } = useSocketContext();

	if (status === Status.isNotReady) return <IsNotReady users={users} onClickReady={onReady} username={username} />;
	if (status === Status.isReadyAndWaiting) return <Waiting users={users} username={username} />;
	if (status === Status.Starting) return <Starting users={users} />;
	return null;
};

const WaitingPage = () => {
	return (
		<PageContainer>
			<StatusSection />
		</PageContainer>
	);
};

export default WaitingPage;
