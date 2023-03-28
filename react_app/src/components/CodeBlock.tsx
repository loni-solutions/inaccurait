import React from 'react';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-python';


interface CodeBlockProps {
  language: string;
  code: string;
}

Prism.languages['text only'] = {
  'text': {
    pattern: /[\s\S]+/,
    inside: {}
  }
};

const CodeContainer = styled(Box)`
  position: relative;
  border: 1px solid #dfe2e5;
  border-radius: 4px;
  margin: 1rem 0;
`;

const LanguageTag = styled('div')`
  position: absolute;
  top: -12px;
  left: 10px;
  padding: 2px 5px;
  background-color: #f3f3f3;
  font-size: 0.8rem;
  color: #555;
  border: 1px solid #dfe2e5;
  border-radius: 4px;
`;

const Pre = styled('pre')`
  margin: 0;
  padding: 1rem;
`;

const CopyCodeButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const copyCodeToClipboard = () => {
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  const formattedCode = Prism.highlight(code, Prism.languages[language], language);

  return (
    <CodeContainer>
      <LanguageTag>{language}</LanguageTag>
      <Pre>
        <code
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: formattedCode }}
        />
      </Pre>
      <CopyCodeButton variant="outlined" size="small" onClick={copyCodeToClipboard}>
        Copy Code
      </CopyCodeButton>
    </CodeContainer>
  );
};

export default CodeBlock;
