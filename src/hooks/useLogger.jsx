import { useContext } from 'react';

import { LogProviderContext } from '../providers';

export const useLogger = () => {
	const context = useContext(LogProviderContext);

	if (!context) {
		throw new Error('useLogger must be used within a LogProvider.');
	}

	return context;
};