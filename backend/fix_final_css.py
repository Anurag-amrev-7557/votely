import re

file_path = '/Users/anuragverma/Documents/votely/frontend/src/components/admin/AdminLogin.jsx'

with open(file_path, 'r') as f:
    content = f.read()

# Fix 1: Remove space before % in template literals
# Pattern: "} %" -> "}%"
content = content.replace('} %', '}%')

# Fix 2: Restore space before -translate (Tailwind negative margins/transforms)
# Specifically "top-1/2-translate" -> "top-1/2 -translate"
# Regex: "([0-9])-translate" -> "\1 -translate"
content = re.sub(r'([0-9])-translate', r'\1 -translate', content)

# Check for other negative classes like -mt, -ml?
# "1/2-mt" -> "1/2 -mt"
# List of common negative classes: translate, mt, mb, ml, mr, mx, my, top, left, right, bottom, inset
negative_prefixes = ['translate', 'mt', 'mb', 'ml', 'mr', 'mx', 'my', 'top', 'bottom', 'left', 'right', 'inset']
for prefix in negative_prefixes:
    # Look for [digit/letter]-[prefix] where meant to be space?
    # Actually, "h-3" is valid. "item-center" is valid.
    # The issue is "top-1/2" ends in digit, and "-translate" starts with hyphen.
    # My previous script merged "digit -letter".
    # So we look for "digit-prefix" where prefix is in the list AND it's likely a separate class.
    # But "items-center" matches "s-center". "s" is letter.
    # "top-1/2-translate" -> "2" is digit.
    # It's safer to just fix the specific broken valid classes if we can identify them.
    # For now, just fix "-translate" as identified.
    pass

# Also check for "-rotate", "-skew", "-scale"
content = re.sub(r'([0-9])-rotate', r'\1 -rotate', content)

with open(file_path, 'w') as f:
    f.write(content)

print("Final CSS fixes applied to AdminLogin.jsx")
