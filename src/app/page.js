// "use client";
// import Chessboard from "chessboardjsx";
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { Chess } from "chess.js";

// // Initialize the socket connection
// const socket = io("https://chess-master-backend.vercel.app/");

// export default function Home() {
//   const [isClient, setIsClient] = useState(false);
//   const [game, setGame] = useState(new Chess());
//   const [fen, setFen] = useState("start");
//   const [status, setStatus] = useState("");
//   const [whiteMoves, setWhiteMoves] = useState([]);
//   const [blackMoves, setBlackMoves] = useState([]);
//   const [roomId, setRoomId] = useState(null);
//   const [playerColor, setPlayerColor] = useState(null);

//   useEffect(() => {
//     setIsClient(true);

//     socket.on("roomJoined", (room, color) => {
//       console.log(`Joined room: ${room} as ${color}`);
//       setRoomId(room);
//       setPlayerColor(color);
//       updateStatus(); // Set initial status on joining
//     });

//     socket.on("move", (moveData) => {
//       console.log("Move received:", moveData);
//       const move = game.move(moveData);
//       if (move) {
//         setFen(game.fen());
//         updateMoves(move);
//         updateStatus(); // Update status after the move
//       }
//     });

//     return () => {
//       socket.off("roomJoined");
//       socket.off("move");
//     };
//   }, [game]);

//   const onDrop = ({ sourceSquare, targetSquare }) => {
//     const currentTurn = game.turn();
    
//     // Check if it's the player's turn
//     if ((playerColor === "white" && currentTurn !== "w") || 
//         (playerColor === "black" && currentTurn !== "b")) {
//       // alert(`It's ${currentTurn === "w" ? "White" : "Black"}'s turn!`);
//       alert(`It's ${currentTurn === "w" ? "White" : "Black"}'s turn!`);
//       return;
//     }

//     const moves = game.moves({ square: sourceSquare, verbose: true });
//     const validMove = moves.some((move) => move.to === targetSquare);

//     if (!validMove) {
//       alert("Invalid move, please try again!");
//       return;
//     }

//     const isPromotion = moves.some(
//       (move) => move.flags.includes("p") && move.to === targetSquare
//     );

//     const move = game.move({
//       from: sourceSquare,
//       to: targetSquare,
//       promotion: isPromotion ? "q" : undefined,
//     });

//     if (move) {
//       setFen(game.fen());
//       updateMoves(move);
//       updateStatus();

//       // Emit the move to the server
//       if (roomId) {
//         socket.emit("move", roomId, {
//           from: sourceSquare,
//           to: targetSquare,
//           promotion: isPromotion ? "q" : undefined,
//         });
//       } else {
//         console.error("Room ID not set");
//       }
//     } else {
//       alert("Invalid move");
//     }
//   };

//   const updateStatus = () => {
//     if (game.isGameOver()) {
//       if (game.isCheckmate()) {
//         setStatus(`Game Over: ${game.turn() === "w" ? "Black" : "White"} wins by checkmate!`);
//       } else if (game.isDraw()) {
//         setStatus("Game Over: It's a draw!");
//       } else if (game.isStalemate()) {
//         setStatus("Game Over: Stalemate!");
//       } else if (game.isThreefoldRepetition()) {
//         setStatus("Game Over: Draw by threefold repetition!");
//       } else if (game.isInsufficientMaterial()) {
//         setStatus("Game Over: Draw by insufficient material!");
//       }
//     } else {
//       setStatus(`Next Move: ${game.turn() === "w" ? "White" : "Black"}`);
//     }
//   };

//   const updateMoves = (move) => {
//     const moveNotation = `${move.from}-${move.to}`;
//     if (move.color === "w") {
//       setWhiteMoves((prevMoves) => [...prevMoves, moveNotation]);
//     } else {
//       setBlackMoves((prevMoves) => [...prevMoves, moveNotation]);
//     }
//   };

//   useEffect(() => {
//     updateStatus(); // Set the initial status when the component loads
//   }, []);

//   if (!isClient) return null;

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div>
//         <h1 className="text-3xl font-bold text-center my-5">Chess Master</h1>
//         <Chessboard
//           position={fen}
//           onDrop={onDrop}
//           draggable={true}
//           dropOffBoard="snapback"
//         />
        
//         <div className="text-center mt-4">
//           <p className="text-lg font-semibold">{status}</p>
//         </div>

