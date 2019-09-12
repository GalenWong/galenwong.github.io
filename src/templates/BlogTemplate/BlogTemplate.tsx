
import React from 'react';
import { graphql, Link } from 'gatsby';
import BlogPost from '../../components/BlogPost/BlogPost';
import Layout from '../../components/Layout/Layout';
import { Typography, Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import SEO from '../../components/SEO/SEO';

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

const useStyles = makeStyles((theme: Theme) => createStyles({
	navBar: {
		display: 'flex',
		justifyContent: 'space-between',
		margin: theme.spacing(4, 0),
		flexWrap: 'wrap'
	},
	rightLink: {
		marginLeft: 'auto'
	}
}));

function BlogTemplate({ data, pageContext }: BlogTemplateProps) {
	const classes = useStyles();
	const { markdownRemark } = data;
	const { html, frontmatter, timeToRead } = markdownRemark;
	const { next, prev } = pageContext;
	return (
		<Layout>
			<SEO article title={frontmatter.title} description={frontmatter.subtitle} />
			<article>
				<header>
					<Typography component="h1" variant="h2" gutterBottom>{frontmatter.title}</Typography>
					<Typography variant="h6" component="h2">{frontmatter.subtitle}</Typography>
					<Typography variant="body1" color="textSecondary">
						{frontmatter.date}
						{` • `}
						{timeToRead} min read
					</Typography>
				</header>
				<BlogPost html={html} />
				<nav className={classes.navBar}>
					{prev ? <Link to={prev.path}>← {prev.title}</Link> : null}
					{next ? <Link to={next.path} className={classes.rightLink}>{next.title} →</Link> : null}
				</nav>
			</article>
		</Layout>
	);
}

export default BlogTemplate;
