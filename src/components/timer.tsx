import { Box, Icon, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { BsStopwatch } from "react-icons/bs";

const Timer = ({
  counting,
  stopTimer,
}: {
  counting: boolean;
  stopTimer: () => void;
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Function to handle the interval
    if (counting) {
      const interval = setInterval(() => {
        // Update the seconds state
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);

      // Cleanup function to clear the interval
      return () => {
        clearInterval(interval);
      };
    } else {
      setSeconds(0);
    }
  }, [counting]);

  useEffect(() => {
    if (seconds >= 30) {
      stopTimer();
      setSeconds(0);
    }
  }, [seconds, stopTimer]);

  return (
    <Box>
      <Text
        fontSize={"2xl"}
        color={seconds > 25 ? "red.500" : seconds > 0 ? "white" : "gray.500"}
        transition="all 300ms"
      >
        <Icon as={BsStopwatch} fontSize="lg" mr={2} />
        {seconds}s
      </Text>
    </Box>
  );
};

export default Timer;
