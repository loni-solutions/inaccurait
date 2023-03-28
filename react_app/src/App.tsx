import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Center,
  ChakraProvider,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Spacer,
  VStack,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { SearchIcon, HamburgerIcon } from '@chakra-ui/icons';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Article {
  date: string;
  body: string;
  title: string;
}

type DaysWithArticles = {
  [date: string]: Article[];
};

const CodeBlock: React.FC<{ className?: string; children: React.ReactNode; inline?: boolean }> = ({
  className,
  children,
  inline,
}) => {
  const language = className ? className.replace(/language-/, '') : '';

  if (inline) {
    return (
      <code className={`language-${language}`}>
        {children}
      </code>
    );
  }

  return (
    <SyntaxHighlighter language={language || 'text'} style={atomDark}>
      {String(children).trim()}
    </SyntaxHighlighter>
  );
};


const components = {
  code: CodeBlock,
};

const App: React.FC = () => {
  const [daysWithArticles, setDaysWithArticles] = useState<DaysWithArticles>({});
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();


  const fetchArticles = async (page: number) => {
    const response = await axios.get<DaysWithArticles>(
      `${process.env.REACT_APP_API_URL}/articles?page=${page}`
    );
    if (Object.keys(response.data).length === 0) {
      setHasMore(false);
    } else {
      setHasMore(true);
      setDaysWithArticles((prevState) => ({
        ...prevState,
        ...response.data,
      }));
    }
  };

  const loadMoreArticles = () => {
    setPage((prevPage) => prevPage + 1);
    fetchArticles(page);
  };

  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  return (
    <ChakraProvider>
      <Flex direction="column" minH="100vh">
        <Flex as="header" bg="black" color="white" p={4} direction={{ base: "column", md: "row" }}>
          <Heading as="h1" size="md" mr={4}>
            inaccurr AI t.
          </Heading>
          <Spacer />
          <Flex direction={{ base: "column", md: "row" }} alignItems="center">
          <Center>
          <Link href="/about" mr={4}>
            About
          </Link>
          </Center>
          <InputGroup width={{ base: "200px", md: "400px" }} mr={4}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input type="search" placeholder="Ask me anything" />
          </InputGroup>
          </Flex>
          <IconButton
            aria-label="Menu"
            icon={<HamburgerIcon color={'black'}/>}
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            ml="auto"
          />
        </Flex>
        <Flex as="main" flexGrow={1} p={4}>
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">Navigation</DrawerHeader>
              <DrawerCloseButton />
              <DrawerBody>
                <VStack
                  as="nav"
                  spacing={4}
                  width={{ base: "100%", md: "150px" }}
                  alignItems="start"
                  display={{ base: "none", md: "flex" }}
                >
                  <Link href="/">Home</Link>
                  <Link href="/tags">Tags</Link>
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          <Container maxW={{ base: "100%", md: "container.lg" }}>
            <InfiniteScroll
              dataLength={Object.keys(daysWithArticles).length}
              next={loadMoreArticles}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={<p>End of articles</p>}
            >
            {Object.entries(daysWithArticles).map(([date, articles]) =>
                articles.map((article, index) => (
                  <Box
                    key={`${date}-${index}`}
                    bg="green.50"
                    p={4}
                    borderRadius="md"
                    boxShadow="md"
                    mb={4}
                  >
                    <Link href={`#${encodeURIComponent(article.title)}`}>
                      <Heading as="h1" size="lg" mb={2} id={encodeURIComponent(article.title)}>
                        {article.title}
                      </Heading>
                    </Link>
                    <p>{date}</p>
                    <Box className="article-body">
                      <ReactMarkdown
                        components={components as any}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {article.body}
                      </ReactMarkdown>
                    </Box>
                  </Box>
                ))
              )}
            </InfiniteScroll>
          </Container>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default App;