//         {/* Moves List */}
//         <div className="mt-2">
//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <h3 className="text-lg font-bold">White's Moves:</h3>
//               <ul className="flex flex-wrap ml-5 space-x-2">
//                 {whiteMoves.map((move, index) => (
//                   <li key={index} className="inline">{move},</li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-bold">Black's Moves:</h3>
//               <ul className="flex flex-wrap ml-5 space-x-2">
//                 {blackMoves.map((move, index) => (
//                   <li key={index} className="inline">{move},</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import dynamic from "next/dynamic"; // Dynamically load components
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Chess } from "chess.js";

// Dynamically load Chessboard because it relies on the window object
const Chessboard = dynamic(() => import("chessboardjsx"), { ssr: false });

// Initialize the socket connection
const socket = io("https://chess-master-backend.vercel.app/");

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState("start");
  const [status, setStatus] = useState("");
  const [whiteMoves, setWhiteMoves] = useState([]);
  const [blackMoves, setBlackMoves] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);

  useEffect(() => {
    setIsClient(true);

    socket.on("roomJoined", (room, color) => {
      console.log(`Joined room: ${room} as ${color}`);
      setRoomId(room);
      setPlayerColor(color);
      updateStatus(); // Set initial status on joining
    });

    socket.on("move", (moveData) => {
      console.log("Move received:", moveData);
      const move = game.move(moveData);
      if (move) {
        setFen(game.fen());
        updateMoves(move);
        updateStatus(); // Update status after the move
      }
    });

    return () => {
      socket.off("roomJoined");
      socket.off("move");
    };
  }, [game]);

  const onDrop = ({ sourceSquare, targetSquare }) => {
    const currentTurn = game.turn();
    
    // Check if it's the player's turn
    if ((playerColor === "white" && currentTurn !== "w") || 
        (playerColor === "black" && currentTurn !== "b")) {
      alert(`It's ${currentTurn === "w" ? "White" : "Black"}'s turn!`);
      return;
    }

    const moves = game.moves({ square: sourceSquare, verbose: true });
    const validMove = moves.some((move) => move.to === targetSquare);

    if (!validMove) {
      alert("Invalid move, please try again!");
      return;
    }

    const isPromotion = moves.some(
      (move) => move.flags.includes("p") && move.to === targetSquare
    );

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: isPromotion ? "q" : undefined,
    });

    if (move) {
      setFen(game.fen());
      updateMoves(move);
      updateStatus();

      // Emit the move to the server
      if (roomId) {
        socket.emit("move", roomId, {
          from: sourceSquare,
          to: targetSquare,
          promotion: isPromotion ? "q" : undefined,
        });
      } else {
        console.error("Room ID not set");
      }
    } else {
      alert("Invalid move");
    }
  };

  const updateStatus = () => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setStatus(`Game Over: ${game.turn() === "w" ? "Black" : "White"} wins by checkmate!`);
      } else if (game.isDraw()) {
        setStatus("Game Over: It's a draw!");
      } else if (game.isStalemate()) {
        setStatus("Game Over: Stalemate!");
      } else if (game.isThreefoldRepetition()) {
        setStatus("Game Over: Draw by threefold repetition!");
      } else if (game.isInsufficientMaterial()) {
        setStatus("Game Over: Draw by insufficient material!");
      }
    } else {
      setStatus(`Next Move: ${game.turn() === "w" ? "White" : "Black"}`);
    }
  };

  const updateMoves = (move) => {
    const moveNotation = `${move.from}-${move.to}`;
    if (move.color === "w") {
      setWhiteMoves((prevMoves) => [...prevMoves, moveNotation]);
    } else {
      setBlackMoves((prevMoves) => [...prevMoves, moveNotation]);
    }
  };

  useEffect(() => {
    updateStatus(); // Set the initial status when the component loads
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-center my-5">Chess Master</h1>
        <Chessboard
          position={fen}
          onDrop={onDrop}
          draggable={true}
          dropOffBoard="snapback"
        />
        
        <div className="text-center mt-4">
          <p className="text-lg font-semibold">{status}</p>
        </div>

        {/* Moves List */}
        <div className="mt-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <h3 className="text-lg font-bold">White's Moves:</h3>
              <ul className="flex flex-wrap ml-5 space-x-2">
                {whiteMoves.map((move, index) => (
                  <li key={index} className="inline">{move},</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">Black's Moves:</h3>
              <ul className="flex flex-wrap ml-5 space-x-2">
                {blackMoves.map((move, index) => (
                  <li key={index} className="inline">{move},</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
