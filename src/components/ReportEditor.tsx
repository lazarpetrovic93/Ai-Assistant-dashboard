import { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import type { ReportEditorProps, EditorConfig } from "../types/report";
import { useReportContext } from "../context/ReportContext";

export const ReportEditor = ({
  selectedReport,
  onClose,
}: ReportEditorProps) => {
  const { addReport, updateReport } = useReportContext();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const editorConfig: EditorConfig = {
    height: 400,
    menubar: false,
    statusbar: false,
    forced_root_block: "",
    entity_encoding: "raw",
    encoding: "xml",
    raw_entities: true,
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "code",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "code",
      "help",
      "wordcount",
    ],
    toolbar:
      "undo redo | blocks | " +
      "bold italic forecolor | alignleft aligncenter " +
      "alignright alignjustify | bullist numlist outdent indent | " +
      "removeformat | help",
    content_style:
      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
  };

  useEffect(() => {
    if (selectedReport) {
      setTitle(selectedReport.title);
      setContent(selectedReport.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [selectedReport]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const reportData = {
      title,
      content,
      createdAt: selectedReport?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (selectedReport) {
      updateReport(selectedReport.id, reportData);
    } else {
      addReport({
        id: crypto.randomUUID(),
        ...reportData,
      });
    }
    onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{selectedReport ? "Edit Report" : "New Report"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              required
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Editor
              apiKey="uo5n9cu0ymf1vky6yk2bwanuvfptt01ywuph7nkzgy26oup3"
              value={content}
              onEditorChange={(content: string) => setContent(content)}
              init={editorConfig}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {selectedReport ? "Save Changes" : "Create Report"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
