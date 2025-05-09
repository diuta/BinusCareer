import { Error404 } from "../pages/Error/Error404";
import { Route } from "../types/route";
import Article from "../pages/article/Article";
import ArticleDetail from "../pages/article/ArticleDetail";
import AddCarousel from "../pages/manage-components/AddCarousel";
import AddArticle from "../pages/article/AddArticle";
import HomePage from "../pages/home/HomePage";
import LandingPage2 from "../pages/landing-page/LandingPagePrivate";

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
    key: "add-carousel",
    title: "Add Carousel",
    description: "Add Carousel",
    component: AddCarousel,
    path: "/addCarousel",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "add-article",
    title: "Add Article",
    description: "Add Article",
    component: AddArticle,
    path: "/addArticle",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "home",
    title: "Home",
    description: "Home",
    component: LandingPage2,
    path: "/home",
    isEnabled: true,
    appendDivider: true,
  },
];
