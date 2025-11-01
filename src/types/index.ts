export interface ListItem {
  id: string;
  title: string;
  subtitle: string;
  dateCreated: Date;
}

export interface FormData {
  title: string;
  subtitle: string;
}

export interface ListItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
  title: string;
}

export interface ListItemProps {
  item: ListItem;
  onEdit: (item: ListItem) => void;
  onDelete: (id: string) => void;
}