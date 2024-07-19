import { createContext, useContext, useState } from "react";

export enum Page {
	Login = "Login",
	Waiting = "Waiting",
	Question = "Question",
	Result = "Result"
}

export type AppContextType = {
	page: Page;
	onChangePage: (page: Page) => void;
};

const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = (props: any) => {
	const [page, setPage] = useState<Page>(Page.Login);
	const onChangePage = (page: Page) => setPage(page);

	return <AppContext.Provider value={{ page, onChangePage }}>{props.children}</AppContext.Provider>;
};
