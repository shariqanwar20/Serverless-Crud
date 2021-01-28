// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
var faunadb = require("faunadb");
var q = faunadb.query;

require("dotenv").config();

const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST")
      return { statusCode: 405, body: "Method not allowed" };

    if (process.env.FAUNADB_ADMIN_SECRET) {
      // console.log(event.httpMethod);
      const data = JSON.parse(event.body);

      var client = new faunadb.Client({
        secret: process.env.FAUNADB_ADMIN_SECRET,
      });
      const result = await client.query(
        q.Create(q.Collection("todo"), { data: { title: data.title } })
      );
      // console.log(result);
      return { statusCode: 200, body: JSON.stringify(result) };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
