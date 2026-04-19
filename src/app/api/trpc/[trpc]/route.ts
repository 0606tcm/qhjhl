const handler = () =>
  new Response(
    JSON.stringify({
      message: 'API disabled — running in client-side mock mode',
    }),
    {
      status: 410,
      headers: { 'Content-Type': 'application/json' },
    }
  );

export { handler as GET, handler as POST };
