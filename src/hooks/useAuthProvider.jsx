import { useContext } from "react";

import { AuthProviderContext } from "../providers/AuthProvider";

export const useAuthProvider = () => {
	const context = useContext(AuthProviderContext);

		if (!context) {
			throw new Error('useAuthProvider must be used within  AuthProvider.');
		}

	return context;
}