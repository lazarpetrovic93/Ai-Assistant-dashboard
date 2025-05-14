import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  DragIndicator as DragIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import type { SortableReportCardProps } from "../types/report";
import { useReportContext } from '../context/ReportContext';

export const SortableReportCard = ({
  report,
  onEdit,
}: SortableReportCardProps) => {
  const { deleteReport } = useReportContext();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: report.id,
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEdit = () => {
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this report?')) {
      deleteReport(report.id);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        position: "relative",
        touchAction: "none",
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
        }}
      >
        <Box
          className="drag-handle"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            height: '100%',
            width: '100%',
            '&:active': {
              cursor: 'grabbing',
            },
          }}
          {...attributes}
          {...listeners}
        >
          <DragIcon
            sx={{
              color: 'text.secondary',
              fontSize: 20,
            }}
          />
        </Box>
      </Box>

      <Box
        className="action-buttons"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 1,
          zIndex: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={handleEdit}
          sx={{
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            },
          }}
        >
          <EditIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>

        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'error.light',
              color: 'error.contrastText',
            },
          }}
        >
          <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Box>

      <CardContent sx={{ p: isMobile ? 1.5 : 2, pl: 6, pr: 6 }}>
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          gutterBottom
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {report.title}
        </Typography>

        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            // WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: 1,
            "& p": {
              margin: 0,
              padding: 0,
            },
            "& ul, & ol": {
              margin: 0,
              paddingLeft: 2,
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
            },
            "& table": {
              borderCollapse: "collapse",
              width: "100%",
              "& td, & th": {
                border: "1px solid #ddd",
                padding: "8px",
              },
            },
          }}
          dangerouslySetInnerHTML={{ __html: report.content }}
        />
      </CardContent>
    </Card>
  );
};
