export type CreateObjectiveDto = {
  objective: string;
  keyResults?: Array<{
    description: string;
    progress: number;
  }>;
};
