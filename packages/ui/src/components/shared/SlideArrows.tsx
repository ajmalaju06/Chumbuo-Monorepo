import { Box, Icon } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import "../../css/slideArrows.css";

interface SlideNextArrowsProps {
  position: "left" | "right";
  slideIndex?: number;
  totalItems: number;
  sliderType?: "infinity" | "normal";
}

const SlideArrows: React.FC<SlideNextArrowsProps> = ({
  position,
  slideIndex = 0,
  totalItems,
  sliderType = "normal",
  ...props
}) => {
  const { onClick }: any = props;

  const hidePrevArrow = slideIndex === 0;
  const hideNextArrow = slideIndex >= totalItems - 4;

  const arrowDisplay = useMemo(() => {
    if (position === "left") {
      if (hidePrevArrow) {
        return "scale(0)";
      } else {
        return "scale(1)";
      }
    }
    if (position === "right") {
      if (hideNextArrow) {
        return "scale(0)";
      } else {
        return "scale(1)";
      }
    }
  }, [slideIndex]);

  const rightPosition = useMemo(() => {
    if (position === "left") {
      return "unset";
    } else {
      return sliderType === "infinity" ? "10" : "10%";
    }
  }, []);

  const leftPosition = useMemo(() => {
    if (position === "left") {
      return sliderType === "infinity" ? "10" : "-20px";
    } else {
      return "unset";
    }
  }, []);

  return (
    <Box
      onClick={onClick}
      position={"absolute"}
      top={"45%"}
      right={rightPosition}
      left={leftPosition}
      w={"60px"}
      h={"60px"}
      background={"#0000004D"}
      boxShadow={"0px 5px 10px rgba(0,0,0,0.16)"}
      justifyContent={"center"}
      alignItems={"center"}
      borderRadius={"full"}
      cursor={"pointer"}
      color={"white"}
      zIndex={1}
      _hover={{ boxShadow: "0px 15px 30px rgba(0,0,0,0.16)" }}
      transition={"0.3s ease-in-out"}
      className="parentContainer"
      display={"flex"}
      transform={sliderType === "infinity" ? "scale(1)" : arrowDisplay}
    >
      {position === "left" ? (
        <Icon
          as={GoArrowLeft}
          fontSize={"20px"}
          transition={"0.4s ease-in-out"}
          className="arrows"
        />
      ) : (
        <Icon
          as={GoArrowRight}
          fontSize={"20px"}
          transition={"0.4s ease-in-out"}
          className="arrows"
        />
      )}
    </Box>
  );
};

export default React.memo(SlideArrows);
