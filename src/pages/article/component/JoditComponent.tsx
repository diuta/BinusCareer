import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

interface JoditProps {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  height?: number | string;
  readonly?: boolean;
}

function JoditComponent({
  name,
  placeholder,
  value,
  onChange,
  height = 400,
  readonly = false,
}: JoditProps): JSX.Element {
  const editor = useRef(null);

  console.log(`JoditComponent rendered with value for ${name}:`, value);

  const config = useMemo(
    () => ({
      readonly,
      placeholder: placeholder || "Start typing...",
      height,
      toolbarSticky: true,
      toolbarStickyOffset: 0,
      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "table",
        "link",
        "|",
        "left",
        "center",
        "right",
        "justify",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "fullsize",
      ],
      addNewLine: false,
    }),
    [placeholder, height, readonly]
  );

  const handleChange = (newContent: string) => {
    console.log(`JoditComponent onChange called with content:`, newContent);
    onChange({ target: { name, value: newContent } });
  };

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      tabIndex={0}
      onBlur={(newContent) => {
        console.log("JoditEditor onBlur with content:", newContent);
        handleChange(newContent);
      }}
      onChange={handleChange}
    />
  );
}

export default JoditComponent;
