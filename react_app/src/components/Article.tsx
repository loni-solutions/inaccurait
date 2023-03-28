import React from 'react';
import { Box } from '@mui/material';
import CodeBlock from './CodeBlock';


interface ArticleProps {
  article: {
    title: string;
    body: string;
  };
}

const Article: React.FC<ArticleProps> = ({ article }) => {
  return (
    <Box mb={4}>
      <h2>{article.title}</h2>
      <p>{article.body}</p>
    </Box>
  );
};

export default Article;
