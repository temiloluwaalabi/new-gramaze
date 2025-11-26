"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // handle the error by logging it so it's not unused
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <p>{error?.message ?? "Unknown error"}</p>
        {error?.digest && <p>Error code: {error.digest}</p>}
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
