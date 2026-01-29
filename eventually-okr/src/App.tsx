import "./App.css";
import React from "react";

function Apple() {
  function displayObjectives(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    // const submitter = e.submitter;
    // const form = e.target as HTMLFormElement;
    const formData = new FormData(e.target);
    const objectives = formData.get("objectives");
    const key_results = formData.get("key_results");
    console.log(objectives);
    console.log(key_results);
  }

  return (
    <div>

    <div className={"w-dvw border flex justify-center"}>
      <form
        className={
          "border-2 w-2/4 h-fit flex flex-col gap-2 p-4 my-4 rounded-lg border-gray-400"
        }
        onSubmit={displayObjectives}
      >
        <input
          type="text"
          placeholder={"Objectives"}
          name={"objectives"}
          className={"border-2 border-gray-200 rounded-lg p-2"}
          required={true}
        />
        <input
          type="text"
          name={"key_results"}
          placeholder={"Key Results"}
          className={"border-2 border-gray-200 rounded-lg p-2"}
          required={true}
        />
        <div className={"flex justify-around"}>
          <button
            type="submit"
            className={
              "bg-blue-300 border-3 border-blue-900  p-2 px-4 rounded-xl"
            }
          >
            Submit
          </button>
          <button
            type="reset"
            className={
              "bg-red-300 border-3 border-red-900  p-2 px-4 rounded-xl"
            }
          >
            Clear
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Apple;
