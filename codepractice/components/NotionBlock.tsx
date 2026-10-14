"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { PartialBlock } from "@blocknote/core";
import { useMemo } from "react";

export default function NotionBlock({ 
  initialContent, 
  onChange,
  readOnly = false
}: { 
  initialContent?: PartialBlock[] | string,
  onChange?: (document: PartialBlock[]) => void,
  readOnly?: boolean
}) {
  const { theme } = useTheme();
  
  const parsedContent = useMemo(() => {
    if (typeof initialContent === "string") {
      try {
        return JSON.parse(initialContent);
      } catch (e) {
        return undefined;
      }
    }
    return initialContent;
  }, [initialContent]);

  const editor = useCreateBlockNote({ 
    initialContent: parsedContent
  });

  return (
    <div className="h-full w-full overflow-y-auto no-scrollbar p-2">
      <BlockNoteView 
        editor={editor} 
        theme={theme === "dark" ? "dark" : "light"}
        onChange={() => {
          if (onChange) onChange(editor.document);
        }}
        editable={!readOnly}
      />
    </div>
  );
}
