/**
 * LegalModal — Reusable modal for Privacy Policy and Terms of Sale.
 * Uses React state for open/close. Content from site.json data layer.
 * z-index: 11000
 */
import { useState, useEffect, useCallback } from 'react';
import { Z_INDEX } from '../../lib/constants';
import siteData from '../../data/site.json';

interface Props {
  type: 'privacy' | 'terms';
}

export default function LegalModal({ type }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Register global open/close so Astro components can trigger modals
  useEffect(() => {
    const w = window as any;
    if (type === 'privacy') {
      w.openPrivacy = open;
      w.closePrivacy = close;
    } else {
      w.openTerms = open;
      w.closeTerms = close;
    }
    return () => {
      if (type === 'privacy') {
        delete w.openPrivacy;
        delete w.closePrivacy;
      } else {
        delete w.openTerms;
        delete w.closeTerms;
      }
    };
  }, [type, open, close]);

  // Manage Lenis + native scroll lock
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === `${type}-modal`) {
      close();
    }
  };

  const meta = type === 'privacy' ? siteData.legal.privacy : siteData.legal.terms;

  return (
    <div
      id={`${type}-modal`}
      className="fixed inset-0 bg-at-stone/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 transition-opacity duration-500"
      style={{
        zIndex: Z_INDEX.LEGAL_MODAL,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
      onClick={handleBackdropClick}
    >
      <button
        onClick={close}
        className="absolute top-8 right-8 text-2xl text-at-graphite hover:opacity-50 z-50 bg-transparent border-none"
      >
        &times;
      </button>
      <div
        data-lenis-prevent
        className="bg-at-surface max-w-4xl w-full h-full max-h-[80vh] overflow-y-auto p-8 md:p-16 shadow-2xl rounded-sm border border-at-border relative"
      >
        <div className="max-w-3xl mx-auto text-at-graphite">
          <h2 className="text-4xl font-light mb-2">{meta.title}</h2>
          <h3 className="font-serif italic text-xl text-at-text-muted mb-8">{meta.subtitle}</h3>
          <p className="text-sm mb-8 leading-relaxed">
            <strong>Ultimo aggiornamento: {meta.lastUpdate}</strong>
          </p>

          {type === 'privacy' ? <PrivacyContent /> : <TermsContent />}

          <div className="text-center pt-8 border-t border-at-border">
            <button
              onClick={close}
              className="px-8 py-3 bg-at-graphite text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition"
            >
              {type === 'privacy' ? 'Chiudi Informativa' : 'Chiudi Condizioni'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyContent() {
  return (
    <>
      <p className="mb-8 leading-relaxed text-sm">
        Ai sensi dell'art. 13 del Regolamento (UE) 2016/679 ("GDPR") e della Legge Federale sulla Protezione dei Dati ("LPD") svizzera.
      </p>
      <p className="mb-8 leading-relaxed">
        Benvenuto su Aether. La presente informativa descrive le modalità di gestione del sito web in riferimento al trattamento dei dati personali degli utenti.
      </p>
      <h4 className="font-bold uppercase tracking-widest text-xs mb-4 mt-8">1. I Contitolari del Trattamento</h4>
      <p className="mb-4 text-sm leading-relaxed">Il progetto Aether nasce da una collaborazione internazionale. Il trattamento dei dati personali è gestito in regime di Contitolarità tra:</p>
      <ul className="list-none space-y-4 mb-8 text-sm">
        <li className="pl-4 border-l-2 border-at-oak"><strong>AT Studio di Mauro Toncelli (Ideazione, Web & UX)</strong><br />Sede legale: Rue En Segni 10, 2016 Cortaillod (NE), Svizzera.</li>
        <li className="pl-4 border-l-2 border-at-oak"><strong>Segnobianco S.r.l. (Produzione & Manifattura)</strong><br />Sede legale: Via I Maggio 10, Peccioli (PI), Italia.</li>
      </ul>
      <p className="mb-8 text-sm">Per comunicazioni privacy: <a href="mailto:hello@aura-design.it" className="underline">hello@aura-design.it</a></p>
      <h4 className="font-bold uppercase tracking-widest text-xs mb-4">2. Tipologia di Dati Raccolti</h4>
      <p className="mb-8 text-sm leading-relaxed">Dati di navigazione, dati forniti volontariamente, cookie e tracciamento (Google Analytics 4 con IP anonimizzato).</p>
      <h4 className="font-bold uppercase tracking-widest text-xs mb-4">3. Diritti dell'Interessato</h4>
      <p className="mb-8 text-sm">Accesso, rettifica, cancellazione, revoca consenso, opposizione, portabilità. Per esercitare i diritti: <a href="mailto:hello@aura-design.it" className="underline">hello@aura-design.it</a></p>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <p className="text-sm mb-8 leading-relaxed">
        Le presenti Condizioni Generali di Vendita disciplinano l'acquisto dei prodotti a marchio "Aether", realizzati su misura da Segnobianco S.r.l.
      </p>
      <h4 className="font-bold uppercase tracking-widest text-xs mb-4 mt-8">1. Oggetto del Contratto</h4>
      <p className="mb-4 text-sm leading-relaxed">Il contratto ha per oggetto la compravendita di tavoli in legno massello e vetro con integrazione tecnologica, realizzati su specifiche indicazioni del Cliente (modello, dimensioni, essenza, finitura, incisioni).</p>
      <h4 className="font-bold uppercase tracking-widest text-xs mb-4">2. Ordine e Accettazione</h4>
      <p className="mb-4 text-sm leading-relaxed">L'ordine si intende accettato solo dopo la conferma scritta da parte di Aether e il ricevimento dell'acconto. La produzione è strettamente artigianale e on-demand; non manteniamo scorte di prodotti finiti.</p>
      <h4 className="font-bold uppercase tracking-widest text-xs mb-4">3. Natura dei Beni ed Esclusione del Diritto di Recesso</h4>
      <p className="mb-8 text-sm leading-relaxed bg-at-stone p-4 border border-at-border">
        <strong>IMPORTANTE:</strong> I prodotti Aether sono beni confezionati su misura e chiaramente personalizzati. Ai sensi dell'<strong>art. 59, lettera c) del Codice del Consumo</strong> (D.Lgs. 206/2005), il diritto di recesso è <strong>ESCLUSO</strong>. Una volta confermato l'ordine e avviata la produzione (selezione della lastra), non è possibile annullare l'ordine né richiedere il rimborso dell'acconto.
      </p>
      <h4 className="font-bold uppercase tracking-widest text-xs mb-4">4. Prezzi e Pagamenti</h4>
      <ul className="list-disc pl-5 space-y-2 mb-8 text-sm marker:text-at-oak">
        <li><strong>Acconto:</strong> È richiesto un versamento del 50% del totale alla conferma dell'ordine per bloccare la materia prima.</li>
        <li><strong>Saldo:</strong> Il restante 50% deve essere saldato prima della spedizione, al termine della produzione (circa 6-8 settimane).</li>
        <li><strong>Metodi:</strong> Accettiamo Bonifico Bancario, Carte di Credito (Stripe/PayPal).</li>
      </ul>
      <h4 className="font-bold uppercase tracking-widest text-xs mb-4">5. Spedizione e Consegna "White Glove"</h4>
      <p className="mb-4 text-sm leading-relaxed">
        La spedizione include il servizio di consegna al piano, montaggio e ritiro degli imballaggi. I tempi di consegna indicati sono stimati e possono subire variazioni dovute alla complessità della lavorazione artigianale o a cause di forza maggiore.
      </p>
      <h4 className="font-bold uppercase tracking-widest text-xs mb-4">6. Garanzia Legale e Convenzionale</h4>
      <p className="mb-4 text-sm leading-relaxed">Tutti i prodotti sono coperti da garanzia per difetti di conformità:</p>
      <ul className="list-disc pl-5 space-y-2 mb-8 text-sm marker:text-at-oak">
        <li><strong>Parti Strutturali (Legno/Vetro):</strong> 5 anni dalla data di consegna.</li>
        <li><strong>Componenti Elettronici (LED/Controller):</strong> 2 anni dalla data di consegna.</li>
      </ul>
      <p className="mb-8 text-sm">La garanzia non copre danni accidentali, usura naturale del legno o danni causati da un uso improprio.</p>
      <h4 className="font-bold uppercase tracking-widest text-xs mb-4">7. Legge Applicabile</h4>
      <p className="mb-8 text-sm leading-relaxed">
        Il contratto di vendita è regolato dalla Legge Italiana. Per qualsiasi controversia sarà competente in via esclusiva il Foro di Pisa (Italia), luogo di produzione del bene.
      </p>
    </>
  );
}
