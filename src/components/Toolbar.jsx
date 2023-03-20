import {
	AppBar,
	Button,
	CircularProgress,
	Link,
	Stack,
	Toolbar as MuiToolbar,
	Typography,
	useTheme
} from '@mui/material';

import { useAuthProvider, useLogout } from '../hooks';

const { VITE_APP_URL: APP_URL } = import.meta.env;

export const Toolbar = () => {
	const { isAuthenticated, loading, oktaAuth } = useAuthProvider()
	const theme = useTheme();

	const { logout } = useLogout();

	return <AppBar>
		<MuiToolbar>
			<Typography variant='h5' sx={{ flexGrow: 1 }}>Incoming SSO App</Typography>
			{loading && <CircularProgress sx={{ color: 'white' }} />}
			{!loading && <>
				{isAuthenticated && (<Stack direction='row' spacing={2}>
					<Button color='inherit' variant='contained' onClick={() => logout()} sx={{
						backgroundColor: theme.palette.secondary.light,
						':hover': {
							backgroundColor: theme.palette.secondary.dark
						}
					}}>
						Logout (local)
					</Button>
					<Button variant="outlined" color='inherit' onClick={() => oktaAuth.signOut()} sx={{
						':hover': {
							backgroundColor: 'white',
							color: theme.palette.primary.main
						}
					}}>
						Logout (global)
					</Button>
				</Stack>)}

				{!isAuthenticated && <Typography variant='subtitle1'>
					Please visit the <Link href={APP_URL} sx={{ color: 'white', fontWeight: 900, textDecoration: 'underline' }}>primary app</Link> to sign in.
				</Typography>}
			</>
			}
		</MuiToolbar>
	</AppBar>
};