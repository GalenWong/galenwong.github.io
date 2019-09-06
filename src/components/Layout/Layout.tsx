import React, { ComponentProps, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

import MuiCustomTheme from '../MuiCustomTheme/MuiCustomTheme';
import FixedContainer from '../FixedContainer/FixedContainer';
import NavBar from '../NavBar/NavBar';
import LightDarkContext, { palleteOptions } from '../LightDarkContext/LightDarkContext';
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
	const [mode, setMode] = useState('light' as palleteOptions);
	const setTheme = (isDark: boolean) => setMode(isDark ? 'dark' : 'light');

	return (
		<MuiCustomTheme darkMode={mode === 'dark'}>
			<LightDarkContext.Provider value={{
				theme: mode,
				changeTheme: setTheme
			}}>
				<FixedContainer>
					<PaddedNavBar />
					{children}
				</FixedContainer>
				<FloatingLightDarkFab />
			</LightDarkContext.Provider>
		</MuiCustomTheme>
	);
}

export default Layout;
