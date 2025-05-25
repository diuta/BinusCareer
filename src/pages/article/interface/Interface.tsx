export interface IArticle {
  id: number;
  title: string;
  content: string;
  image: string;
  categoryId: number;
  createdBy: string;
  createdDate: Date;
  updatedBy: string;
  updatedAt: Date;
  postedDate: Date;
  expiredDate: Date;
  totalViews: number;
}

export interface ICategory {
  id: number;
  name : string;
}
