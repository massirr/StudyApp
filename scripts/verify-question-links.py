#!/usr/bin/env python3
"""Does each question's linked chapter actually contain the material it teaches?

For every question, pull the distinctive content words out of the prompt and the
correct answer, then require at least one of them to appear as a WHOLE WORD in
the linked markdown. Substring matching is useless here — 'schillen' matches
'verschillen'.
"""
import json, pathlib, re, unicodedata

ROOT = pathlib.Path(".")
d = json.loads((ROOT / "src/data/subjects/yb1398.json").read_text(encoding="utf-8"))
tt = {t["id"]: t["title"] for t in d["topics"]}

URL2FILE = {}
for q in d["questions"]:
    for u in q["sourceUrls"]:
        if "/cursus-nl3/" in u:
            URL2FILE[u] = ROOT / "content/dutch/cursus-nl3" / u.rsplit("/", 1)[1]
        elif u.endswith("retake-2025-2026.md"):
            URL2FILE[u] = ROOT / "content/dutch/retake-2025-2026.md"

CACHE = {}
def words_of(path):
    if path not in CACHE:
        txt = path.read_text(encoding="utf-8").lower()
        txt = unicodedata.normalize("NFKD", txt)
        CACHE[path] = set(re.findall(r"[a-z]+", txt))
    return CACHE[path]

# Words that say nothing about WHERE the content lives.
STOP = set("""de het een en of maar want dus die dat wat wie hoe waar wanneer is zijn was waren
ben bent heb hebt heeft had hadden word wordt werd ik jij je hij zij ze wij we jullie u mijn
jouw zijn haar ons hun in op aan met van voor na bij te om als toen dan daarna eerst ook niet
geen wel al nog meer minder veel weinig goed juist juiste welke welk vul aan zin zinnen woord
woorden vorm vormen kies maak schrijf zet lees antwoord vraag vragen voorbeeld bijvoorbeeld
mondeling schriftelijk oefening hoofdstuk deze dit die dat er te uit over tot door tussen
naar per zoals ja nee wel niets iets iemand men je''s""".split())
JARGON = set("""imperfectum bijzin hoofdzin inversie prepositie werkwoord werkwoorden onderwerp
persoonsvorm participium infinitief substantief adjectief voegwoord onderschikkend
nevenschikkend relatief pronomen conjunctie verbum stam imperatief structuurwoord
structuurwoorden tijdswoord verleden tijd gewone volgorde constructie vaste""".split())

def terms(q):
    src = q["prompt"]
    if q["type"] in ("single", "multiple"):
        src += " " + " ".join(o["label"] for o in q["options"] if o["id"] in q["correctOptionIds"])
    src += " " + " ".join(q.get("acceptedAnswers") or [])
    if q.get("sampleAnswer"):
        src += " " + q["sampleAnswer"]
    ws = re.findall(r"[a-zA-Zà-ÿ]+", unicodedata.normalize("NFKD", src).lower())
    return {w for w in ws if len(w) > 3 and w not in STOP and w not in JARGON}

missing, ok = [], 0
for q in d["questions"]:
    ts = terms(q)
    hit = None
    for u in q["sourceUrls"]:
        f = URL2FILE.get(u)
        if f and f.exists() and (ts & words_of(f)):
            hit = u
            break
    if hit:
        ok += 1
    else:
        missing.append((q, ts))

print(f"{ok}/{len(d['questions'])} questions have supporting words in a linked file")
print(f"{len(missing)} do NOT:\n")
for q, ts in missing:
    files = [URL2FILE[u].name for u in q["sourceUrls"] if u in URL2FILE]
    print(f"  {q['id']:6} [{tt[q['topicId']][:22]:24}] -> {', '.join(files)}")
    print(f"         {q['prompt'][:88]}")
    print(f"         terms: {sorted(list(ts))[:9]}")
