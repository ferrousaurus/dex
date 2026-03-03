import * as React from "react";
import { createLink, LinkComponent } from "@tanstack/react-router";
import {
  NavLink as MantineNavLink,
  NavLinkProps as MantineNavLinkProps,
} from "@mantine/core";

export type NavLinkProps = Omit<MantineNavLinkProps, "href">;

const MantineLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  NavLinkProps
>((props, ref) => <MantineNavLink ref={ref} {...props} />);

const CreatedLinkComponent = createLink(MantineLinkComponent);

const Link: LinkComponent<typeof MantineLinkComponent> = (
  props,
) => <CreatedLinkComponent preload="intent" {...props} />;

export default Link;
