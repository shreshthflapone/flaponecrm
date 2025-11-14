import React, { useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";

import "./HtmlEditor.css";

const HtmlEditor = React.memo(({ onChange, descValue, readonly = false }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = useMemo(
    () => ({
      readonly: readonly,
      toolbar: [
        "bold",
        "italic",
        "underline",
        "font",
        "fontsize",
        "paragraph",
        "image",
        "video",
        "table",
        "link",
        "align",
        "undo",
        "redo",
        "selectall",
        "clean",
        "hr",
        "fullsize",
        "source",
        "iframe",
      ],
      uploader: {
        insertImageAsBase64URI: false,
        process: (file, onSuccess, onError) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            onSuccess(reader.result);
          };
          reader.onerror = () => onError("Upload failed.");
          reader.readAsDataURL(file);
        },
      },
      placeholder: "",
    }),
    []
  );

  const handleContentChange = (content) => {
    setContent(content);
    if (onChange) {
      onChange(content);
    }
  };
  useEffect(() => {
    setContent(descValue);
  }, [descValue]);

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content || ""}
        config={config}
        onChange={handleContentChange}
      />
    </div>
  );
});

export default HtmlEditor;
