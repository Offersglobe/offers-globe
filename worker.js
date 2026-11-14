
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Get all published offers
    if (url.pathname === "/api/offers" && request.method === "GET") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM offers ORDER BY id DESC"
        ).all();

        return Response.json(results);
      } catch (error) {
        return Response.json(
          { error: "Could not load offers" },
          { status: 500 }
        );
      }
    }

    // Add a new offer (admin only)
    if (url.pathname === "/api/offers" && request.method === "POST") {
      const auth = request.headers.get("Authorization");

      if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`) {
        return Response.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      try {
        const data = await request.json();

        const title = String(data.title || "").trim();
        const network = String(data.network || "").trim();
        const category = String(data.category || "").trim();
        const description = String(data.description || "").trim();
        const link = String(data.link || "").trim();
        const image_url = String(data.image_url || "").trim();

        if (!title || !description || !link) {
          return Response.json(
            { error: "Title, description and link are required" },
            { status: 400 }
          );
        }

        await env.DB.prepare(`
          INSERT INTO offers
          (title, network, category, description, link, image_url)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          title, network, category, description, link, image_url
        ).run();

        return Response.json({
          success: true,
          message: "Offer published successfully"
        });
      } catch (error) {
        return Response.json(
          { error: "Could not publish offer" },
          { status: 500 }
        );
      }
    }

    // Serve the website files
    return env.ASSETS.fetch(request);
  }
};
