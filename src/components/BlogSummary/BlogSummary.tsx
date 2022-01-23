import React, { ElementType, ComponentProps } from 'react';
import { Typography, Box } from '@mui/material';
import { Link } from 'gatsby';


import { BlogPost } from '../../templates/HomeTemplate/HomeTemplate';

interface BlogSummaryProps extends ComponentProps<ElementType>{
	post: BlogPost;
}

function BlogSummary({ post, ...props }: BlogSummaryProps) {
	return (
		<article {...props}>
			<Typography variant="h4" color="primary" component="h3" gutterBottom>
				<Box lineHeight={1.3}>
					<Link to={`/blog${post.fields.slug}`}>
						{post.frontmatter.title}
					</Link>
				</Box>
			</Typography>
			<Typography variant="h6" component="h4">
				{post.frontmatter.subtitle}
			</Typography>
			<Typography variant="body1" color="textSecondary" gutterBottom>
				{`${post.frontmatter.date} • ${post.timeToRead} min read`}
			</Typography>
		</article>
	);
}

export default BlogSummary;
