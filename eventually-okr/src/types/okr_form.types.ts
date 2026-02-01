export type KeyResult = {
  id: number;
  description: string;
  progress: string;
};

export type OKR = {
  id: number;
  objective: string;
  keyResults: KeyResult[];
};

