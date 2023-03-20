import { createContext, useState } from 'react';
import { ulid } from 'ulid';

export const LogProviderContext = createContext(null)

export const LogProvider = ({ children }) => {
	const [log, setLog] = useState([]);

	const logger = (data) => {

		console.log(data)

		if (!data) {
			return
		}

		if (typeof data === 'string') {
			setLog(l => {

				return [...l, ...[{ id: ulid(), timestamp: getTime(), text: getText(data) }]];
			});
		} else {
			if (!Array.isArray && typeof data === 'object') {
				data = [ { id: ulid(), ...data} ]
			}

			if (Array.isArray(data) && data.length > 0) {

				for (let i = 0; i < data.length; i++) {
					const { id = ulid(), timestamp, text } = data[i] || {};

					setLog(l => {
						return [...l, ...[{ id, timestamp: getTime(timestamp), text: getText(text) }]];
					})
				}

			}
		}
	};

	const clearLogs = () => {
		setLog([]);
	};

	return <LogProviderContext.Provider value={{ clearLogs, log, logger }}>
		{children}
	</LogProviderContext.Provider>
};

function getText(text) {

	if (text instanceof Error) {
		return text.toString();
	}

	if (typeof text === 'object') {
		return JSON.stringify(text, null, 2)
	}

	return text
}

function getTime(timestamp) {
	if (timestamp === null) {
		return ''
	}

	if (timestamp === undefined) {
		return new Date().toLocaleTimeString();
	}

	return timestamp;
}