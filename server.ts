import app from './app';

app.set('port', process.env.PORT || 3000);

let server = app.listen(app.get('port'), () => {
  // @ts-ignore
  console.log('Express server listening on port ' + server.address().port);
});
