import { useEffect, useState } from "react";

export const useCountdown = (time = 0, isCountingDefault = true) => {
	const [countdown, setCountdown] = useState(time);
	const [isCounting, setIsCounting] = useState(isCountingDefault);

	useEffect(() => {
		if (isCounting && countdown > 0) {
			const interval = setInterval(() => {
				setCountdown((prevCountdown) => prevCountdown - 1);
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [isCounting]);

	useEffect(() => {
		if (countdown === 0) setIsCounting(false);
	}, [countdown]);

	const resetCountdown = () => setCountdown(time);

	return { countdown, isCounting, setIsCounting, resetCountdown };
};
