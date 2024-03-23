// export const yourController = async (req, res) => {
//   const { body } = req;

//   var perPage = body.limit;
//   var page = Math.max(0, body.page);

//   yourModel
//     .find() // You Can Add Your Filters inside
//     .limit(perPage)
//     .skip(perPage * (page - 1))
//     .exec(function (err, dbRes) {
//       yourModel.count().exec(function (err, count) {
//         // You Can Add Your Filters inside
//         res.send(
//           JSON.stringify({
//             Articles: dbRes,
//             page: page,
//             pages: count / perPage,
//           })
//         );
//       });
//     });
// };
