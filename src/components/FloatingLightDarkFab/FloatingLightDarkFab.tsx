
import React from 'react';
import { Container, Theme, Box } from '@material-ui/core';
import LightDarkFab from '../LightDarkFab/LightDarkFab';
import { makeStyles, createStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
	fixedPosition: {
		position: 'fixed',
		minWidth: '100%',
		textAlign: 'right',
		bottom: 0,
		marginBottom: theme.spacing(4)
	}
}));

function FloatingLightDarkFab() {
	const classes = useStyles();
	return (
		<Box className={classes.fixedPosition}>
			<Container maxWidth="md">
				<LightDarkFab />
			</Container>
		</Box>
	);
}

export default FloatingLightDarkFab;
