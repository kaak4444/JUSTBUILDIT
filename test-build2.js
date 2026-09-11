try {
  require('./dist/server.cjs');
  console.log("Success");
} catch(e) {
  console.log("Fail:", e);
}
