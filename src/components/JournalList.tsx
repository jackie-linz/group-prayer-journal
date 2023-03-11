import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type {
  PrayerJournal,
  PrayerJournalAccess,
  PrayerJournalCover,
  User,
} from "@prisma/client";
import Link from "next/link";
import React from "react";

import dynamic from "next/dynamic";
import { trpc } from "../utils/trpc";
import { JournalUsers } from "./JournalUsers";

const JournalCoverPhoto = dynamic(() => import("./JournalCoverPhoto"), {
  ssr: false,
});

const JournalListItem: React.FC<{
  journal: PrayerJournal & {
    owner: User;
    cover: PrayerJournalCover | null;
    accesses: (PrayerJournalAccess & {
      user: User;
    })[];
  };
}> = ({ journal }) => {
  return (
    <Card>
      <CardActionArea
        LinkComponent={Link}
        href={`/journal/${encodeURIComponent(journal.id)}`}
      >
        <Box sx={{ position: "relative", height: 250, overflow: "hidden" }}>
          <JournalCoverPhoto journal={journal} isThumbnail />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              p: 2,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)"
                  : "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)",
            }}
          >
            <Stack gap={1}>
              <Typography variant="h4">{journal.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {`created on ${journal.createdAt.toLocaleDateString()}`}
              </Typography>
              <JournalUsers journalUsers={journal} />
            </Stack>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
};

const JournalList: React.FC = () => {
  const journals = trpc.journal.all.useQuery();
  if (journals.isLoading || journals.data == null) {
    return (
      <Stack sx={{ alignItems: "center" }}>
        <CircularProgress />
        <Typography>Loading your journals...</Typography>
      </Stack>
    );
  }
  if (journals.data.length === 0) {
    return <Alert severity="info">You have not created any journal yet</Alert>;
  }
  return (
    <>
      <Stack direction="row" gap={2}>
        <Typography variant="h5">Prayer journals</Typography>
        {journals.isFetching ? <CircularProgress size={24} /> : null}
      </Stack>
      <Grid container spacing={2}>
        {journals.data.map((journal) => (
          <Grid item xs={12} sm={6} md={4} key={journal.id}>
            <JournalListItem journal={journal} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default JournalList;
