# Input format:
#   Line 1: 100 pad numbers separated by new lines
#   Lines 2+: plaintext messages (one per line), using only A-Z, space, and period

require_relative "otp"

pad = load_pad("pad.txt")
plain = File.readlines("plain.txt").map(&:chomp).reject(&:empty?)

plain.each do |msg|
  validate_message!(msg, "plaintext")
  puts encrypt_message(msg, pad)
  puts
end
