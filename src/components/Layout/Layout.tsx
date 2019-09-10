import React, { ComponentProps } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

import FixedContainer from '../FixedContainer/FixedContainer';
import NavBar from '../NavBar/NavBar';
import FloatingLightDarkFab from '../FloatingLightDarkFab/FloatingLightDarkFab';

const useStyles = makeStyles((theme: Theme) => createStyles({
	navbar: {
		marginBottom: theme.spacing(8)
	}
}));

const PaddedNavBar = () => {
	const classes = useStyles();
	return <NavBar className={classes.navbar} />;
};

function Layout({ children }: ComponentProps<'div'>) {
	return (
		<>
		<FixedContainer>
			<PaddedNavBar />
			{children}
		</FixedContainer>
		<FloatingLightDarkFab />
		</>
	);
}

export default Layout;
