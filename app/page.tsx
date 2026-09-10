import Portfolio from "../portfolio";
import { ErrorBoundary } from "../components/ErrorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <Portfolio />
    </ErrorBoundary>
  );
}
