/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = async ({ actions: { createPage }, graphql }) => {
	const postTemplate = path.resolve('src/templates/BlogTemplate/BlogTemplate.tsx');
	const result = await graphql(`
		{
			allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
				nodes {
					fields {
						slug
					}
				}
			}
		}
	`);

	result.data.allMarkdownRemark.nodes.forEach(o => {
		const { slug } = o.fields;
		createPage({
			path: `/blog${slug}`,
			component: postTemplate,
			context: {
				slug
			}
		})
	});
};

exports.onCreateNode = ({ node, actions, getNode }) => {
	const { createNodeField } = actions;
	if (node.internal.type === 'MarkdownRemark') {
		const value = createFilePath({ node, getNode });
		createNodeField({
			name: `slug`,
			node,
			value
		});
	}
}
