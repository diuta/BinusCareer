import { Error404 } from "../pages/Error/Error404";
import { Route } from "../types/route";
import Article from "../pages/article/Article";
import ArticleDetail from "../pages/article/ArticleDetail";
import AddCarousel from "../pages/carousel/AddCarousel";
import AddArticle from "../pages/article/AddArticle";
import HomePage from "../pages/home/HomePage";
import LandingPagePrivate from "../pages/landing-page/LandingPagePrivate";
import ArticleManager from "../pages/article/ArticleManager";
import EditArticle from "../pages/article/EditArticle";
import CarouselManager from "../pages/carousel/CarouselManager";
import EditCarousel from "../pages/carousel/EditCarousel";
import AddCategory from "../pages/category/AddCategory";
import CategoryManager from "../pages/category/CategoryManager";
import EditCategory from "../pages/category/EditCategory";

export const protectedRoutes: Route[] = [
  // {
  //   key: 'router-dashboard',
  //   title: 'Component',
  //   description: 'Component',
  //   component: ComponentPage,
  //   path: '/Component',
  //   isEnabled: true,
  //   appendDivider: true,
  // },
  // {
  //   key: 'view-dashboard',
  //   title: 'Dashboard',
  //   description: 'Dashboard',
  //   component: HomePage,
  //   path: '/',
  //   isEnabled: true,
  //   appendDivider: true,
  // },
  {
    key: "home",
    title: "Home",
    description: "Home",
    component: LandingPagePrivate,
    path: "/home",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "carousel-manager",
    title: "Carousel Manager",
    description: "Carousel Manager",
    component: CarouselManager,
    path: "/carousel-manager",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "add-carousel",
    title: "Add Carousel",
    description: "Add Carousel",
    component: AddCarousel,
    path: "/add-carousel",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "edit-carousel",
    title: "Edit Carousel",
    description: "Edit Carousel",
    component: EditCarousel,
    path: "/edit-carousel/:id",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "category-manager",
    title: "Category Manager",
    description: "Category Manager",
    component: CategoryManager,
    path: "/category-manager",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "add-category",
    title: "Add Category",
    description: "Add Category",
    component: AddCategory,
    path: "/add-category",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "edit-category",
    title: "Edit Category",
    description: "Edit Category",
    component: EditCategory,
    path: "/edit-category/:id",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "add-article",
    title: "Add Article",
    description: "Add Article",
    component: AddArticle,
    path: "/add-article",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "article-manager",
    title: "Article Manager",
    description: "Article Manager",
    component: ArticleManager,
    path: "/article-manager",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "edit-article",
    title: "Edit Article",
    description: "Edit Article",
    component: EditArticle,
    path: "/edit-article/:id",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "article-view",
    title: "Alumni Data",
    description: "Filter Alumni Data",
    component: Article,
    path: "/protected/article",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "article-detail",
    title: "Article Detail",
    description: "Article Detail",
    component: ArticleDetail,
    path: "/protected/article/:id",
    isEnabled: true,
    appendDivider: true,
  },
];
