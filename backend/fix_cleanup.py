import re

file_path = '/Users/anuragverma/Documents/votely/frontend/src/components/admin/AdminLogin.jsx'

with open(file_path, 'r') as f:
    content = f.read()

# Fix "calc(... %-8px)" -> "calc(... % - 8px)"
# We look for "calc" and ensure spaces around operators if missing.
# Specifically fixing the case created by previous script: "%-8" -> "% - 8"
# But actually, valid CSS is "calc(100% - 8px)".
# Let's just target the specific calc strings we see in the file.
# "%-8px" -> "% - 8px"
content = re.sub(r'%([0-9]+)px', r'% - \1px', content) # risky?
# Better: re.sub(r'%\-([0-9])', r'% - \1', content)
content = re.sub(r'%([+-])([0-9])', r'% \1 \2', content) # Fix %-8 to % - 8

# Fix "animate-fade -in" -> "animate-fade-in"
# Pattern: word<space>-word -> word-word
content = re.sub(r'([a-zA-Z0-9]) -([a-zA-Z0-9])', r'\1-\2', content)

# Fix any remaining " - " (double space) if missed
content = re.sub(r' - ', '-', content)

# Fix specific known issues from view
content = content.replace('animate-fade -in', 'animate-fade-in')
content = content.replace('h -3', 'h-3') 
content = content.replace('w -full', 'w-full')

# Fix "calc" again to be sure
# Restore "calc(100% - 8px)"
# If it currently is "calc(100% - 8px)" (fixed above) or "calc(100%-8px)"
# Pattern: "%-[0-9]"
content = re.sub(r'%([-])([0-9])', r'% \1 \2', content)

# Manually fix the specific line seen: style={{ left: `calc(${securityScore} %-8px)` }}
# It was likely: `calc(${securityScore}% - 8px)`
# ensure space between } and %? No, ${score}% is fine.
# ensure space between % and -
content = content.replace('%-8px', '% - 8px')

with open(file_path, 'w') as f:
    f.write(content)

print("Refined spaces in AdminLogin.jsx")
