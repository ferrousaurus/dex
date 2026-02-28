export const getHealth = () =>
  new Response(JSON.stringify({ status: "ok" }), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
