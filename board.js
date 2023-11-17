const Board = () => {
    const borderRowClass =
        "board-row board-row flex  justify-evenly items-center";
      return (
        <div
          id="Harry"
          className="  flex items-center justify-center w-full h-screen text-white bg-slate-800 App"
        >
          <div id="Venki" className=" bg-white h-96 w-96">
            <div id="Rahul" className=" flex justify-between">
              <div id="Nikk" className="mb-2 text-xl">Player __ please move</div>
              <button
              id="button-1"
                type="button"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                new Game
              </button>
            </div>
            <div
              id="Rohit"
              className=" border-2 border-white border-solid border-container "
            >
              <div className={borderRowClass}></div>
              <div className={borderRowClass}></div>
              <div className={borderRowClass}></div>
            </div>
          </div>
        </div>
      );
    };
    
    export default Board;
    