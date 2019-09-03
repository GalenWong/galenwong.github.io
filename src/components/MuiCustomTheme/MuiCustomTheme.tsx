
import React, { ComponentProps } from 'react';
import Helmet from 'react-helmet';
import { createMuiTheme, responsiveFontSizes, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, createStyles, withStyles } from '@material-ui/core';

const Head = () =>
	<Helmet>
		<link href="https://fonts.googleapis.com/css?family=Noto+Serif+SC:300,400|Noto+Serif+TC:300,400|Noto+Serif&display=swap" rel="stylesheet" />
	</Helmet>;

const mySerif = `"Noto Serif TC", "Noto Serif SC", "Noto Serif", serif`;

const myTheme = (isDark: boolean) => responsiveFontSizes(createMuiTheme({
	palette: {
		type: isDark ? 'dark' : 'light'
	},
	typography: {
		h1: {
			fontFamily: mySerif
		},
		h2: {
			fontFamily: mySerif
		},
		h3: {
			fontFamily: mySerif
		},
		h4: {
			fontFamily: mySerif
		}
	}
}));

const GlobalStyles = withStyles((theme: Theme) => createStyles({
	'@global': {
		h1: {
			...theme.typography.h1
		},
		h2: {
			...theme.typography.h2
		},
		h3: {
			...theme.typography.h3
		},
		h4: {
			...theme.typography.h4
		},
		h5: {
			...theme.typography.h5
		},
		h6: {
			...theme.typography.h6
		},
		p: {
			...theme.typography.body1
		}
	}
}))(() => null);

interface MuiCustomThemeProps extends ComponentProps<'div'> {
	darkMode: boolean;
}

const ChildrenWithGlobalStyle = ({ children }: ComponentProps<'div'>) => {
	return <> <GlobalStyles /> {children} </>;
};

function MuiCustomTheme({ children, darkMode, ...props }: MuiCustomThemeProps) {
	return (
		<ThemeProvider theme={myTheme(darkMode)} {...props}>
			<Head />
			<CssBaseline />
			<ChildrenWithGlobalStyle>
				{children}
			</ChildrenWithGlobalStyle>
		</ThemeProvider>
	);
}

export default MuiCustomTheme;
