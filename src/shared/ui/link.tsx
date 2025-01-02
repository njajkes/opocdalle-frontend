import { Link as RRDLink, LinkProps as RRDLinkProps } from "react-router-dom";
import { useInternalRouter } from "../lib";

interface LinkProps extends Omit<RRDLinkProps, "to"> {
  to: (linkMaker: ReturnType<typeof useInternalRouter>) => string;
}

export const Link = ({ to, ...props }: LinkProps) => {
  const linkMaker = useInternalRouter();

  return <RRDLink to={to(linkMaker)} {...props} />;
};
