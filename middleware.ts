import NextAuth from "next-auth";

const { auth } = NextAuth({
  providers: [],
  pages: { signIn: "/login" },
});

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
