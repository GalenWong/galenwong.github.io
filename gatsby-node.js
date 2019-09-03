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
					frontmatter {
						title
					}
				}
			}
		}
	`);

	const createBlogPage = (curr, prev, next) => {
		createPage({
			path: `/blog${curr.fields.slug}`,
			component: postTemplate,
			context: {
				slug: curr.fields.slug,
				prev: prev ? { title: prev.frontmatter.title, path: `/blog${prev.fields.slug}`} : undefined,
				next: next ? { title: next.frontmatter.title, path: `/blog${next.fields.slug}`} : undefined,
			}
		});
	};

	const posts = result.data.allMarkdownRemark.nodes;
	for (let i = 0; i < posts.length; i++) {
		createBlogPage(posts[i], posts[i-1], posts[i+1]);
	}
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
