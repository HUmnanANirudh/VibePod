import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface DeleteClipDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteClipDialog({ open, onConfirm, onCancel }: DeleteClipDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-zinc-100">Delete Clip?</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            This action cannot be undone. This will permanently delete the clip from the track.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
