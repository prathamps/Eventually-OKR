export type KeyResult = {
  id: number;
  description: string;
  progress: number;
  isCompleted?: boolean;
};

export type OKR = {
  id: number;
  title: string;
  keyResults: KeyResult[];
};
