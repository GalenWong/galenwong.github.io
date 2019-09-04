
import React from 'react';

interface BlogPostProps {
	html: string;
}

function BlogPost({ html }: BlogPostProps) {
	return (
		<div dangerouslySetInnerHTML={{ __html: html }}/>
	);
}

export default BlogPost;
