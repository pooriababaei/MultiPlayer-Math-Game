import { createContext, useContext } from "react";
import { useSocket } from "../hooks/socket";

export type SocketContextType = ReturnType<typeof useSocket>;

const SocketContext = createContext<SocketContextType>({} as SocketContextType);

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = (props: any) => {
	const socketProps = useSocket();
	return <SocketContext.Provider value={socketProps}>{props.children}</SocketContext.Provider>;
};
