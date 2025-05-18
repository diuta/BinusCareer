import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import { AxiosResponse, Axios } from "axios";
import apiClient from "../../../config/api-client";
import { ApiService } from "../../../constants/ApiService";
import { ICarousel } from "../interface/Interface";

export default function CarouselView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [items, setItems] = useState<ICarousel[]>([]);

  useEffect(() => {
    getCarouselData();
  }, []);

  const getCarouselData = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.getCarousels}`
    );
    const filteredItems = response.data.filter((carousel: ICarousel) => getStatus(carousel) === "Published");
    setItems(filteredItems);
  };

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const getStatus = (carousel: ICarousel) => {
    const currentDate = new Date();
    const postedDate = new Date(carousel.postedDate);
    const expiredDate = new Date(carousel.expiredDate);
    if (expiredDate < currentDate) {
      return "Expired";
    }
    if (postedDate > currentDate) {
      return "Pending";
    }
    return "Published";
  };

  const slides = items.map((item) => (
    <CarouselItem
      onExiting={() => setAnimating(true)}
      onExited={() => setAnimating(false)}
      key={item.id}
    >
      <img
        src={item.image}
        alt={item.title}
        style={{ width: "100%", height: "50vh" }}
      />
      <CarouselCaption
        captionText={item.description}
        captionHeader={item.title}
      />
    </CarouselItem>
  ));

  return (
    <Carousel activeIndex={activeIndex} next={next} previous={previous} style={{ width: "100%" }}>
      <CarouselIndicators
        items={items}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      />
      {slides}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );
}
