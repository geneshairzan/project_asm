deploy :

1. npm i
2. delete all file inside /prisma/migration
3. set `DATABASE_URL` inside .env.developtment with template `mysql://[username]:[password]@[path:port]/[db_name]`
4. seed data with `node ./prisma/seed.js `
5. run dev with : `npm run devs`

TODO

1.  form :input date, number, img, file, img crop,others (html / text editor),
2.  facade auth or any other method to direct access auth bearer
3.  FE midleware ✅
4.  dynamic menu ✅
5.  model organization
6.  share
7.  backup restore
8.  primas optimazion
9.  use meta
    [] use meta
