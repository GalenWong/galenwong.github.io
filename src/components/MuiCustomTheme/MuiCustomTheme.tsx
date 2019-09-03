
import React from 'react';
import Helmet from 'react-helmet';
import { createMuiTheme, responsiveFontSizes, Theme } from '@material-ui/core/styles';
import { ThemeProviderProps } from '@material-ui/styles/ThemeProvider';
import { ThemeProvider, makeStyles } from '@material-ui/styles';
import { CssBaseline, createStyles, withStyles } from '@material-ui/core';
import { ComponentProps } from 'react';

const Head = () => (
    <Helmet>
        {}
        <link href="https://fonts.googleapis.com/css?family=Noto+Serif+SC|Noto+Serif+TC&display=swap" rel="stylesheet" />
    </Helmet>
);

const myTheme = responsiveFontSizes(createMuiTheme({
    typography: {
        h1: {
            fontFamily: `"Noto Serif TC", "Noto Serif SC", serif`
        },
        h2: {
            fontFamily: `"Noto Serif TC", "Noto Serif SC", serif`
        }
    }
}));

const GlobalStyles = withStyles((theme: Theme) => createStyles({
    '@global': {
        'h1': {
            ...theme.typography.h1
        },
        'h2': {
            ...theme.typography.h2
        },
        'h3': {
            ...theme.typography.h3
        },
        'h4': {
            ...theme.typography.h4
        },
        'h5': {
            ...theme.typography.h5
        },
        'h6': {
            ...theme.typography.h6
        },
        'p': {
            ...theme.typography.body1
        }
    }
}
))(() => null);

interface MuiCustomThemeProps extends ComponentProps<any> {
    darkMode: boolean
};

const ChildrenWithGlobalStyle = ({ children }: ComponentProps<any>) => {
    return ( <> <GlobalStyles /> {children} </>);
};

function MuiCustomTheme ({ children, darkMode, ...props }: MuiCustomThemeProps) {
    return (
        <ThemeProvider theme={myTheme} {...props}>
            <Head />
            <CssBaseline />
            <ChildrenWithGlobalStyle>
                {children}
            </ChildrenWithGlobalStyle>
        </ThemeProvider>
    );
}

export default MuiCustomTheme;
