
import React from 'react';
import { styled } from '@mui/material/styles';
import { graphql } from 'gatsby';
import Layout from '../../components/Layout/Layout';
import BlogSummary from '../../components/BlogSummary/BlogSummary';
import SEO from '../../components/SEO/SEO';

const PREFIX = 'HomePageTemplate';

const classes = {
	blogItem: `${PREFIX}-blogItem`
};

const StyledLayout = styled(Layout)(({ theme }) => ({
	[`& .${classes.blogItem}`]: {
		marginBottom: theme.spacing(8)
	}
}));

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


function HomePageTemplate({ data }: HomePageTemplateProps) {
	const listOfBlogs = data.allMarkdownRemark.nodes.map(post =>
		<BlogSummary className={classes.blogItem} post={post} key={post.id} />);

	return (
		<StyledLayout showTopInfo>
			<SEO />
			{listOfBlogs}
		</StyledLayout>
	);
}

export default HomePageTemplate;
