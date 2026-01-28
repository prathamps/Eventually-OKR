import './App.css'

function App() {


    return (
        <div className={'w-dvw border flex justify-center'}>
            <form className={"border-2 w-2/4 h-fit flex flex-col gap-2 p-4 my-4 rounded-lg border-gray-400"}
                  onSubmit={() => {
                  }}>
                <input type="text" placeholder={"Objectives"} name={"Objectives"}
                       className={"border-2 border-gray-200 rounded-lg p-2"}/>
                <input type="text" placeholder={"Key Results"}
                       className={"border-2 border-gray-200 rounded-lg p-2"}/>
                <div className={"flex justify-around"}>
                    <button type="submit"
                            className={"bg-blue-300 border-3 border-blue-900  p-2 px-4 rounded-xl"}>Submit
                    </button>
                    <button type="reset"
                            className={"bg-red-300 border-3 border-red-900  p-2 px-4 rounded-xl"}>Clear
                    </button>
                </div>
            </form>
        </div>
    )
}

export default App
