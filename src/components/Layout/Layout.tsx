import React, { ComponentProps } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

import MuiCustomTheme from '../MuiCustomTheme/MuiCustomTheme';
import FixedContainer from '../FixedContainer/FixedContainer';
import NavBar from '../NavBar/NavBar';

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
		<MuiCustomTheme darkMode={false}>
			<FixedContainer>
				<PaddedNavBar />
				{children}
			</FixedContainer>
		</MuiCustomTheme>
	);
}

export default Layout;
