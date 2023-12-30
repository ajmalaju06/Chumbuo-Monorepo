import {
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface ModalProp extends ModalProps {
  heading: string;
  headingIcon?: ReactNode;
}

const Modal: React.FC<ModalProp> = ({
  children,
  heading,
  headingIcon,
  ...props
}) => {
  return (
    <ChakraModal {...props} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display={"flex"} alignItems={"center"} gap={2}>
          {headingIcon && headingIcon}
          {heading}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

export default React.memo(Modal);
