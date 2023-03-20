import { Container, Stack } from '@mui/material';

import { Log, Toolbar } from './components';

export const HomePage = () => {

	return <Container
		maxWidth={false}
		sx={{
			display: 'flex',
			justifyContent: 'center',
			p: 8,
			alignItems: 'flex-start',
			height: '100vh',
			overflow: 'scroll'
		}}
	>
		<Stack spacing={2} sx={{ width: '100%', height: '100%' }}>
			<Toolbar />
			<Log />
		</Stack>
	</Container>
};