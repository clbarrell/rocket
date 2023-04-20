import { useAppContext } from "@/context/appContext";
import {
  Box,
  Circle,
  Flex,
  SlideFade,
  Stack,
  Text,
  useTimeout,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const MessageRow = ({
  message,
  who,
}: {
  message: string;
  who: "ai" | "user";
}) => {
  const rocket = "🚀";
  const user = "🧑";

  const width = 16;
  const [changeBGColour, setChangeBGColour] = useState(
    who === "ai" ? true : false
  );

  const [showAIResponse, setShowAIResponse] = useState(false);

  useTimeout(() => {
    setShowAIResponse(true);
  }, 700);

  useTimeout(() => {
    setChangeBGColour(false);
  }, 3000);

  const UserIcon = ({ children }: { children: React.ReactNode }) => {
    return (
      <Flex
        w={width}
        flexShrink={0}
        justifyContent="center"
        alignContent={"baseline"}
      >
        <Box hidden={!children}>
          <Circle bg="whiteAlpha.300" p={3}>
            {children}
          </Circle>
        </Box>
      </Flex>
    );
  };

  return (
    <SlideFade in={who === "ai" ? showAIResponse : true} offsetY="20px">
      <Flex>
        <UserIcon>{who === "ai" && rocket}</UserIcon>
        <Flex flexGrow={1} justifyContent={who === "ai" ? "left" : "right"}>
          <Box
            px={4}
            py={3}
            background={changeBGColour ? "green.300" : "whiteAlpha.300"}
            borderBottomRadius={"xl"}
            borderTopRightRadius={who === "user" ? "none" : "xl"}
            borderTopLeftRadius={who === "ai" ? "none" : "xl"}
            fontSize="lg"
            textAlign={who === "ai" ? "left" : "right"}
          >
            {message}
          </Box>
        </Flex>
        <UserIcon>{who === "user" && user}</UserIcon>
      </Flex>
    </SlideFade>
  );
};

export const Messages = () => {
  const { state } = useAppContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages.length]);

  return (
    <Box>
      <Stack spacing={4}>
        {state.messages.map((m) => (
          <Stack key={m.ts} spacing={3}>
            <MessageRow message={m.user} who="user" />
            <MessageRow message={m.ai} who="ai" />
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};
