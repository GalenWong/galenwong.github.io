
import React from 'react';
import { styled } from '@mui/material/styles';
import { Container, Box } from '@mui/material';
import LightDarkFab from '../LightDarkFab/LightDarkFab';
const PREFIX = 'FloatingLightDarkFab';

const classes = {
	fixedPosition: `${PREFIX}-fixedPosition`,
	fab: `${PREFIX}-fab`
};

const StyledBox = styled(Box)(({ theme }) => ({
	[`&.${classes.fixedPosition}`]: {
		position: 'fixed',
		minWidth: '100%',
		textAlign: 'right',
		bottom: 0,
		marginBottom: theme.spacing(4),
		// don't capture click on div
		pointerEvents: 'none'
	},

	[`& .${classes.fab}`]: {
		// only capture click on button
		pointerEvents: 'all'
	}
}));

function FloatingLightDarkFab() {
	return (
		<StyledBox className={classes.fixedPosition}>
			<Container maxWidth="md">
				<LightDarkFab className={classes.fab} />
			</Container>
		</StyledBox>
	);
}

export default FloatingLightDarkFab;
