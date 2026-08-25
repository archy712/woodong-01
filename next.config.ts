import type { NextConfig } from "next";

/**
 * 비공개 버킷의 서명 URL만 `next/image`에 허용한다(Task 004).
 *
 * ⚠️ `new URL(...)` 인스턴스로 패턴을 주면 `search`가 빈 문자열로 굳어져 **쿼리스트링이 있는 URL이
 * 전부 매칭에서 탈락**한다. 서명 URL은 `?token=...`이 필수라 반드시 객체 형태로 지정해
 * `search`를 지정하지 않은(=아무 쿼리나 허용) 상태로 둬야 한다(Task 019에서 실제로 겪은 문제).
 */
function supabaseImagePattern() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return [];

  try {
    const { protocol, hostname, port } = new URL(url);
    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port,
        pathname: "/storage/v1/object/sign/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: supabaseImagePattern(),
  },
};

export default nextConfig;
