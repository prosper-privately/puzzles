# Hint 7

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
