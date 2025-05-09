export interface DragAndDropProps {
	value: File | null;
	changeValueHandler: (file: File | null) => void;
	id?: string;
	mimetypes: string
  }