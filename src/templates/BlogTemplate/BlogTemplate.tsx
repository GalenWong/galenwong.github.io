
import React from 'react';
import { graphql, Link } from 'gatsby';
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

interface BlogTemplateProps {
	data: MarkdownRemarkQueryResult;
	pageContext: {
		slug: string;
		prev?: { path: string; title: string };
		next?: { path: string; title: string };
	};
}

function BlogTemplate({ data, pageContext }: BlogTemplateProps) {
	const { markdownRemark } = data;
	const { html, frontmatter, timeToRead } = markdownRemark;
	const { next, prev } = pageContext;
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
			<div>
				{next ? <Link to={next.path}>{next.title} →</Link> : null}
				{prev ? <Link to={prev.path}>← {prev.title}</Link> : null}
			</div>
		</Layout>
	);
}

export default BlogTemplate;
