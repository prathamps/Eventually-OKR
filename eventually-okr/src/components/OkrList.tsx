import type { KeyResult, OKR } from "../types/okr_form.types.ts";

type OKRListProps = {
  okr: OKR[]
};

const OkrList = ({ okr }: OKRListProps) => {
  console.log("OkrList", okr);
  return (
    <div>
      {okr && okr.map((objective: OKR, index: number) => {
        return <div key={index}>
          <h1>{objective.objective}</h1>
          {objective.keyResults?.map((keyResult: KeyResult, index: number) => {
            return (
              <p key={index}>
                <input
                  type="checkbox"
                  name="key_result_checkbox"
                  id="key_result_checkbox"
                />
                {keyResult.description} - {keyResult.progress}
              </p>
            );
          })}
        </div>;
      })}
    </div>
  );
};
export default OkrList;
