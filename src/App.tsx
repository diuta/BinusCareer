/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable import/no-extraneous-dependencies */
import { MsalProvider } from "@azure/msal-react";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { unstable_ClassNameGenerator } from "@mui/material/className";
import { QueryClientProvider } from "@tanstack/react-query";
// import { LayoutAdminRoute } from 'components/layout/admin-routes';
import { AuthProvider } from "./components/layout/auth-provider";
import { LayoutPrivateRoute } from "./components/layout/private-routes";
import { LayoutPublicRoute } from "./components/layout/public-routes";
import getQueryClient from "./config/react-query";
import { UseModalProvider } from "./hooks/use-modal/provider";
import {
  SnackbarOrigin,
  SnackbarProvider,
  SnackbarProviderProps,
} from "notistack";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { protectedRoutes } from "./routes/protected";
import { publicRoutes } from "./routes/public";
import { persistor, store } from "./store";
import { themes } from "./styles/mui/theme";
import { authConfig } from "./utils/azure-ad";
import createEmotionCache from "./utils/emotion-cache";
import "bootstrap/dist/css/bootstrap.min.css";

interface CustomAppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();
const queryClient = getQueryClient();
unstable_ClassNameGenerator.configure((componentName) =>
  componentName.replace("Mui", "binus-")
);
const snackbarConfig: SnackbarProviderProps = {
  anchorOrigin: {
    vertical: "top",
    horizontal: "right",
  },
  autoHideDuration: 5000,
  style: {
    maxWidth: 300,
  },
};

function App({ emotionCache = clientSideEmotionCache }: CustomAppProps) {
  return (
    <AllProvider emotionCache={emotionCache}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route>
            {publicRoutes.map((route) => (
              <Route
                path={route.path}
                element={
                  route.noLayout ? (
                    <route.component />
                  ) : (
                    <LayoutPublicRoute>
                      <route.component />
                    </LayoutPublicRoute>
                  )
                }
                key={route.key}
              />
            ))}
            {protectedRoutes.map((route) => (
              <Route
                path={route.path}
                element={
                  <AuthProvider>
                    <LayoutPrivateRoute
                      title={route.title}
                      requiredPermission={route.key}
                    >
                      <route.component />
                    </LayoutPrivateRoute>
                  </AuthProvider>
                }
                key={route.key}
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </AllProvider>
  );
}

export function AllProvider({
  children,
  emotionCache,
}: {
  children: JSX.Element[];
  emotionCache: EmotionCache;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <MsalProvider instance={authConfig}>
        <CacheProvider value={emotionCache}>
          <HelmetProvider>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <SnackbarProvider
                  anchorOrigin={snackbarConfig.anchorOrigin}
                  autoHideDuration={snackbarConfig.autoHideDuration}
                  style={snackbarConfig.style}
                >
                  <ThemeProvider theme={themes}>
                    <UseModalProvider>{children}</UseModalProvider>
                  </ThemeProvider>
                </SnackbarProvider>
              </PersistGate>
            </Provider>
          </HelmetProvider>
        </CacheProvider>
      </MsalProvider>
    </QueryClientProvider>
  );
}

export default App;
