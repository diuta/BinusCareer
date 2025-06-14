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
  const [carousels, setCarousels] = useState<ICarousel[]>([]);

  useEffect(() => {
    getCarouselData();
  }, []);

  const getCarouselData = async () => {
    const response: AxiosResponse = await apiClient.get(
      `${ApiService.carousels}`
    );
    const filteredItems = response.data.filter((carousel: ICarousel) => getStatus(carousel) === "Published");
    setCarousels(filteredItems);
    
    const defaultItem = {
      id: 1,
      title: "",
      image: "/images/c.jpg",
      description: "",
      categoryId: 1,
      createdBy: "system",
      createdDate: new Date(),
      updatedBy: "system",
      updatedAt: new Date(),
      postedDate: new Date(),
      expiredDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    }

    if (filteredItems.length === 0) {
      setCarousels([defaultItem])
    }
  };

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === carousels.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? carousels.length - 1 : activeIndex - 1;
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

  const slides = carousels.map((item) => (
    <CarouselItem
      onExiting={() => setAnimating(true)}
      onExited={() => setAnimating(false)}
      key={item.id}
    >
      <img
        src={`${ApiService.URL}${item.image}`}
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
        items={carousels}
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
