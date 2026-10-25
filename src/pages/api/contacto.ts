import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const DESTINATARIO = 'francomsartori@gmail.com';
const MAX_LARGO = 2000;

export const POST: APIRoute = async ({ request }) => {
  let mensaje = '';
  try {
    const body = await request.json();
    mensaje = typeof body?.mensaje === 'string' ? body.mensaje.trim() : '';
  } catch {
    return new Response(JSON.stringify({ error: 'Cuerpo inválido' }), { status: 400 });
  }

  if (!mensaje || mensaje.length > MAX_LARGO) {
    return new Response(JSON.stringify({ error: 'Mensaje inválido' }), { status: 400 });
  }

  // On Cloudflare, secrets come from the runtime binding (set via
  // `.dev.vars` locally or the Pages dashboard in production); fall back to
  // a plain env var for `astro preview`/other runtimes.
  let apiKey: string | undefined;
  try {
    const { env } = await import('cloudflare:workers');
    apiKey = (env as Record<string, string>).RESEND_API_KEY;
  } catch {
    apiKey = import.meta.env.RESEND_API_KEY;
  }

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Servicio no configurado' }), { status: 500 });
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: 'Boliches Gchú <onboarding@resend.dev>',
      to: DESTINATARIO,
      replyTo: DESTINATARIO,
      subject: 'Corrección / dato nuevo — Boliches Gchú',
      text: mensaje,
    });
    if (error) {
      return new Response(JSON.stringify({ error: 'No se pudo enviar' }), { status: 502 });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'No se pudo enviar' }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
