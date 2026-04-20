import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./css/view-transitions.css";
import "./i18n/i18n";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { AppWrapper } from "./components/Common/PageMeta";
import { ThemeProvider } from "./context/ThemeContext";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/reactQuery";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { SocketProvider } from "./socket_io/socketProvider";
import SocketTest from "./socketTest";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <SocketTest />
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <AppWrapper>
              {/* <BrowserRouter> */}
              <App />
              {/* </BrowserRouter> */}
            </AppWrapper>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SocketProvider>
    </Provider>
  </StrictMode>,
);
