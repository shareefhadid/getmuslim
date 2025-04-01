export default eventHandler(async (event) => {
  const { pathname } = getRouterParams(event);

  return hubBlob().serve(event, `images/${pathname}`);
});
