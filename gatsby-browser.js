/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

// theme for code highlighting
require('./src/assets/prism-nord.css');
// theme for katex
require('katex/dist/katex.min.css');

import React from 'react';
import PropTypes from 'prop-types';
import ThemeTopLevelProvider from './src/components/ThemeTopLevelProvider/ThemeTopLevelProvider';

const theme = localStorage.getItem('theme');
const initTheme = theme === 'light' || theme === 'dark' ? theme : 'light';

export const wrapRootElement = ({ element }) =>
	<ThemeTopLevelProvider initTheme={initTheme}>
		{element}
	</ThemeTopLevelProvider>;

wrapRootElement.propTypes = {
	element: PropTypes.node
};
