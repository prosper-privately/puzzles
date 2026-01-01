# Hint 5

## Why is reusing a one-time pad bad?

This mistake is so common it has a name: the **two-time pad** (or multi-time pad).

If you know one character of plaintext, you can derive the corresponding key value.
Since all messages use the **same pad**, that key value decrypts the same position
in **every** message.

For example: if message 1 starts with "T", and you see ciphertext "W" at position 0,
you can compute: `key[0] = (W - T) mod 28 = (22 - 19) mod 28 = 3`.

Now apply `key[0] = 3` to decrypt position 0 of **all** the other messages.
If the results look like plausible English letters, your guess was probably right.

## Where to start

"THE" is the most common word in the English language.
Could one of the messages start with "THE "? (including the space)

Try it. If the other messages also produce sensible starting letters, you've found
4 key values. Keep guessing common words and phrases to reveal more.
