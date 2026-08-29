import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { z } from "zod";

// Input validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long"),
  captchaToken: z.string().optional(),
});

type LoginInput = z.infer<typeof loginSchema>;

// In-memory rate limiting store (resets on cold start — acceptable for serverless)
const attempts = new Map<
  string,
  { count: number; firstAttempt: number; lockedUntil: number }
>();
const emailAttempts = new Map<
  string,
  { count: number; firstAttempt: number; lockedUntil: number }
>();

const MAX_ATTEMPTS = 5;
const EMAIL_MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minute lockout after max failures

function getClientIP(headersList: Headers): string {
  return (
    headersList.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, record] of attempts.entries()) {
    if (now - record.firstAttempt > WINDOW_MS && now > record.lockedUntil) {
      attempts.delete(key);
    }
  }
  for (const [email, record] of emailAttempts.entries()) {
    if (now - record.firstAttempt > WINDOW_MS && now > record.lockedUntil) {
      emailAttempts.delete(email);
    }
  }
}

export async function POST(request: Request) {
  // Periodic cleanup
  cleanupOldEntries();

  const headersList = await headers();
  const ip = getClientIP(headersList);

  // Check if IP is locked out
  const record = attempts.get(ip);
  if (record) {
    const now = Date.now();

    if (now < record.lockedUntil) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          error: "Too many failed attempts. Try again later.",
          locked: true,
          remainingSeconds,
        },
        { status: 429 }
      );
    }

    // Reset if window has passed
    if (now - record.firstAttempt > WINDOW_MS && now > record.lockedUntil) {
      attempts.delete(ip);
    }
  }

  // Parse and validate request body
  let validatedData: LoginInput;

  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.errors.map(e => e.message).join(", ");
      return NextResponse.json(
        { error: `Validation failed: ${errors}` },
        { status: 400 }
      );
    }

    validatedData = result.data;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { email, password, captchaToken } = validatedData;
  const normalizedEmail = email.toLowerCase();

  // Check if email is locked out (per-account protection)
  const emailRecord = emailAttempts.get(normalizedEmail);
  if (emailRecord) {
    const now = Date.now();

    if (now < emailRecord.lockedUntil) {
      const remainingSeconds = Math.ceil((emailRecord.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          error: "Too many failed attempts. Try again later.",
          locked: true,
          remainingSeconds,
        },
        { status: 429 }
      );
    }

    if (now - emailRecord.firstAttempt > WINDOW_MS && now > emailRecord.lockedUntil) {
      emailAttempts.delete(normalizedEmail);
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Service unavailable." },
      { status: 503 }
    );
  }

  // Prepare response so the SSR client can attach session cookies.
  const response = NextResponse.json({ success: true });
  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  });

  // Attempt login
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      captchaToken,
    },
  });

  if (authError) {
    // Record failed attempt (per-IP and per-email)
    const existing = attempts.get(ip);
    const now = Date.now();

    if (existing) {
      existing.count += 1;
      if (existing.count >= MAX_ATTEMPTS) {
        existing.lockedUntil = now + LOCKOUT_MS;
      }
    } else {
      attempts.set(ip, {
        count: 1,
        firstAttempt: now,
        lockedUntil: 0,
      });
    }

    const emailExisting = emailAttempts.get(normalizedEmail);
    if (emailExisting) {
      emailExisting.count += 1;
      if (emailExisting.count >= EMAIL_MAX_ATTEMPTS) {
        emailExisting.lockedUntil = now + LOCKOUT_MS;
      }
    } else {
      emailAttempts.set(normalizedEmail, {
        count: 1,
        firstAttempt: now,
        lockedUntil: 0,
      });
    }

    const currentCount = attempts.get(ip)!.count;
    const emailCount = emailAttempts.get(normalizedEmail)!.count;
    const remaining = Math.min(
      MAX_ATTEMPTS - currentCount,
      EMAIL_MAX_ATTEMPTS - emailCount,
    );

    if (remaining <= 0) {
      return NextResponse.json(
        {
          error: "Too many failed attempts. Access locked for 30 minutes.",
          locked: true,
          remainingSeconds: LOCKOUT_MS / 1000,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Invalid credentials.",
        attemptsLeft: remaining,
      },
      { status: 401 }
    );
  }

  // Success — clear attempts for this IP and email
  attempts.delete(ip);
  emailAttempts.delete(normalizedEmail);

  return response;
}
