#!/usr/bin/env ruby
# otp_autosolve.rb
#
# Auto-solver loop for "two-time pad" crib dragging (mod 28, A-Z + space + period).
#
# Input:
#   cipher.txt  (one ciphertext message per line)
#
# Output:
#   Iteratively improves a sparse key guess and prints partially decrypted messages.
#
# Configure:
#   Edit CRIBS (candidate words/phrases) and DICTIONARY_WORDS below.

# =========================
# CONFIG (easy to change)
# =========================

CRIBS = [
  "THE ",
  "RECIPE",
  "TONIGHT",
  "TOMORROW",
  " SAFE",
  " DELI",
  " COPY",
  "PASSWORD",
  "CLOSE",
  " WE ",
  " MEET",
  " AFTER",
  " CAMERA",
  " PHOTO",
  " NOTES",
  " SELL",
]

# Small starter dictionary. Expand/replace freely.
DICTIONARY_WORDS = %w[
  THE AND YOU YOUR WE OUR THEY THEIR TO OF IN IS IT A AN ON AT AS
  TONIGHT TOMORROW NOON AFTER BEFORE CLOSES CLOSING TIME
  DELI PASTRAMI RECIPE SAFE COUNTER PASSWORD CAMERA PHOTO NOTES
  COPY OPEN LEAVE WORK FAST NO FLASH MEET ORDER SOUP MUSTARD PICKLES
  SELL RIVAL
].freeze

RARE_LETTERS = "JQXZ"

# How aggressive the solver is
MAX_ITERS = 80
MIN_NEW_KEY_POSITIONS = 1     # require at least this many new key positions from a winning guess
MIN_SCORE_IMPROVEMENT = 5.0   # require score improvement over best-so-far
PRINT_EVERY_ITER = true
VARIANCE_PENALTY_MULTIPLIER = 2.0

# =========================
# Alphabet / helpers
# =========================

ALPHABET = ("A".."Z").to_a + [" ", "."]
CHAR_TO_NUM = ALPHABET.each_with_index.to_h
NUM_TO_CHAR = ALPHABET.each_with_index.map { |c, i| [i, c] }.to_h
MOD = 28

COMMON_BIGRAMS = %w[
  TH HE IN ER AN RE ON AT EN ND TI ES OR TE OF ED IS IT AL AR ST TO NT
].freeze
COMMON_BIGRAM_SET = COMMON_BIGRAMS.to_h { |b| [b, true] }
DICTIONARY = DICTIONARY_WORDS.to_h { |w| [w, true] }

def valid_text!(s, label)
  s.each_char do |ch|
    raise ArgumentError, "Invalid character in #{label}: #{ch.inspect}" unless CHAR_TO_NUM.key?(ch)
  end
end

def dec_char(cipher_ch, key_num)
  c = CHAR_TO_NUM.fetch(cipher_ch)
  NUM_TO_CHAR[(c - key_num) % MOD]
end

def partial_decrypt(cipher_texts, partial_key)
  cipher_texts.map do |ct|
    out = +""
    ct.length.times do |i|
      k = partial_key[i]
      out << (k.nil? ? "_" : dec_char(ct[i], k))
    end
    out
  end
end

def score_partial(msg)
  # msg like "TON___T WE C___ ..."
  revealed = msg.chars.reject { |ch| ch == "_" }
  return -10_000 if revealed.empty?

  s = 0.0

  # Hard-ish constraints
  s -= 10.0 * msg.scan(/ \./).length
  s -= 40.0  * msg.scan(/  /).length
  s -= 15.0 * msg.scan(/[A-Z]\.[A-Z]/).length

  cleaned = msg.tr("_", " ")

  # Penalize rare letters inside fully revealed word fragments (no underscores)
  msg.scan(/[A-Z]+/) do |w|
    next if w.include?("_")
    next if w.length < 4
    rare = w.count(RARE_LETTERS)
    s -= rare * 8.0
  end

  longest_run = cleaned.split(/[ .]+/).map(&:length).max || 0
  s -= (longest_run - 18) * 3.0 if longest_run > 18

  # Space rate
  space_count = revealed.count(" ")
  space_rate = space_count.to_f / revealed.length
  if space_rate.between?(0.10, 0.40)
    s += 30.0
  elsif space_rate < 0.03
    s -= 40.0
  end

  # Bigram plausibility (letters only, ignore underscores/spaces/periods)
  letters_only = msg.gsub(/[^A-Z_]/, "")
  letters_only.chars.each_cons(2) do |a, b|
    next if a == "_" || b == "_"
    bigram = a + b
    if COMMON_BIGRAM_SET[bigram]
      s += 2.0
    elsif a == "Q" && b != "U"
      s -= 6.0
    end
  end

  # Dictionary hits for fully revealed tokens
  tokens = msg.split(/[ .]+/)
  tokens.each do |t|
    next if t.length < 3
    next if t.include?("_")
    s += 6.0 if DICTIONARY[t]
  end

  # Penalize fully revealed long words that are NOT in dictionary
  tokens.each do |t|
    next if t.length < 5
    next if t.include?("_")
    s -= 4.0 unless DICTIONARY[t]
  end


  s
