
import React from 'react';
import { styled } from '@mui/material/styles';
import { graphql, Link } from 'gatsby';
import BlogPost from '../../components/BlogPost/BlogPost';
import Layout from '../../components/Layout/Layout';
import { Typography } from '@mui/material';
import SEO from '../../components/SEO/SEO';

const PREFIX = 'BlogTemplate';

const classes = {
	navBar: `${PREFIX}-navBar`,
	nextPrevBar: `${PREFIX}-nextPrevBar`,
	rightLink: `${PREFIX}-rightLink`
};

const StyledLayout = styled(Layout)(({ theme }) => ({
	[`& .${classes.navBar}`]: {
		textAlign: 'center'
	},

	[`& .${classes.nextPrevBar}`]: {
		display: 'flex',
		justifyContent: 'space-between',
		margin: theme.spacing(4, 0),
		flexWrap: 'wrap'
	},

	[`& .${classes.rightLink}`]: {
		marginLeft: 'auto'
	}
}));

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
		<StyledLayout>
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
					<div className={classes.nextPrevBar}>
						{prev ? <Link to={prev.path}>← {prev.title}</Link> : null}
						{next ? <Link to={next.path} className={classes.rightLink}>{next.title} →</Link> : null}
					</div>
					<Link to="/">Go Back Home, the Middle</Link>
				</nav>
			</article>
		</StyledLayout>
	);
}

export default BlogTemplate;
