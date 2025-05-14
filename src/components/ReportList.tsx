import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, TextField, Paper, useMediaQuery, useTheme } from "@mui/material";
import type { Report, ReportListProps } from "../types/report";
import { useReportContext } from "../context/ReportContext";
import { SortableReportCard } from "./SortableReportCard";

export const ReportList = ({ onEditReport }: ReportListProps) => {
  const { reports, reorderReports } = useReportContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = reports.findIndex((report) => report.id === active.id);
      const newIndex = reports.findIndex((report) => report.id === over.id);
      reorderReports(oldIndex, newIndex);
    }
  };

  const filteredReports = reports.filter((report: Report) =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          p: isMobile ? 1.5 : 2,
          borderBottom: 1,
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <TextField
          fullWidth
          label="Search reports"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          size="small"
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: isMobile ? 1.5 : 2,
          minHeight: 0,
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredReports.map((report: Report) => report.id)}
            strategy={verticalListSortingStrategy}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {filteredReports.map((report: Report) => (
                <SortableReportCard
                  key={report.id}
                  report={report}
                  onEdit={() => onEditReport(report)}
                />
              ))}
            </Box>
          </SortableContext>
        </DndContext>
      </Box>
    </Paper>
  );
};
