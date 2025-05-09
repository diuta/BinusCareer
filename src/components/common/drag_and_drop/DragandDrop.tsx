import { Box, Button, Typography } from '@mui/material';

import { DragAndDropProps } from './DragandDropProps';

export function DragAndDrop({
  value,
  changeValueHandler,
  id = 'drag-and-drop',
  mimetypes,
}: DragAndDropProps) {
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    changeValueHandler(droppedFile);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <label
        htmlFor={id}
        style={{
          cursor: 'pointer',
          textAlign: 'center',
          width: '100%',
          border: '3px solid #ccc',
          borderRadius: '8px',
          backgroundColor: 'white',
          padding: '32px',
        }}
        onDragOver={event => event.preventDefault()}
        onDrop={event => handleDrop(event)}
      >
        <input
          type="file"
          id={id}
          key={id}
          style={{ display: 'none' }}
          onChange={e => changeValueHandler(e.target.files?.[0] || null)}
          value={value?.webkitRelativePath}
          accept={mimetypes}
        />
        {!value ? (
          <Typography variant="label" color="#999">
            Drag and Drop File Here
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="label">Selected File:</Typography>
            <Typography variant="label" key={value.name}>
              {value.name}
            </Typography>
            <Button
              type="button"
              variant="outlined"
              onClick={e => {
                changeValueHandler(null);
              }}
              sx={{ width: 'fit-content', fontSize: '12px' }}
            >
              Clear Files
            </Button>
          </Box>
        )}
      </label>
    </Box>
  );
}
