import Spinner from "react-bootstrap/Spinner";

function Loading(props: any) {
	return (
		<Spinner animation="border" role="status" {...props}>
			<span className="visually-hidden">Loading...</span>
		</Spinner>
	);
}

export default Loading;
