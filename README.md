# Game Corner

Fourteen simple browser games for kids. They work on computers, tablets and phones, and need nothing to install.

| Page | Game |
|---|---|
| `index.html` | Menu page |
| `sudoku.html` | Little Sudoku: 4×4, 6×6 and 9×9 puzzles with a timer and Top 10 for each size |
| `snakes-ladders.html` | Snakes & Ladders: play vs the computer or 2 players on one device |
| `quiz-quest.html` | Quiz Quest: 25 levels, 250 general knowledge questions for about age 8 |
| `memory-match.html` | Memory Match: find the pairs, 3 sizes, Top 10 by fewest moves |
| `word-search.html` | Word Search: 5 topics, 3 difficulty levels |
| `atlas.html` | Atlas for Kids: place-name chain game (1,691 places in `atlas-data.js` and `atlas-data-more.js`), typing or voice, vs computer or 2 players |
| `colour-by-number.html` | Colour by Number: 18 pixel pictures |
| `colouring.html` | Colouring Book: 25 drawings, crayon that stays inside the lines, or tap to fill |
| `maths-race.html` | Maths Race: 60-second sums for + − × ÷, Top 10 |
| `spelling-bee.html` | Spelling Bee: 8 levels of read-aloud spelling |
| `typing-hero.html` | Typing Hero: falling-letter typing practice, Top 10 |
| `balloon-words.html` | Balloon Words: kid-friendly letter-guessing game |
| `tic-tac-toe.html` | Tic-Tac-Toe: vs computer (3 levels) or 2 players |
| `connect-four.html` | Connect Four: vs computer (3 levels) or 2 players |

The original three games are single self-contained HTML files. The newer games share `common.css` and `common.js` for styles, sounds and Top 10 boards.

## Hosting

The site is served with GitHub Pages from the `main` branch root.

## Saved scores

Scores, stars and Top 10 times are kept in the browser's `localStorage` on each device. Nothing is sent to a server.

## Publishing updates

GitHub Pages lets browsers keep pages for up to 10 minutes. So that players get changes right away, every page checks `version.json` when it opens and reloads itself once if a newer version is out.

Before each commit, run:

```
python3 tools/stamp.py
```

This writes a new version number into `version.json` and every page.

## Visit counter

The menu shows the total number of visits from everyone, using [GoatCounter](https://www.goatcounter.com) (free, cookie-free, no personal data). Put the GoatCounter site code in `tools/site.json` and run `python3 tools/stamp.py`. In GoatCounter's settings, "Allow adding visitor counts on your website" must be ticked.
