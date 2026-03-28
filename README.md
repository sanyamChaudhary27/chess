# Vanilla JS Chess Engine: A Journey in Self-Reliance

### "I am not 'nothing' without a prompt."

This project was born out of a personal "intervention." After realizing a growing over-dependence on AI tools and a decline in my core programming intuition, I decided to go back to basics. No frameworks, no high-level IDEs—just **Notepad**, **Vanilla JavaScript**, and **raw logic**.



## The Mission
In an era where billions are spent making developers dependent on AI, I wanted to prove that I could build a complex system from scratch in a language relatively new to me. This isn't just a chess game; it's a "warm place" in my portfolio that represents growth, grit, and technical independence in the current world where code bases are becoming black boxes.

## Technical Highlights
Building a chess engine in pure JS requires managing a massive amount of state and edge cases (ex: en-pessant, if a piece can block the check, recusion of king move checks).

* **Custom Move Logic:** Deep-coded movement rules for all pieces, including the "tricky" ones:
    * **En Passant:** Tracking the `lastMove` state to allow for the unique pawn capture.
    * **Pawn Promotion:** Integrated UI to handle the transformation of pawns reaching the 8th rank.
* **The Check/Checkmate Loop:** * `isInCheck()`: A recursive-style scanner that checks every enemy piece's trajectory against the King’s position.
    * `checkCheckMate()`: Logic that determines if a King is truly trapped or if a move exists to break the line of fire.
* **State-Aware UI:** A custom `updateCheckUI` and `clearHighlight` system that ensures "Check" warnings (red outlines) persist even when a player is clicking around to plan their next move.

## The "Notepad" Challenge
The most difficult part wasn't just the logic—it was the **Frontend**. Without a framework to manage components, I had to:
1.  Handle the DOM directly to reflect game states.
2.  Perfect the CSS grid and piece alignment to ensure the board felt "premium" despite its manual origins.
3.  Debug visual conflicts between move suggestions (blue) and critical status alerts (red).



## How to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/sanyamChaudhary27/chess.git
   ```
2. Open `index.html` in any modern browser.
3. Play a game against yourself (or a friend) to test the logic!

---
**Author:** Sanyam Chaudhary  
**Philosophy:** Keep the logic manual. Keep the mind sharp.