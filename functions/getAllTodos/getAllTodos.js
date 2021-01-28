const faunadb = require("faunadb"),
  q = faunadb.query;
const dotenv = require("dotenv");

dotenv.config();
exports.handler = async (event, context) => {
  if (event.httpMethod !== "GET")
    return { statusCode: 405, body: "Method not allowed" };
  try {
    if (process.env.FAUNADB_ADMIN_SECRET) {
      const client = new faunadb.Client({
        secret: process.env.FAUNADB_ADMIN_SECRET,
      });
      const result = await client.query(
        q.Map(
          q.Paginate(q.Match(q.Index("todo_list"))),
          q.Lambda((x) => q.Get(x))
        )
      );

      console.log(result);

      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    }
  } catch (error) {
    console.log(error.message);
    // return { statusCode: 400, body: error.toString() };
  }
};