end

def score_guess(partially_decrypted_messages)
  scores = partially_decrypted_messages.map { |m| score_partial(m) }
  total = scores.sum
  mean  = total / scores.length
  var   = scores.map { |x| (x - mean) ** 2 }.sum / scores.length
  total - Math.sqrt(var) * VARIANCE_PENALTY_MULTIPLIER
end

# Build key fragment implied by assuming crib appears at ct[target_idx] starting at pos
# Returns [key_fragment_hash, new_key_positions_count] or nil if conflicts/invalid.
def key_fragment_from_crib(cipher_text, crib, pos, partial_key, coverage)

  return nil if pos < 0
  return nil if pos + crib.length > cipher_text.length

  frag = {}
  crib.chars.each_with_index do |p_ch, off|
    i = pos + off
    p = CHAR_TO_NUM[p_ch]
    c = CHAR_TO_NUM[cipher_text[i]]
    k = (c - p) % MOD

    known = partial_key[i]
    return nil if !known.nil? && known != k

    frag[i] = k
  end

  new_count = frag.count { |i, k| partial_key[i].nil? && coverage[i] >= MIN_CONFIRMING_CIPHERS }
  return nil if new_count == 0

  [frag, new_count]
end

def merge_key(partial_key, frag)
  merged = partial_key.dup
  frag.each { |i, k| merged[i] = k }
  merged
end

# =========================
# Main
# =========================

cipher_lines = File.readlines("cipher.txt", chomp: true).reject { |line| line.empty? }
raise "cipher.txt is empty" if cipher_lines.empty?

cipher_lines.each_with_index { |ct, idx| valid_text!(ct, "ciphertext line #{idx}") }

max_len = cipher_lines.map(&:length).max

coverage = Array.new(max_len, 0)
cipher_lines.each do |ct|
  ct.length.times { |i| coverage[i] += 1 }
end
MIN_CONFIRMING_CIPHERS = 2  # at least target + one other

partial_key = Array.new(max_len, nil)

# Baseline score with no key
best_messages = partial_decrypt(cipher_lines, partial_key)
best_score = score_guess(best_messages)

puts "Loaded #{cipher_lines.length} messages. Max length=#{max_len}."
puts "Initial score: #{best_score.round(2)}"
puts

MAX_ITERS.times do |iter|
  best_candidate = nil
  best_candidate_score = best_score
  best_candidate_frag = nil
  best_candidate_new = 0
  best_candidate_desc = nil

  cipher_lines.each_with_index do |target_ct, target_idx|
    CRIBS.each do |crib|
      valid_text!(crib, "crib #{crib.inspect}")

      0.upto(target_ct.length - crib.length) do |pos|
        frag_and_new = key_fragment_from_crib(target_ct, crib, pos, partial_key, coverage)
        next if frag_and_new.nil?
        frag, new_count = frag_and_new
        next if new_count < MIN_NEW_KEY_POSITIONS

        candidate_key = merge_key(partial_key, frag)
        candidate_msgs = partial_decrypt(cipher_lines, candidate_key)
        candidate_score = score_guess(candidate_msgs)

        if candidate_score > best_candidate_score
          best_candidate_score = candidate_score
          best_candidate = candidate_msgs
          best_candidate_frag = frag
          best_candidate_new = new_count
          best_candidate_desc = "iter=#{iter + 1} target=#{target_idx} pos=#{pos} crib=#{crib.inspect}"
        end
      end
    end
  end

  improvement = best_candidate_score - best_score
  break if best_candidate.nil? || improvement < MIN_SCORE_IMPROVEMENT

  # Accept best candidate
  partial_key = merge_key(partial_key, best_candidate_frag)
  best_score = best_candidate_score
  best_messages = best_candidate

  known = partial_key.count { |k| !k.nil? }
  puts "ACCEPT: #{best_candidate_desc}"
  puts "  improvement: +#{improvement.round(2)} | key known: #{known}/#{max_len} (+#{best_candidate_new})"

  if PRINT_EVERY_ITER
    puts "  Partial decrypt:"
    best_messages.each_with_index do |m, i|
      puts format("  %2d: %s", i, m)
    end
  end

  puts
end

puts "Done."
known = partial_key.count { |k| !k.nil? }
puts "Final score: #{best_score.round(2)}"
puts "Key known: #{known}/#{max_len}"
puts
puts "Final partial decrypt:"
best_messages.each_with_index do |m, i|
  puts format("%2d: %s", i, m)
end
