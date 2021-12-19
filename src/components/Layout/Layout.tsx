import React, { ComponentProps } from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from '@mui/material';

import FixedContainer from '../FixedContainer/FixedContainer';
import NavBar from '../NavBar/NavBar';
import FloatingLightDarkFab from '../FloatingLightDarkFab/FloatingLightDarkFab';
import FooterBar from '../FooterBar/FooterBar';

const useStyles = makeStyles((theme: Theme) => createStyles({
	navbar: {
		marginTop: 0,
		marginBottom: theme.spacing(8)
	},
	footer: {
		marginTop: theme.spacing(8)
	}
}));

interface LayoutProps extends ComponentProps<'div'>{
	showTopInfo?: boolean;
	showBottomInfo?: boolean;
}

function Layout({
	children,
	showTopInfo = false,
	showBottomInfo = true
}: LayoutProps) {
	const classes = useStyles();
	return (
		<>
		<FixedContainer>
			<NavBar className={ showTopInfo ? undefined : classes.navbar} />
			{ showTopInfo ? <nav><FooterBar className={classes.navbar} /></nav> : null }
			{children}
			{ showBottomInfo ? <FooterBar className={classes.footer} /> : null }
		</FixedContainer>
		<FloatingLightDarkFab />
		</>
	);
}

export default Layout;
