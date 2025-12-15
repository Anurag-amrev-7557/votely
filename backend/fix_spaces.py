import re

file_path = '/Users/anuragverma/Documents/votely/frontend/src/components/admin/AdminLogin.jsx'

with open(file_path, 'r') as f:
    content = f.read()

# Replace " - " with "-" inside likely class names or style strings
# We'll apply this globally as " - " is rarely correct in this specific file's context based on valid code patterns
# Exceptions: " - " in comments or specific text might be affected, but unlikely to break code.
# The corruption seems to be "word - word".
# We will use a regex that looks for alphanumeric characters around " - ".

# Fix: "text - gray" -> "text-gray"
new_content = re.sub(r'([a-zA-Z0-9%]) - ([a-zA-Z0-9])', r'\1-\2', content)

# Also fix "w - full" -> "w-full" (sometimes space might be only on one side?)
# The diff showed "h - 3".
# Let's try aggressive " - " -> "-" replacement but only where it looks like a token.

# Using a more robust approach: Find className strings and fix inside them?
# Too complex to parse JSX. Global replace is safer if verified.
# Checked patterns: "text - xs", "bg - white", "duration - 500", "width: ...% "

# Check for " - " occurrences
print(f"Occurrences of ' - ' before: {content.count(' - ')}")

new_content = re.sub(r'([a-zA-Z0-9]) - ([a-zA-Z0-9])', r'\1-\2', content)

# Also fix cases like "h - 3" or "% - 8px"
new_content = re.sub(r'([a-zA-Z0-9%]) - ([a-zA-Z0-9])', r'\1-\2', new_content)

print(f"Occurrences of ' - ' after: {new_content.count(' - ')}")

with open(file_path, 'w') as f:
    f.write(new_content)

print("Fixed spaces in AdminLogin.jsx")
