import React, { useEffect, useState } from "react";

import { Typography, Tooltip, Stack } from "@mui/material";

export default function Typo({ capitalize = false, bold, italic, ...props }) {
  return (
    <Typography
      className="font-link"
      {...props}
      fontStyle={italic ? "italic" : ""}
      fontWeight={bold ? 600 : ""}
      textTransform={capitalize && "capitalize"}
      sx={{
        ...props?.sx,
        color: props.children == "unknown" ? "error.main" : props?.color,
      }}
    >
      {props.children}
    </Typography>
  );
}

export function Title(props) {
  return (
    <Typo {...props} variant="h6">
      {props.children}
    </Typo>
  );
}
export function Subtitle(props) {
  return (
    <Typo {...props} variant="subtitle1">
      {props.children}
    </Typo>
  );
}

export function Caption(props) {
  return (
    <Typo {...props} variant="caption">
      {props.children}
    </Typo>
  );
}

const MyComponent = React.forwardRef(function MyComponent(props, ref) {
  //  Spread the props to the underlying DOM element.
  return (
    <div {...props} ref={ref}>
      {props.children}
    </div>
  );
});

export function TextOverflow({ children, tip }) {
  return (
    <Tooltip title={tip}>
      <MyComponent>{children}</MyComponent>
    </Tooltip>
  );
}

export function Elipsis({ children, sx, ...props }) {
  return (
    <TextOverflow tip={children}>
      <Typography
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "1",
          WebkitBoxOrient: "vertical",
          ...sx,
        }}
        {...props}
      >
        {children}
      </Typography>
    </TextOverflow>
  );
}

export function Span({ children, ...props }) {
  return (
    <span
      style={{
        fontWeight: props.bold && "bold",
        margin: "0 4px",
      }}
    >
      {children}
    </span>
  );
}
