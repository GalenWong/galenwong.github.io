/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it

import React from 'react';
import PropTypes from 'prop-types';
import ThemeTopLevelProvider from './src/components/ThemeTopLevelProvider/ThemeTopLevelProvider';

export const wrapRootElement = ({ element }) =>
	<ThemeTopLevelProvider initTheme='light'>
		{element}
	</ThemeTopLevelProvider>;

wrapRootElement.propTypes = {
	element: PropTypes.node
};
