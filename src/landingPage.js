import React from "react";
import '../src/css/landingPage.css';

export default function landingPage() {
  return (
    <div className="container">
      <header className="box">
        <h1>Fantasy Realms</h1>
      </header>

      <section className="play box">
        <p>Play</p>
      </section>

      <section className="rules box">
        <p>Rules</p>
      </section>

      <section className="about box">
        <p>About this Project</p>
      </section>

      <footer className="box">Footer info</footer>
    </div>
  );
}