
import React from 'react';
import { graphql } from 'gatsby';
import BlogPost from '../../components/BlogPost/BlogPost';
import Layout from '../../components/Layout/Layout';
import { Typography } from '@material-ui/core';

export const pageQuery = graphql`
	query BlogPostByPath($slug: String!) {
		markdownRemark(fields: { slug: { eq: $slug } }) {
			html
			frontmatter {
				date
				title
				subtitle
			}
			timeToRead
		}
	}
`;

interface MarkdownRemarkQueryResult {
	markdownRemark: {
		html: string;
		frontmatter: {
			date: string;
			title: string;
			subtitle: string;
		};
		timeToRead: number;
	};
}

function BlogTemplate({ data }: { data: MarkdownRemarkQueryResult }) {
	const { markdownRemark } = data;
	const { html, frontmatter, timeToRead } = markdownRemark;
	return (
		<Layout>
			<header>
				<Typography component="h1" variant="h2" gutterBottom>{frontmatter.title}</Typography>
				<Typography variant="h4" component="h2">{frontmatter.subtitle}</Typography>
				<Typography variant="body1" color="textSecondary">
					{frontmatter.date}
					{` • `}
					{timeToRead} min read
				</Typography>
			</header>
			<BlogPost html={html} />
		</Layout>
	);
}

export default BlogTemplate;
