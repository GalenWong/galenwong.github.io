
import React, { ComponentProps } from 'react';
import Helmet from 'react-helmet';
import { createMuiTheme, responsiveFontSizes, Theme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, createStyles, withStyles } from '@material-ui/core';

const Head = () =>
	<Helmet>
		<link href="https://fonts.googleapis.com/css?family=Noto+Serif+SC:300,400|Noto+Serif+TC:300,400|Noto+Serif|Source+Sans+Pro:400,400i,700,700i|Merriweather&display=swap" rel="stylesheet" />
	</Helmet>;

const mySerif = `"Noto Serif TC", "Noto Serif SC", "Noto Serif", serif`;

const mySans = `"Merriweather", "Source Sans Pro", sans-serif`;

const myTheme = (isDark: boolean) => responsiveFontSizes(createMuiTheme({
	palette: {
		type: isDark ? 'dark' : 'light',
		primary: {
			main: '#389abb'
		}
	},
	typography: {
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

const GlobalStyles = withStyles((theme: Theme) => {
	const mainColor = theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.light;
	return createStyles({
		'@global': {
			body: {
				transition: theme.transitions.create('background')
			},
			h1: {
				...theme.typography.h2,
				margin: theme.spacing(3, 0)
			},
			h2: {
				...theme.typography.h3,
				margin: theme.spacing(3, 0)
			},
			h3: {
				...theme.typography.h4,
				margin: theme.spacing(3, 0)
			},
			h4: {
				...theme.typography.h5,
				margin: theme.spacing(3, 0)
			},
			h5: {
				...theme.typography.h6,
				margin: theme.spacing(3, 0)
			},
			// don't use h6
			p: {
				...theme.typography.body1,
				margin: theme.spacing(3, 0),
				lineHeight: 1.75
			},
			li: {
				...theme.typography.body1
			},
			// prism js inline code
			':not(pre) > code[class*="language-"]': {
				fontSize: 'inherit'
			},
			a: {
				color: mainColor,
				textDecoration: 'none',
				boxShadow: `inset 0px -1px 0px 0px ${mainColor}`,
				transition: theme.transitions.create('box-shadow'),
				'&:hover': {
					boxShadow: `inset 0px 0px 0px 0px ${mainColor}`
				}
			},
			// code highlight block
			'.gatsby-highlight': {
				marginLeft: '-1em',
				marginRight: '-1em',
				overflow: 'auto',
				borderRadius: theme.shape.borderRadius,
				'& > pre': {
					minWidth: '100%',
					margin: 0,
					width: 'max-content'
				}
			},
			'.gatsby-highlight-code-line': {
				backgroundColor: '#3b4251',
				display: 'block',
				marginRight: '-1em',
				marginLeft: '-1em',
				paddingLeft: '0.75em',
				borderLeft: '0.25em solid #d8dee9',
				minWidth: 'fit-content'
			},
			'.katex-display': {
				// enable scroll
				overflow: 'auto'
			},
			'.gatsby-remark-autolink-headers-a-tags': {
				// remove box shadow on auto linked headers
				boxShadow: 'none',
				'&> svg': {
					fill: theme.palette.primary.main
				}
			}
		}
	});
})(() => null);

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
