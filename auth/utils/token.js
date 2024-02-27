import jwt from "jsonwebtoken";
function generateToken(user) {
  return jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: "1h" });
}

export function sendToken(req, res, user, statusCode) {
  const token = generateToken(user);

  const options = {
    expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "None",
    secure: true
  };
  res.cookie("authToken", token, options).json({
    success: true,
    user,
  });
  // req.session.token = token;
  // // res.status(statusCode).send({...user , token: token});
}



// // Yes, the function `sendToken` you provided seems correct for storing the token in the session. It generates a token using the `generateToken` function, assigns it to `req.session.token`, and then sends the user data in the response along with the specified status code.

// // However, it's worth noting that storing the token in the session may not be the most common approach for token-based authentication in stateless RESTful APIs. Typically, tokens are sent to the client upon authentication, and the client stores the token (usually in localStorage or sessionStorage) and includes it in subsequent requests as a header (commonly `Authorization: Bearer <token>`). The server then verifies the token on each request instead of storing it in the session.

// // Storing tokens in sessions is more commonly used in server-rendered web applications or applications where sessions are already utilized for managing user state. If your application follows this pattern, then storing the token in the session as you've described is correct. However, if you're building a stateless API, you might want to consider other approaches for token management.
