 // error handling middleware 
  // export const errorHandler = (err, req, res, next) => {  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
  //    res.status(statusCode); 
  //     res.json({
  //         message: err.message,
  //           stack: process.env.NODE_ENV === "production" ? null : err.stack, 
  //            });
  //              }; 


//   export const errorHandler = (err, req, res, next) => {
//     const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500; 
//     res.status(statusCode);

//     res.json({
//         success: false, 
//         message: err.message || "Something went wrong",
//         stack: process.env.NODE_ENV === "production" ? null : err.stack, 
//     });
// };


const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Default to 500 if no status code is set
    res.status(statusCode).json({
      message: err.message || "Something went wrong",
      stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack in production
    });
  };
  
  export { errorHandler };
  