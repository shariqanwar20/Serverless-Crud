const faunadb = require("faunadb"),
  q = faunadb.query;
const dotenv = require("dotenv");

dotenv.config();
exports.handler = async (event, context) => {
  try {
    if (process.env.FAUNADB_ADMIN_SECRET) {
      console.log(event.httpMethod);
      const client = new faunadb.Client({
        secret: process.env.FAUNADB_ADMIN_SECRET,
      });

      const data = JSON.parse(event.body);
      var result = await client.query(
        q.Delete(q.Ref(q.Collection("todo"), data.id))
      );

      console.log(result);

      return {
        statusCode: 200,
      };
    }
  } catch (error) {
    console.log(error.message);
    // return { statusCode: 400, body: error.toString() };
  }
};
