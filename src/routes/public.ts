// import CandyBox from 'pages/candy-box';
import { Login } from "../pages/login";
import { Register } from "../pages/register";
// import { Logout } from 'pages/logout';
// import { Register } from 'pages/register';
import { Route } from "../types/route";
import { Logout } from "../pages/logout";
import LandingPage from "../pages/landing-page/LandingPagePublic";
import Article from "../pages/article/Article";
import ArticleDetail from "../pages/article/ArticleDetail";


export const publicRoutes: Route[] = [
  {
    key: "router-login",
    title: "Login",
    description: "Login",
    component: Login,
    path: "/login",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "router-logout",
    title: "Logout",
    description: "Logout",
    component: Logout,
    path: "/logout",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "router-register",
    title: "Register",
    description: "Register",
    component: Register,
    path: "/register",
    isEnabled: true,
    appendDivider: true,
  },
  //   {
  //     key: 'router-register',
  //     title: 'Register',
  //     description: 'Register',
  //     component: Register,
  //     path: '/Register',
  //     isEnabled: true,
  //     appendDivider: true,
  //   },
  //   {
  //     key: 'router-logout',
  //     title: 'Logout',
  //     description: 'Logout',
  //     component: Logout,
  //     path: '/logout',
  //     isEnabled: true,
  //     appendDivider: true,
  //   },
  //   {
  //     key: 'router-candy-box',
  //     title: 'Candy Box',
  //     description: 'Candy Box',
  //     component: CandyBox,
  //     path: '/candy-box',
  //     isEnabled: true,
  //     noLayout: true,
  //   },
  {
    key: "view-landing-page",
    title: "LandingPage",
    description: "LandingPage",
    component: LandingPage,
    path: "/",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "article-view",
    title: "Alumni Data",
    description: "Filter Alumni Data",
    component: Article,
    path: "/article",
    isEnabled: true,
    appendDivider: true,
  },
  {
    key: "article-detail",
    title: "Article Detail",
    description: "Article Detail",
    component: ArticleDetail,
    path: "/article/:id",
    isEnabled: true,
    appendDivider: true,
  },
];
