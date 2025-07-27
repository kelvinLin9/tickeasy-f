import { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState, FORMAT_TEXT_COMMAND } from "lexical";
import { Button } from "../ui/button";

const theme = {
  paragraph: "mb-2",
};

interface LexicalEditorProps {
  onChange: (content: string) => void;
  initialContent?: string;
  placeholder?: string;
  className?: string;
}

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

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex gap-1 border-b p-2">
      <Button variant="ghost" size="sm" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} className="font-bold">
        B
      </Button>
      <Button variant="ghost" size="sm" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} className="italic">
        I
      </Button>
      <Button variant="ghost" size="sm" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} className="underline">
        U
      </Button>
    </div>
  );
}

export default function LexicalEditor({
  onChange,
  initialContent,
  placeholder = "Start typing...",
  className = "border rounded min-h-[150px]",
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError: () => {},
    editable: true,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={className}>
        <ToolbarPlugin />
        <div className="relative p-4">
          <RichTextPlugin
            contentEditable={<ContentEditable className="relative z-10 min-h-[100px] outline-none" />}
            placeholder={<div className="absolute top-4 left-4 text-gray-400 select-none">{placeholder}</div>}
            ErrorBoundary={() => <div>Error</div>}
          />
          <HistoryPlugin />
          <OnChangePlugin
            onChange={(editorState: EditorState) => {
              editorState.read(() => {
                const json = editorState.toJSON();
                onChange(JSON.stringify(json));
              });
            }}
          />
          <InitialContentPlugin content={initialContent} />
        </div>
      </div>
    </LexicalComposer>
  );
}
