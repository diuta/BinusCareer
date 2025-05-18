export interface ICarousel {
  id: number;
  title: string;
  image: string;
  description: string;
  categoryId: number;
  publishedBy: string;
  publishedAt: Date;
  updatedBy: string;
  updatedAt: Date;
  postedDate: Date;
  expiredDate: Date;
}

export interface IArticle {
  id: number;
  title: string;
  content: string;
  image: string;
  categoryId: number;
  publishedBy: string;
  publishedAt: Date;
  updatedBy: string;
  updatedAt: Date;
  postedDate: Date;
  expiredDate: Date;
}
