import React, { useState, useCallback, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ initialValue, onChange, editorIndex, readOnly }) => {
  const [content, setContent] = useState(initialValue);
  const [showCode, setShowCode] = useState(false);

  const toggleCodeView = useCallback(() => {
    setShowCode((prevShowCode) => !prevShowCode);
  }, []);

  useEffect(() => {
    const customButton = document.querySelector(`.ql-a-${editorIndex}`);

    if (customButton) {
      customButton.title = "source";
      customButton.addEventListener("click", toggleCodeView);

      return () => {
        customButton.removeEventListener("click", toggleCodeView);
      };
    }
  }, [toggleCodeView, showCode, editorIndex]);

  const modules = {
    toolbar: readOnly
      ? false
      : {
          container: [
            [{ header: "2" }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            [`a-${editorIndex}`],
          ],
        },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    `a-${editorIndex}`,
  ];

  const handleQuillChange = (value) => {
    setContent(value);
    onChange(value);
  };

  return (
    <div className="editor-set">
      <div className="editor-controls mb8 cp">
        {showCode && (
          <div className="v-center" onClick={toggleCodeView}>
            <IoMdArrowBack className="mr8" />
            Back
          </div>
        )}
      </div>
      {showCode ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            minHeight: "160px",
            width: "100%",
            padding: "8px",
            resize: "none",
          }}
          readOnly={readOnly}
        />
      ) : (
        <ReactQuill
          modules={modules}
          formats={formats}
          placeholder="Main description ...."
          value={content}
          onChange={handleQuillChange}
          style={{ maxHeight: "200px", width: "100%" }}
          readOnly={readOnly}
          className={readOnly ? "quill-disabled" : ""}
        />
      )}
    </div>
  );
};

export default TextEditor;
