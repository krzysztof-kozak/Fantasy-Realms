import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import swal from "@sweetalert/with-react";
import "../src/css/play.css";
import deck from "./data/deck.json";

export default function Play() {
  const [cards, setCards] = useState(deck.cards);
  const [playerHand, setPlayerHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isGameStarted, setisGameStarted] = useState(false);
  const [isGameFinished, setisGameFinished] = useState(false);
  const [endGameMessageDiplay, setEndGameMessageDiplay] = useState("none");

  function shuffle(array) {
    //Fisher–Yates shuffle: source: https://bost.ocks.org/mike/shuffle/
    var m = array.length,
      t,
      i;

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  const handleStart = () => {
    const randomCards = shuffle([...cards]);

    setPlayerHand(randomCards.slice(0, 8));

    randomCards.splice(0, 8);
    setCards(randomCards);

    setisGameStarted(true);
  };

  const discardCard = (toDiscard) => {
    const copyCards = cards.slice();
    const firstCard = copyCards.splice(0, 1);
    setPlayerHand((prev) => [
      ...prev.map((card) => (card.id !== toDiscard.id ? card : firstCard[0])),
    ]);
    setCards(copyCards);
    setDiscardPile((prev) => [...prev, { ...toDiscard }]);
  };

  const restartGame = () => {
    setCards(deck.cards);
    setPlayerHand([]);
    setDiscardPile([]);
    setTotalScore(0);
    setisGameStarted(false);
    setisGameFinished(false);
    setEndGameMessageDiplay("none");
  };

  useEffect(() => {
    let sum = [];
    playerHand.forEach((card) => {
      sum.push(card.basePoints);
      setTotalScore(sum.reduce((cur, prev) => cur + prev));
    });

    playerHand.length > 0 ? setisGameStarted(true) : setisGameStarted(false);
  }, [playerHand]);

  useEffect(() => {
    if (discardPile.length >= 5) {
      setisGameFinished(true);
      setEndGameMessageDiplay("block");
    }
  }, [discardPile]);

  useEffect(() => {
    if (isGameFinished === true) {
      swal("Game Finished", `Your total score was ${totalScore}`, "success", {
        buttons: ["Restart", "OK", "yes"],
      }).then((value) => {
        if (value === null) {
          restartGame();
        }
      });
    }
  }, [isGameFinished]);

  return (
    <div className="gameContainer box">
      <section className="drawPile">
        <div></div>
        <section>
          <button
            className="box"
            disabled={isGameStarted}
            onClick={handleStart}
            style={{ padding: "5px", fontSize: "1rem" }}
          >
            Draw new hand
          </button>

          <button
            className="restartButton box"
            onClick={restartGame}
            style={{ display: endGameMessageDiplay }}
          >
            Restart
          </button>
          <span style={{ display: discardPile.length >= 5 ? "none" : "block" }}>
            Current score:<span className="score">{totalScore}</span>
          </span>
          <p style={{ display: endGameMessageDiplay }}>
            Game finished. Your final score is
            <span className="score">{totalScore}</span>
          </p>
        </section>
      </section>

      <section className="discardPile">
        {discardPile.map((card) => (
          <div
            key={card.id}
            className="card"
            style={{
              backgroundImage: `url(./deck/${card.image})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              height: "100%",
            }}
          ></div>
        ))}
      </section>

      <section className="playerHand">
        {playerHand.map((card) => (
          <div key={card.id} className="card-container">
            <div className="wrapper">
              <button
                disabled={isGameFinished}
                onClick={() => discardCard(card)}
              >
                Discard
              </button>
              <p>
                Total Value: <span className="score">{card.basePoints}</span>
              </p>
            </div>
            <div
              style={{
                backgroundImage: `url(./deck/${card.image})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                height: "85%",
              }}
              className="card"
            ></div>
          </div>
        ))}
      </section>

      <Link className="link box" to="/">
        Back to Home
      </Link>
    </div>
  );
}
