import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";

import { trpc } from "../utils/trpc";
import { FullScreenDialog } from "./FullScreenDialog";

const NewJournalDialogContent: React.FC<{ closeDialog: () => void }> = ({
  closeDialog,
}) => {
  const utils = trpc.useContext();
  const mutation = trpc.journal.create.useMutation({
    onSuccess() {
      utils.journal.all.invalidate();
    },
  });
  const [name, setName] = useState("");

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleCreate = () => {
    mutation.mutate({
      name,
    });
    closeDialog();
  };
  return (
    <>
      <DialogTitle>Create new prayer journal</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A prayer journal can be shared to other people in your prayer group.
          Give it a memorable name, e.g. the name of your group.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Name"
          value={name}
          onChange={onNameChange}
          sx={{ flexGrow: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button aria-label="cancel" onClick={closeDialog}>
          Cancel
        </Button>
        <Button
          aria-label="create journal"
          variant="contained"
          onClick={handleCreate}
        >
          Create
        </Button>
      </DialogActions>
    </>
  );
};

const NewJournal: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  return (
    <>
      <Tooltip title="Create new journal">
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
          onClick={() => setShowCreateDialog(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <FullScreenDialog
        maxWidth="sm"
        fullWidth
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      >
        <NewJournalDialogContent
          closeDialog={() => setShowCreateDialog(false)}
        />
      </FullScreenDialog>
    </>
  );
};

export default NewJournal;
