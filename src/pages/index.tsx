import AudioCapture from "@/components/audioCapture";
import useAutosizeTextArea from "@/lib/useAutoResizeTextArea";
import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useRef, useState } from "react";

type FeedbackResponse = {
  category: string;
  included: string;
  missing: string;
  description: string;
};

export default function Home() {
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const [chatInput, setChatInput] = useState("");
  useAutosizeTextArea(chatInputRef.current, chatInput);

  const chatData = [
    {
      author: "coach",
      message: "hey dude, what does a good day look like for today?",
    },
    {
      author: "user",
      message:
        "If I can make good progress on mapping the opportunity space. And writing my summary of our stratgey.",
    },
    {
      author: "coach",
      message: "Great. Why are you working on the strategy piece?",
    },
  ];

  return (
    <>
      <Head>
        <title>Is this good product feedback?</title>
        <meta name="description" content="Is this good product feedback?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box as="main">
        <Flex h={"100vh"} w={"full"} alignItems="center" flexDir={"column"}>
          <Flex w="full" justifyContent={"center"} py={5}>
            <Heading>Rocket 🚀</Heading>
          </Flex>
          <Box flexGrow={2} w="full">
            <Container>
              <Box>
                <AudioCapture />
              </Box>
              <Box></Box>
            </Container>
          </Box>
          <Box h={12} w="full">
            <Text color="gray.400" fontSize={"sm"}></Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

{
  /* CHAT HERE */
}
{
  /* {chatData.map((cd, i) => (
                  <Flex key={`${cd.author}${i}`} px={4} py={6}>
                    <Box flexShrink={0} w={40}>
                      <Text
                        fontWeight={"bold"}
                        color="gray.300"
                        letterSpacing={"wide"}
                      >
                        {cd.author}
                      </Text>
                    </Box>
                    <Box flexGrow={1}>
                      <Text>{cd.message}</Text>
                    </Box>
                  </Flex>
                ))} */
}
{
  /* CHAT */
}
{
  /* <Stack mt={4}>
                  <Text>Reply:</Text>
                  <Textarea
                    placeholder="Your reply here"
                    resize={"none"}
                    ref={chatInputRef}
                    onChange={(x) => setChatInput(x.target.value)}
                    value={chatInput}
                  />
                  <Button>Send</Button>
                </Stack> */
}
