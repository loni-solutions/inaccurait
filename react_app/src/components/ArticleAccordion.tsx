import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Article from './Article';

interface ArticleData {
  title: string;
  body: string;
  date: string;
}

interface ArticleAccordionProps {
  day: string;
  articles: ArticleData[];
}

const ArticleAccordion: React.FC<ArticleAccordionProps> = ({ day, articles }) => {
  return (
    <div>
      <button onClick={() => console.log(day)}>{day}</button>
      <div>
        {articles.map((article, index) => (
          <Article key={index} article={article} />
        ))}
      </div>
    </div>
  );
};


export default ArticleAccordion;
