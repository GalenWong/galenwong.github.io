import React, { ComponentProps } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

import FixedContainer from '../FixedContainer/FixedContainer';
import NavBar from '../NavBar/NavBar';
import FloatingLightDarkFab from '../FloatingLightDarkFab/FloatingLightDarkFab';
import FooterBar from '../FooterBar/FooterBar';

const useStyles = makeStyles((theme: Theme) => createStyles({
	navbar: {
		marginBottom: theme.spacing(8)
	},
	footer: {
		marginTop: theme.spacing(8)
	}
}));

function Layout({ children }: ComponentProps<'div'>) {
	const classes = useStyles();
	return (
		<>
		<FixedContainer>
			<NavBar className={classes.navbar} />
			{children}
			<FooterBar className={classes.footer} />
		</FixedContainer>
		<FloatingLightDarkFab />
		</>
	);
}

export default Layout;
