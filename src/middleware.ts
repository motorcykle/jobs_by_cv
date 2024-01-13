// import { withAuth } from "next-auth/middleware"

// export default withAuth({
//   callbacks: {
//     authorized: ({ req }) => {
//       const sessionToken = req.cookies.get("next-auth.session-token");
//       if (sessionToken) return true;
//       else return false;
//     },
//   },
// });

// export const config = { matcher: ["/listings", "/listings/:path*"] }

export { default } from "next-auth/middleware"

export const config = { matcher: ["/listings"] }