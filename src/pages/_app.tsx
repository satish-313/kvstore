import "../styles/globals.css";
import type { AppProps } from "next/app";
import { trpc } from "../utils/trpc";
import { Layout } from "../components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

export default trpc.withTRPC(MyApp);
