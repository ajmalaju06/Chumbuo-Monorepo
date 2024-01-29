import { Box, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import Slider from "react-slick";
import { mainBannerList } from "../../data/Datas";
import SlideArrows from "../shared/SlideArrows";

const MainBanner = () => {
  const [sliderIndex, setSliderIndex] = useState<number>(0);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: (
      <SlideArrows
        position="right"
        slideIndex={sliderIndex}
        totalItems={mainBannerList.length}
        sliderType="infinity"
      />
    ),
    prevArrow: (
      <SlideArrows
        position="left"
        slideIndex={sliderIndex}
        totalItems={mainBannerList.length}
        sliderType="infinity"
      />
    ),
    afterChange: (index: number) => setSliderIndex(index),
  };

  return (
    <Box
      w={"full"}
      display={"flex"}
      flexDirection={"column"}
      pt={"12.4rem"}
      position={"relative"}
    >
      <Slider {...settings}>
        {mainBannerList.map((item) => {
          return (
            <Box
              key={item.id}
              _focusVisible={{ outline: "none" }}
              overflow={"hidden"}
              display={"flex"}
              position={"relative"}
            >
              <Image
                src={item.image}
                alt="bannerImage"
                w={"full"}
                objectFit={"cover"}
                height={"30rem"}
              />
              <Box
                height={"20rem"}
                w={"full"}
                position={"absolute"}
                bottom={0}
                zIndex={1}
                bgGradient="linear(to-t,#0000004D 40%, transparent 50%)"
              />
              <Box
                position={"absolute"}
                bottom={10}
                zIndex={1}
                w={"100%"}
                color={"white"}
                display={"flex"}
                flexDirection={"column"}
              >
                <Text
                  textAlign={"center"}
                  fontSize={"sm"}
                  fontStyle={"italic"}
                  fontFamily={"Lustria !important"}
                >
                  {item.date}
                </Text>
                <Text
                  textAlign={"center"}
                  fontSize={"2xl"}
                  fontWeight={"500"}
                  fontFamily={"Lustria !important"}
                  letterSpacing={"1px"}
                >
                  {item.name}
                </Text>
              </Box>
            </Box>
          );
        })}
      </Slider>
    </Box>
  );
};

export default React.memo(MainBanner);
