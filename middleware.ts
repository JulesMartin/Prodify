import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Gestion des sous-domaines personnalisés
  // Format attendu: {slug}.votredomaine.com
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost:3000';

  // Vérifier si c'est un sous-domaine
  if (hostname !== mainDomain && !hostname.startsWith('www.')) {
    // Extraire le slug du sous-domaine
    const subdomain = hostname.split('.')[0];

    // Si ce n'est pas une route système, rediriger vers /{slug}
    if (!url.pathname.startsWith('/_next') &&
        !url.pathname.startsWith('/api') &&
        !url.pathname.startsWith('/static')) {
      // Rewrite vers la route dynamique [slug]
      url.pathname = `/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protéger les routes /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Rediriger les utilisateurs connectés de /auth vers /dashboard
  if (request.nextUrl.pathname.startsWith('/auth') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
