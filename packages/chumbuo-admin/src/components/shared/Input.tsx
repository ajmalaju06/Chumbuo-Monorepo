import React from "react";
import { Input as ChakraInput, InputProps } from "@chakra-ui/react";

interface InputProp extends InputProps {}

const Input: React.FC<InputProp> = ({ ...props }) => {
  return (
    <ChakraInput
      {...props}
      _focusVisible={{ outline: "none" }}
      fontSize={"sm"}
    />
  );
};

export default React.memo(Input);
