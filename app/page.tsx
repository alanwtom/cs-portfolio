import Portfolio from "../portfolio";
import { ThemeProvider } from "../components/theme-provider";
import { ErrorBoundary } from "../components/ErrorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Portfolio />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
