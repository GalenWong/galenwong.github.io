import React, { ComponentProps } from 'react';
import { styled } from '@mui/material/styles';

import FixedContainer from '../FixedContainer/FixedContainer';
import NavBar from '../NavBar/NavBar';
import FloatingLightDarkFab from '../FloatingLightDarkFab/FloatingLightDarkFab';
import FooterBar from '../FooterBar/FooterBar';

const PREFIX = 'Layout';

const classes = {
	navbar: `${PREFIX}-navbar`,
	footer: `${PREFIX}-footer`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
	[`& .${classes.navbar}`]: {
		marginTop: 0,
		marginBottom: theme.spacing(8)
	},

	[`& .${classes.footer}`]: {
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
	return (
		<Root>
			<FixedContainer>
				<NavBar className={ showTopInfo ? undefined : classes.navbar} />
				{ showTopInfo ? <nav><FooterBar className={classes.navbar} /></nav> : null }
				{children}
				{ showBottomInfo ? <FooterBar className={classes.footer} /> : null }
			</FixedContainer>
			<FloatingLightDarkFab />
		</Root>
	);
}

export default Layout;
