
import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../../components/Layout/Layout';
import BlogSummary from '../../components/BlogSummary/BlogSummary';
import { Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import SEO from '../../components/SEO/SEO';

export const pageQuery = graphql`
{
  allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
    nodes {
      frontmatter {
        date
        subtitle
        title
			}
			id
			timeToRead
			fields {
        slug
      }
    }
  }
}
`;

export interface BlogPost {
	frontmatter: {
		date: string;
		subtitle: string;
		title: string;
	};
	id: string;
	timeToRead: number;
	fields: {
		slug: string;
	};
}

export interface HomePageTemplateProps {
	data: { allMarkdownRemark: { nodes: BlogPost[] }};
}

const useStyles = makeStyles((theme: Theme) => createStyles({
	blogItem: {
		marginBottom: theme.spacing(8)
	}
}));


function HomePageTemplate({ data }: HomePageTemplateProps) {
	const classes = useStyles();
	const listOfBlogs = data.allMarkdownRemark.nodes.map(post =>
		<BlogSummary className={classes.blogItem} post={post} key={post.id} />);

	return (
		<Layout showTopInfo>
			<SEO />
			{listOfBlogs}
		</Layout>
	);
}

export default HomePageTemplate;
