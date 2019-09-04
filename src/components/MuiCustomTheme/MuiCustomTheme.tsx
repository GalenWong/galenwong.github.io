
import React, { ComponentProps } from 'react';
import Helmet from 'react-helmet';
import { createMuiTheme, responsiveFontSizes, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, createStyles, withStyles } from '@material-ui/core';

const Head = () =>
	<Helmet>
		<link href="https://fonts.googleapis.com/css?family=Noto+Serif+SC:300,400|Noto+Serif+TC:300,400|Noto+Serif|Source+Sans+Pro:400,400i,700,700i&display=swap" rel="stylesheet" />
	</Helmet>;

const mySerif = `"Noto Serif TC", "Noto Serif SC", "Noto Serif", serif`;

const mySans = `"Source Sans Pro", sans-serif`;

const myTheme = (isDark: boolean) => responsiveFontSizes(createMuiTheme({
	palette: {
		type: isDark ? 'dark' : 'light'
	},
	typography: {
		fontSize: 16,
		fontFamily: mySans,
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
		},
		body1: {
			fontFamily: mySans
		}
	}
}));

const GlobalStyles = withStyles((theme: Theme) => createStyles({
	'@global': {
		h1: {
			...theme.typography.h2,
			margin: theme.spacing(2, 0)
		},
		h2: {
			...theme.typography.h3,
			margin: theme.spacing(2, 0)
		},
		h3: {
			...theme.typography.h4,
			margin: theme.spacing(2, 0)
		},
		h4: {
			...theme.typography.h5,
			margin: theme.spacing(2, 0)
		},
		h5: {
			...theme.typography.h6,
			margin: theme.spacing(2, 0)
		},
		// don't use h6
		p: {
			...theme.typography.body1,
			margin: theme.spacing(2, 0)
		},
		// prism js inline code
		':not(pre) > code[class*="language-"]': {
			fontSize: theme.typography.body1.fontSize
		},
		a: {
			color: theme.palette.primary.main,
			textDecoration: 'none',
			boxShadow: `inset 0px -1px 0px 0px ${theme.palette.primary.main}`,
			// transition: theme.transitions.create('box-shadow'),
			'&:hover': {
				boxShadow: 'none'
			}
		},
		// code highlight block
		'.gatsby-highlight': {
			margin: theme.spacing(1, -2),
			'& > pre': {
				borderRadius: theme.shape.borderRadius
			}
		},
		'.gatsby-highlight-code-line': {
			backgroundColor: '#feb',
			display: 'block',
			marginLeft: theme.spacing(-2),
			marginRight: theme.spacing(-2),
			paddingRight: theme.spacing(2),
			paddingLeft: theme.spacing(1.5),
			borderLeft: '0.25em solid #f99'
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
