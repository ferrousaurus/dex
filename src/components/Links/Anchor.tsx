import * as React from "react";
import { createLink, LinkComponent } from "@tanstack/react-router";
import {
  Anchor as MantineAnchor,
  AnchorProps as MantineAnchorProps,
} from "@mantine/core";

export type AnchorProps = Omit<MantineAnchorProps, "href">;

const MantineLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  AnchorProps
>((props, ref) => <MantineAnchor ref={ref} {...props} />);

const CreatedLinkComponent = createLink(MantineLinkComponent);

const Link: LinkComponent<typeof MantineLinkComponent> = (
  props,
) => <CreatedLinkComponent preload="intent" {...props} />;

export default Link;
