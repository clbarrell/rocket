import AudioCapture from "@/components/audioCapture";
import { Messages } from "@/components/messages";
import useAutosizeTextArea from "@/lib/useAutoResizeTextArea";
import { Box, Container, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/appContext";

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
  const { state } = useAppContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages.length]);

  return (
    <>
      <Head>
        <title>Rocket the robot</title>
        <meta name="description" content="Rocket robot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box as="main">
        <Flex h={"100vh"} w={"full"} alignItems="center" flexDir={"column"}>
          <Flex w="full" justifyContent={"center"} py={5}>
            <Heading>Rocket 🚀</Heading>
          </Flex>
          <Flex justifyContent={"center"} mb={2}>
            <Image src="/robot2.png" alt="robot" width="150" height="150" />
          </Flex>
          <Box
            flexGrow={2}
            flexShrink={1}
            w="full"
            overflowY={"scroll"}
            ref={scrollRef}
          >
            <Container>
              <Box my={6}>
                <Messages />
              </Box>
            </Container>
          </Box>
          <Box pb={2}>
            <AudioCapture />
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
