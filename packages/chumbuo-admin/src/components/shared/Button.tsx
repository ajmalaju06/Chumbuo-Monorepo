import React, { useMemo } from "react";
import { ButtonProps, Button as ChakraButton } from "@chakra-ui/react";
import { colors, shadows } from "../../theme/colors";
import { BTN_VARIANT } from "../../model/button.enum";

interface ButtonProp extends ButtonProps {
  btnVariant?: BTN_VARIANT;
}

const Button: React.FC<ButtonProp> = ({
  btnVariant = BTN_VARIANT.PRIMARY,
  ...props
}) => {
  const bgColor = useMemo(() => {
    switch (btnVariant) {
      case BTN_VARIANT.PRIMARY:
        return colors.secondaryColor;
        break;
      case BTN_VARIANT.SUCCESS:
        return colors.green;
        break;
      case BTN_VARIANT.ERROR:
        return colors.red;
        break;

      default:
        return colors.secondaryColor;
        break;
    }
  }, [btnVariant]);

  const shadowColor = useMemo(() => {
    switch (btnVariant) {
      case BTN_VARIANT.PRIMARY:
        return shadows.buttonShadow;
        break;
      case BTN_VARIANT.SUCCESS:
        return shadows.buttonSuccessShadow;
        break;
      case BTN_VARIANT.ERROR:
        return shadows.buttonErrorShadow;
        break;

      default:
        return shadows.buttonShadow;
        break;
    }
  }, [btnVariant]);

  return (
    <ChakraButton
      {...props}
      _focusVisible={{ outline: "none" }}
      _hover={{
        bg: bgColor,
        transform: "scale(1.05)",
        boxShadow: shadowColor,
      }}
      bg={bgColor}
      color={"white"}
    />
  );
};

export default React.memo(Button);
