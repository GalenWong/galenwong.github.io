
import React, { ElementType, ComponentProps } from 'react';
import { Typography, Box } from '@material-ui/core';
import { Link } from 'gatsby';


import { BlogPost } from '../../templates/HomeTemplate/HomeTemplate';

interface BlogSummaryProps extends ComponentProps<ElementType>{
	post: BlogPost;
	component?: ElementType;
}

function BlogSummary({ post, component, ...props }: BlogSummaryProps) {
	const Component = component || 'article';
	return (
		<Component {...props}>
			<Typography variant="h4" color="primary" component="h3" gutterBottom>
				<Box lineHeight={1.3}>
					<Link to={`/blog${post.fields.slug}`}>
						{post.frontmatter.title}
					</Link>
				</Box>
			</Typography>
			<Typography variant="h5" component="h4">
				{post.frontmatter.subtitle}
			</Typography>
			<Typography variant="body1" color="textSecondary" gutterBottom>
				{`${post.frontmatter.fromNow} • ${post.timeToRead} min read`}
			</Typography>
		</Component>
	);
}

export default BlogSummary;
