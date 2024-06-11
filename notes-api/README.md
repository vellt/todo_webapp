# Notes API

[Click here for english version](./README-en.md)

## Leírás

Notes-API a Nyíregyházi Egyetem Webalkalmazás-fejlesztés tantárgy beadandójához szükséges szerver oldali alkalmazást tartalmazza.  
A feladat egy React alkalmazás elkészítése TypeScript segítségével, mely felhasználja ezen API szolgáltatásait.

## Követelmények
Legalább Node.JS 18  
yarn

## Telepítés

```bash
$ yarn install
```

Telepítés után hozz létre egy `.env` file-t a package.json mellé. Ez tartalmazza az alkalmazáshoz szükséges plusz konfigurációt. Tartalma:
```bash
API_PORT=5000
LANGUAGE=hu-HU
# sample value - override is highly suggested
JWT_TOKEN_SECRET=This1s@secr3tKey
```
A JWT_TOKEN_SECRET értéke szabadon változtatható, belépésnél van hatása. Az API_PORT a szerver indítási pontját befolyásolja.

## Az alkalmazás futtatása

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Swagger
Az API teljes dokumentációja megtalálható az indítást követően az `/api-doc` könyvtárban: http://localhost:5000/api-doc  