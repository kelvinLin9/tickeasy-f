import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function InitialContentPlugin({ content }: { content?: string }) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (content && !isInitialized.current) {
      try {
        const editorState = editor.parseEditorState(content);
        editor.setEditorState(editorState);
        isInitialized.current = true;
      } catch {
        // console.warn("Failed to parse initial content:", error);
      }
    }
  }, [editor, content]);

  return null;
}

export function LexicalViewer({ content, className = "" }: { content: string; className?: string }) {
  const initialConfig = {
    namespace: "Viewer",
    theme: { paragraph: "mb-2" },
    onError: () => {},
    editable: false,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={className}>
        <RichTextPlugin
          contentEditable={<ContentEditable className="min-h-[20px] outline-none" />}
          placeholder={null}
          ErrorBoundary={() => <div>Error</div>}
        />
        <InitialContentPlugin content={content} />
      </div>
    </LexicalComposer>
  );
}
