# Hint 7

## How to Use `hint7.html` to Solve the Puzzle

This page is a **manual crib-dragging tool**.
It helps you test guesses against reused one-time-pad ciphertexts and keep track of the key as you discover it.

You are still solving the puzzle yourself. The tool just does the arithmetic and bookkeeping.

---

### What You’re Looking At

When you open `hint7.html` in your web browser, you’ll see:

- **Ciphertexts**  
  The intercepted encrypted messages (already loaded).

- **Position**  
  A number indicating where in the message your guess should start  
  (positions are **0-based**, so the first character is position `0`).

- **Guess**  
  A word or phrase you think appears in the plaintext  
  (use only `A–Z`, spaces, and periods).

- **Preview (partial decrypt)**  
  Shows what the messages would look like *if your guess were correct*.

- **Highlighted characters**  
  These are the characters that **change** as a result of your guess.  
  These are the only characters you should be evaluating.

---

### Basic Workflow

#### 1. Pick a position

Start with position `0` (this is filled in for you automatically).

Later, the tool will move you to the next unknown position.

---

#### 2. Enter a guess

Type a likely word or phrase into **Guess**.
For example, "THE" is one of the most common words in the English language.
Under the circumstances, "DELI" and "RECIPE" seem like good guesses too.

Don't forget that the messages can contain spaces and periods.
You'll need to guess those characters.

#### 3. Try your guess against different messages

Click on each message to try your guess against that message.
Alternatively, click "Next" to try the next message.

#### 4. Evaluate the guess

Look at the highlighted characters. Do they all make sense?
If only one or two look right, then the guess is probably wrong.

If all the messages look plausible, then your guess is probably correct.
Click "Looks good. Update the key."

#### 5. Repeat

The position will be updated to the next, unguessed position.

Look at what you have decrypted so far. Use that to inform your next guess.

### Troubleshooting

- **Nothing happens when I double-click**  
  Try right-clicking `hint7.html` and choosing **Open with → your browser**.

- **The page looks blank or broken**  
  Make sure `hint7.html`, `hint7.js`, and `hint7.css` are all in the **same folder**.

- **I opened it on GitHub and it didn’t work**  
  You must download the files and open `hint7.html` locally.  
  Opening the file preview on GitHub will not run the puzzle.

## Ruby Script (for programmers or people who like the command line)

Create an empty file in this directory called `key.txt`.
This will include 1 number between 0 and 27 on each line.
These are your guesses at the correct key.
Leave lines blank if you don't have a guess yet.

- Line 1 = Character 1
- Line 2 = Character 2
- ...
- Line N = Character N

Run this

```bash
ruby hint7.rb <position> "<your guess>"

# For example
ruby hint7.rb 0 "THE "
```

This will try to decrypt all the messages at the given position, assuming your guess is correct.
Your guess will be shown in quotes.
If the other messages look right, then the guess is probably correct.

When you select `y`, it will save the key for your guess in `key.txt`.

Keep guessing until you can decrypt the whole message.

Extra hint: if you are stuck, try guessing either " " or "E".
Those are the two most common characters.

(In cryptanalysis, a guessed piece of plaintext is called a "crib".)

## Glossary

**Crib**
A known or guessed piece of plaintext. For example, if you suspect a message contains "THE ", that phrase is your crib.

**Crib Dragging**
The technique of "sliding" a crib across different positions in the ciphertext, testing each position to see if it produces sensible plaintext in other messages encrypted with the same key. This is the core technique for breaking a two-time pad.
