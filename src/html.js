
import React from 'react';
import PropTypes from 'prop-types';

function HTML({
	htmlAttributes,
	headComponents,
	bodyAttributes,
	preBodyComponents,
	postBodyComponents,
	body
}) {
	return (
		<html {...htmlAttributes}>
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="x-ua-compatible" content="ie=edge" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>
				{headComponents}
			</head>
			<body {...bodyAttributes} className="light">
				<script
					dangerouslySetInnerHTML={{
						__html: `
						(function() {
							try {
								const theme = localStorage.getItem('theme');
								if (theme === 'dark') {
									document.body.className = 'ssr-dark';
								}
								else {
									document.body.className = 'ssr-light';
								}
							} catch (err) {}
						})()
					`
					}}
				/>
				{preBodyComponents}
				<div
					key={`body`}
					id="___gatsby"
					dangerouslySetInnerHTML={{ __html: body }}
				/>
				{postBodyComponents}
			</body>
		</html>
	);
}

HTML.propTypes = {
	htmlAttributes: PropTypes.object,
	headComponents: PropTypes.array,
	bodyAttributes: PropTypes.object,
	preBodyComponents: PropTypes.array,
	body: PropTypes.string,
	postBodyComponents: PropTypes.array
};

export default HTML;
