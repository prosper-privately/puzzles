# Input format:
#   Line 1+: pad numbers, one per line (pad.txt)
#   Lines 1+: ciphertext messages (cipher.txt), one per line,
#             using only A-Z, space, and period

require_relative "otp"

pad = load_pad("pad.txt")
cipher = File.readlines("../cipher.txt").map(&:chomp).reject(&:empty?)

cipher.each do |msg|
  validate_message!(msg, "ciphertext")
  puts decrypt_message(msg, pad)
  puts
end
