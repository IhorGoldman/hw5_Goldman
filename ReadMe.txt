1. make our saveToFile() function asynchronous. add Promise to function,
add async - await to process.on -'SIGINT' in server.ts.

2. for fs.createWriteStream we need to use  finish() not end().

3. The 'r+' flag opens the file for reading and writing,
but does not create the file if it does not exist, and may
cause problems if the size of the new content is smaller than
the old one (the remaining bytes are not erased).
Better to use 'w' (write) — it overwrites the file and creates
it if it doesn't exist.

4. after ws.write(data) we need to call ws.end() -
end() ends the stream and calls finish.