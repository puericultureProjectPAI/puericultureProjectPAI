-- PUE-262 : Adaptation du modèle de données pour le signalement d'un échange

-- Colonne pour mémoriser le statut avant gel de l'échange
ALTER TABLE public.exchanges
    ADD COLUMN IF NOT EXISTS status_before_block VARCHAR(50);

-- Table principale des signalements
CREATE TABLE IF NOT EXISTS public.exchange_reports (
    id                 BIGSERIAL    PRIMARY KEY,
    exchange_id        BIGINT       NOT NULL REFERENCES public.exchanges(id) ON DELETE CASCADE,
    reported_by_id     UUID         NOT NULL REFERENCES public.persons(id),
    type               VARCHAR(50)  NOT NULL,
    description        TEXT         NOT NULL,
    status             VARCHAR(20)  NOT NULL DEFAULT 'OPEN',
    moderation_comment TEXT,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index pour les requêtes fréquentes sur exchange_reports
CREATE INDEX IF NOT EXISTS idx_exchange_reports_exchange_id
    ON public.exchange_reports (exchange_id);

CREATE INDEX IF NOT EXISTS idx_exchange_reports_status_created_at
    ON public.exchange_reports (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_exchange_reports_reported_by_id
    ON public.exchange_reports (reported_by_id);

-- Table des URLs de pièces jointes (ElementCollection JPA)
CREATE TABLE IF NOT EXISTS public.exchange_report_attachment_urls (
    exchange_report_id BIGINT NOT NULL
        REFERENCES public.exchange_reports(id) ON DELETE CASCADE,
    attachment_url     TEXT   NOT NULL,
    PRIMARY KEY (exchange_report_id, attachment_url)
);
