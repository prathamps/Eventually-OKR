export type KeyResult = {
  id: number;
  description: string;
  progress: string | number;
};

export type OKR = {
  id: number;
  objective: string;
  keyResults: KeyResult[];
};
