import { useEffect, useState, type FormEvent } from 'react';

type Estado = 'idle' | 'enviando' | 'ok' | 'error';

export default function ContactForm() {
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState<Estado>('idle');

  // Pre-fill the message when arriving from a specific boliche's detail page
  // (e.g. /reportar?boliche=Náutico+Social), set client-side only since this
  // is a static page and the query string isn't known at build time.
  useEffect(() => {
    const nombre = new URLSearchParams(window.location.search).get('boliche');
    if (nombre) {
      setMensaje(`Quiero reportar un dato acerca de "${nombre}"`);
    }
  }, []);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!mensaje.trim() || estado === 'enviando') return;

    setEstado('enviando');
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje }),
      });
      if (!res.ok) throw new Error('request failed');
      setEstado('ok');
      setMensaje('');
    } catch {
      setEstado('error');
    }
  }

  if (estado === 'ok') {
    return (
      <p className="text-sm text-emerald-700 dark:text-emerald-300">
        ¡Gracias! Ya lo recibimos y lo vamos a revisar.
      </p>
    );
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3">
      <label htmlFor="mensaje" className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Tu mensaje
      </label>
      <textarea
        id="mensaje"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder="Ej: El boliche X cerró en 2015, no en 2018… / Falta el bar Y en San Lorenzo 450, abrió en 2021."
        rows={6}
        maxLength={2000}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!mensaje.trim() || estado === 'enviando'}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {estado === 'enviando' ? 'Enviando…' : 'Enviar'}
        </button>
        {estado === 'error' && (
          <p className="text-xs text-rose-600 dark:text-rose-400">Hubo un error, probá de nuevo.</p>
        )}
      </div>
    </form>
  );
}
