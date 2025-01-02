import { PropsWithChildren, useEffect } from "react";

interface PageProps {
  title?: string;
}

export const Page = ({ children, title }: PropsWithChildren<PageProps>) => {
  useEffect(() => {
    if (!title) {
      document.title = "opoCdall-e";
      return;
    }

    if (typeof title === "string") {
      document.title = `${title} | opoCdall-e`;
      return;
    }
  }, [title]);

  return <>{children}</>;
};
