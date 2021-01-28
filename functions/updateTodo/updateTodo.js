const faunadb = require("faunadb"),
  q = faunadb.query;
const dotenv = require("dotenv");

dotenv.config();
exports.handler = async (event, context) => {
  try {
    if (process.env.FAUNADB_ADMIN_SECRET) {
      const client = new faunadb.Client({
        secret: process.env.FAUNADB_ADMIN_SECRET,
      });

      const data = JSON.parse(event.body);
      console.log(data);
      const result = await client.query(
        q.Update(q.Ref(q.Collection("todo"), data.id), {
          data: { title: data.title },
        })
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
