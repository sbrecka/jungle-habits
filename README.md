# Grind — od nuly k milionu

Izometrická pixel-art hra, ve které tvoje kopie sedí u počítače. Vydělává jen
tím, co reálně odpracuješ ty: zapíšeš si úkoly, odškrtneš je, a z těch peněz
platíš jídlo a nájem. Co zbyde, jde do vybavení, nábytku a lepšího bydlení —
od sklepního kutlochu až po vilu u moře.

Postaveno na Next.js 14 (App Router), zustand s ukládáním do `localStorage`
a vlastním pixel/izometrickém rendereru nad `<canvas>`.

## Jak se to hraje

- **Úkoly** (`Práce`) jsou tvoje skutečná práce. Malý / střední / velký úkol
  platí různě. Výplata se násobí kariérní úrovní, vybavením a energií.
- **Zakázky** mají termín a velkou odměnu. Každý hotový úkol na ní odvede 1–3
  díly. Nedodržený termín stojí reputaci, reputace odemyká větší zakázky.
- **Návyky** (`Návyky`) nedávají peníze přímo — dávají energii, a ta násobí
  každou výplatu. Vyčerpaný člověk vydělá zlomek toho, co odpočatý.
- **Jídlo a nájem** se platí samy, v čase. Nájem každých 7 dní.
- **Tvrdá pravidla:** dva dny po splatnosti nájmu následuje vystěhování o
  úroveň níž a přijdeš o věci, které se do menšího nevejdou. Tři dny bez jídla
  a musíš něco prodat, abys měl co jíst.
- **Cíl:** čistý majetek jeden milion.

Dny se dopočítávají i když je appka zavřená — po návratu dostaneš přehled, co
se mezitím stalo. Delší absence je zastropovaná: nikdy nepřijdeš o víc než
jedno vystěhování a tři věci.

## Vývoj

```bash
npm install
npm run dev
```

## Struktura

| Cesta | Co v tom je |
| --- | --- |
| `lib/store.ts` | Celý stav a pravidla hry včetně dopočítávání dnů |
| `lib/constants.ts` | Ekonomika — ceny, výplaty, bydlení, katalog obchodu |
| `lib/pixel.ts` | Pixel-art engine: sprity jako mřížka znaků + paleta |
| `lib/iso.ts` | Izometrické primitivy (dlaždice, kvádry, stěny) |
| `lib/isoSprites.ts` | Sprity postavy, obrazovek a věcí na zdech |
| `lib/isoScene.ts` | Skládání pokoje — paleta a rozvržení podle úrovně bydlení |
| `components/` | UI: pokoj, horní lišta, obrazovky práce / návyků / obchodu / bydlení |

Postup se ukládá lokálně v prohlížeči pod klíčem `grind-v1`. `Bydlení →
Začít znovu od nuly` ho smaže.
