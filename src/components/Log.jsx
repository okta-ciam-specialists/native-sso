import { Card, CardContent, Container, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { useLogger } from '../hooks';

export const Log = () => {
	const { log: rows = [] } = useLogger();

	const columns = [
		{ field: 'timestamp', cellClassName: 'log-col-1' },
		{
			field: 'text', cellClassName: 'log-col-2', renderCell: (params) => (
				<pre>
					<code>
						{params.value}
					</code>
				</pre>
			)
		}
	];

	return (
		<Container maxWidth={false} sx={{ height: '100%' }}>
			<Card sx={{ backgroundColor: '#272822', my: 3, p: 2, height: '100%', width: '100%'}}>
				<Typography variant="h6" sx={{ color: 'white' }}>
					Event Log
				</Typography>
				<CardContent sx={{ height: '100%' }}>
					{rows.length > 0 && <DataGrid disableRowSelectionOnClick disableColumnSelector disableColumnFilter disableVirtualization hideFooter {...{
						columnHeaderHeight: 0,
						columns,
						rows,
						rowSelection: false,
						sx: {
							border: 'none',
							height: '100%',
							backgroundColor: '#272822',
							color: '#FD9720',
							fontFamily: 'monospace',
							'& .MuiDataGrid-virtualScrollerRenderZone': {
								width: '100% !important'
							},
							'& .MuiDataGrid-root': {
								'& .MuiDataGrid-row': {
									width: '100%'
								}
							},
							'& .MuiDataGrid-cell': {
								borderBottom: 'none',
								minHeight: '100% !important',
								maxHeight: '100% !important'
							},
							'& .MuiDataGrid-columnHeaders': {
								border: 'none'
							}
						},
						getRowClassName: () => 'log-row'
					}} />}
				</CardContent>
			</Card>
		</Container>
	);
};
