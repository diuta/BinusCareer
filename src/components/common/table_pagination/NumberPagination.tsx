import {
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { PaginationControls } from './IPagination';

export default function NumberPagination({
  pageIndex,
  pageCount,
  setPageIndex,
}: PaginationControls) {
  const [jumpPage, setJumpPage] = useState(0);

  const handlePageClick = (page: number) => {
    setPageIndex(page - 1);
    setJumpPage(0);
  };

  const handleJumpPages = (event: SelectChangeEvent<number>) => {
    const selectedPage = Number(event.target.value);
    setPageIndex(selectedPage - 1);
    setJumpPage(selectedPage);
  };

  useEffect(() => {
    setJumpPage(pageIndex + 1);
  }, [pageIndex]);

  return (
    <Stack direction="row" sx={{ alignItems: 'center' }} gap="10px">
      <Pagination
        count={pageCount}
        page={pageIndex + 1}
        onChange={(event, value) => handlePageClick(value)}
        shape="circular"
        color="primary"
        size="small"
        sx={{ fontSize: 12}}
      />

      <Typography sx={{ margin: 'auto 0 !important' }} variant="label">Jump to: </Typography>
      <Select
        value={jumpPage}
        onChange={handleJumpPages}
        displayEmpty
        sx={{ width: 60, ' .binus-InputBase-input': { padding: '7px 10px 6px 8px !important'},  }}
        SelectDisplayProps={{ style: { fontSize: 12 } }}
      >
        {Array.from({ length: pageCount }, (_, i) => i + 1)
          .reverse()
          .map(page => (
            <MenuItem key={page} value={page > 0 ? page : ''}>
              <Typography variant="label" sx={{ marginBottom: '0 !important' }}>
                {page > 0 ? page : ''}
              </Typography>
            </MenuItem>
          ))}
      </Select>
    </Stack>
  );
}
