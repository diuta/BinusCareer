export interface ICarousel {
  id: number;
  image: string;
  title: string;
  description: string;
}

export interface IWeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export interface IArticle {
  id: number;
  title: string;
  content: string;
  image: string;
}
