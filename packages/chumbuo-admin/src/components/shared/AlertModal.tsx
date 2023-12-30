import React from "react";
import Modal from "./Modal";
import { Box, Icon, Text } from "@chakra-ui/react";
import Button from "./Button";
import { BTN_VARIANT } from "../../model/button.enum";
import { IoWarningOutline } from "react-icons/io5";

interface AlertProps {
  isAlertOpen: boolean;
  handleCloseAlert: () => void;
  heading?: string;
  subHeading?: string;
  handlePrimaryBtnClick?: () => void;
  primaryButtonText?: string;
  secondaryBtnText?: string;
  isLoading?: boolean;
}

const AlertModal: React.FC<AlertProps> = ({
  isAlertOpen,
  handleCloseAlert,
  handlePrimaryBtnClick,
  primaryButtonText = "Yes",
  secondaryBtnText = "No",
  heading,
  subHeading,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isAlertOpen}
      onClose={handleCloseAlert}
      heading="Alert"
      headingIcon={<Icon as={IoWarningOutline} />}
    >
      <Box pb={3}>
        <Box pb={8}>
          <Text fontSize={"md"} fontWeight={"semibold"}>
            {heading}
          </Text>
          <Text fontSize={"sm"} mt={2} color={"gray.700"}>
            {subHeading}
          </Text>
        </Box>

        <Box display={"flex"} justifyContent={"flex-end"} gap={4}>
          <Button
            btnVariant={BTN_VARIANT.ERROR}
            onClick={() => {
              handleCloseAlert();
            }}
          >
            {secondaryBtnText}
          </Button>
          <Button
            isLoading={isLoading}
            btnVariant={BTN_VARIANT.SUCCESS}
            onClick={() => {
              if (handlePrimaryBtnClick) handlePrimaryBtnClick();
            }}
          >
            {primaryButtonText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default React.memo(AlertModal);
