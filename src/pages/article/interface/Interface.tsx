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

export interface ICategory {
  id: number;
  name : string;
}
