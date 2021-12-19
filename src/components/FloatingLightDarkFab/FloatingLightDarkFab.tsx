
import React from 'react';
import { Container, Theme, Box } from '@mui/material';
import LightDarkFab from '../LightDarkFab/LightDarkFab';
import { makeStyles, createStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
	fixedPosition: {
		position: 'fixed',
		minWidth: '100%',
		textAlign: 'right',
		bottom: 0,
		marginBottom: theme.spacing(4),
		// don't capture click on div
		pointerEvents: 'none'
	},
	fab: {
		// only capture click on button
		pointerEvents: 'all'
	}
}));

function FloatingLightDarkFab() {
	const classes = useStyles();
	return (
		<Box className={classes.fixedPosition}>
			<Container maxWidth="md">
				<LightDarkFab className={classes.fab} />
			</Container>
		</Box>
	);
}

export default FloatingLightDarkFab;
