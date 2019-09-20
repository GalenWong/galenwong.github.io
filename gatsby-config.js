module.exports = {
	siteMetadata: {
		title: `In the Middle 站中間`,
		description: `Personal Blog by Galen Wong`,
		author: `Galen Wong`,
		url: `https://galenwong.github.io`,
		siteUrl: `https://galenwong.github.io`,
		titleTemplate: '%s | In the Middle'
	},
	plugins: [
		`gatsby-plugin-material-ui`,
		{
			resolve: `gatsby-plugin-typescript`,
			options: {
				isTSX: true,
				allExtensions: true
			}
		},
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`
			}
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/src/data/blogs`,
				name: 'blog-md-pages'
			}
		},
		{
			resolve: `gatsby-transformer-remark`,
			options: {
				plugins: [
					{
						resolve: `gatsby-remark-images`,
						options: {
							maxWidth: 640
						}
					},
					`gatsby-remark-copy-linked-files`,
					{
						resolve: `gatsby-remark-prismjs`,
						options: {
							inlineCodeMarker: '±'
						}
					},
					`gatsby-remark-smartypants`,
					{
						resolve: `gatsby-remark-external-links`,
						options: {
							target: '_blank'
						}
					},
					{
						resolve: `gatsby-remark-autolink-headers`,
						options: {
							className: 'gatsby-remark-autolink-headers-a-tags'
						}
					},
					{
						resolve: `gatsby-remark-katex`,
						options: {
							strict: 'error'
						}
					}
				]
			}
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				path: `${__dirname}/src/data/resumes`,
				name: 'resumes'
			}
		},
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `In the Middle 站中間`,
				short_name: `In the Middle`,
				start_url: `/`,
				// background_color: `#663399`,
				// theme_color: `#663399`,
				display: `minimal-ui`,
				icon: `src/images/logo.svg` // This path is relative to the root of the site.
			}
		},
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// `gatsby-plugin-offline`,
		`gatsby-plugin-sitemap`,
		{
			resolve: `gatsby-plugin-google-analytics`,
			options: {
				trackingId: 'UA-148030867-1',
				excludes: ['/google51f857e8988b6cd3.html']
			}
		}
	]
};
