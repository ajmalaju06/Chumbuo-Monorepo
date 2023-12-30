import React from "react";

import {
  FormControl as ChakraFormControl,
  FormControlProps,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";

interface FormPropsInterface extends FormControlProps {
  label?: string;
  children?: JSX.Element;
  isInvalid?: boolean;
  errorMsg?: string;
  isDisabled?: boolean;
}
const FormControl: React.FC<FormPropsInterface> = ({
  label,
  children,
  isInvalid,
  errorMsg,
  isDisabled = false,
}) => {
  return (
    <ChakraFormControl isInvalid={isInvalid} isDisabled={isDisabled}>
      {label && (
        <FormLabel fontSize={14} m={1} fontWeight="normal" color="dimGray">
          {label}
        </FormLabel>
      )}

      {children}
      {errorMsg && (
        <FormErrorMessage fontSize="xs" mt={1}>
          {errorMsg}
        </FormErrorMessage>
      )}
    </ChakraFormControl>
  );
};
export default React.memo(FormControl);
