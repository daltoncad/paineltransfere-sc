(function () {
    'use strict';

    const CONFIG = {
        uf: 'SC',
        period: '2021–2026',
        municipalityField: 'NM_MUN',
        execField: 'EmEXEC',
        desembField: 'mapa_situacoes_convenios_SC_2021_2026_VL_DESEMBOLSADO_EXEC',
        saldoField: 'mapa_situacoes_convenios_SC_2021_2026_VL_SALDO_EXEC',
        globalField: 'mapa_situacoes_convenios_SC_2021_2026_VL_GLOBAL_EXEC_FMT',
        repasseField: 'mapa_situacoes_convenios_SC_2021_2026_VL_REPASSE_EXEC_FMT',
        desembFmtField: 'mapa_situacoes_convenios_SC_2021_2026_VL_DESEMB_EXEC_FMT',
        saldoFmtField: 'mapa_situacoes_convenios_SC_2021_2026_VL_SALDO_EXEC_FMT',
        percSaldoField: 'mapa_situacoes_convenios_SC_2021_2026_PERC_SALDO_REP_FMT'
    };

    const SITUATIONS = [
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_EM_EXECUCAO', 'Em execução'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROP_PT_ENV_ANAL', 'Proposta/Plano de Trabalho Enviado para Análise'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROP_PT_REJEIT', 'Proposta/Plano de Trabalho Rejeitados'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROP_PT_REJEIT_POR_IMP_TEC', 'Proposta/Plano de Trabalho Rejeitados por Impedimento técnico'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROP_PT_CADASTRADOS', 'Proposta/Plano de Trabalho Cadastrados'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PC_CONCL', 'Prestação de Contas Concluída'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROP_PT_EM_COMPLEMENTACAO', 'Proposta/Plano de Trabalho em Complementação'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROP_PT_APROV', 'Proposta/Plano de Trabalho Aprovado'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROPOSTA_APROV_E_PT_EM_ANAL', 'Proposta Aprovada e Plano de Trabalho em Análise'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROP_PT_COMPL_ENV_ANAL', 'Proposta/Plano de Trabalho Complementado Enviado para Análise'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PC_ENV_ANAL', 'Prestação de Contas enviada para Análise'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROP_PT_APROV_2', 'Proposta/Plano de Trabalho Aprovados'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROP_PT_EM_ANAL', 'Proposta/Plano de Trabalho em Análise'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROP_PT_COMPL_EM_ANAL', 'Proposta/Plano de Trabalho Complementado em Análise'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PC_COMPROVADA_EM_ANAL', 'Prestação de Contas Comprovada em Análise'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PC_EM_ANAL', 'Prestação de Contas em Análise'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PC_APROV', 'Prestação de Contas Aprovada'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_CONVENIO_RESCINDIDO', 'Convênio Rescindido'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROPOSTA_APROV_E_PT_EM_COMPLEMENTACAO', 'Proposta Aprovada e Plano de Trabalho em Complementação'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_CONVENIO_ANULADO', 'Convênio Anulado'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_AGUARDANDO_PC', 'Aguardando Prestação de Contas'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PC_INICIADA_POR_ANTECIPACAO', 'Prestação de Contas Iniciada por Antecipação'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PC_EM_COMPLEMENTACAO', 'Prestação de Contas em Complementação'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_CANCELADO', 'Cancelado'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PC_APROV_COM_RESSALVAS', 'Prestação de Contas Aprovada com Ressalvas'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROPOSTA_APROV_E_PT_COMPL_ENV_ANAL', 'Proposta Aprovada e Plano de Trabalho Complementado Enviado para Análise'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROPOSTA_ELIMINADA_EM_CHAMAMENTO_PUBLICO', 'Proposta Eliminada em Chamamento Público'],
        ['mapa_situacoes_convenios_SC_2021_2026_SIT_PROPOSTA_APROV_E_PT_COMPL_EM_ANAL', 'Proposta Aprovada e Plano de Trabalho Complementado em Análise']
    ];

    function toNumber(value) {
        if (value === null || value === undefined || value === '') return 0;
        if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
        let text = String(value).trim();
        if (!text) return 0;
        if (/R\$/.test(text) || /,/.test(text)) {
            text = text.replace(/R\$/g, '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
        }
        const n = Number(text);
        return Number.isFinite(n) ? n : 0;
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2
        }).format(toNumber(value));
    }

    function formatInteger(value) {
        return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(toNumber(value));
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function cleanFormatted(value, numericFallback) {
        const text = value === null || value === undefined ? '' : String(value).trim();
        if (text) {
            return text.replace(/^R\$(?=\d)/, 'R$ ');
        }
        return formatCurrency(numericFallback || 0);
    }

    function getRawFeatures() {
        if (typeof json_SC_Municipios_WEBs_202608_0 !== 'undefined' && json_SC_Municipios_WEBs_202608_0.features) {
            return json_SC_Municipios_WEBs_202608_0.features;
        }
        return [];
    }

    function buildSummaryAndRanking() {
        const raw = getRawFeatures();
        let totalExec = 0;
        let totalDesemb = 0;
        let totalSaldo = 0;
        const ranking = [];

        raw.forEach(item => {
            const p = item.properties || {};
            const q = toNumber(p[CONFIG.execField]);
            totalExec += q;
            totalDesemb += toNumber(p[CONFIG.desembField]);
            totalSaldo += toNumber(p[CONFIG.saldoField]);
            ranking.push({ name: p[CONFIG.municipalityField] || 'Município', value: q });
        });

        document.getElementById('metric-exec').textContent = formatInteger(totalExec);
        document.getElementById('metric-municipios').textContent = formatInteger(raw.length);
        document.getElementById('metric-desembolsado').textContent = formatCurrency(totalDesemb);
        document.getElementById('metric-saldo').textContent = formatCurrency(totalSaldo);

        ranking.sort((a, b) => b.value - a.value || String(a.name).localeCompare(String(b.name), 'pt-BR'));
        const rankingEl = document.getElementById('ranking-list');
        rankingEl.innerHTML = ranking.slice(0, 8).map(item =>
            `<div class="ranking-item"><span class="ranking-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span><span class="ranking-value">${formatInteger(item.value)}</span></div>`
        ).join('');
    }

    function setupPanel() {
        const shell = document.getElementById('app-shell');
        const closeBtn = document.getElementById('panel-close');
        const openBtn = document.getElementById('panel-open');

        function updateMapSize() {
            if (typeof map !== 'undefined' && map && typeof map.updateSize === 'function') {
                window.setTimeout(() => map.updateSize(), 40);
                window.setTimeout(() => map.updateSize(), 280);
            }
        }

        function collapse() {
            shell.classList.add('panel-collapsed');
            updateMapSize();
        }
        function expand() {
            shell.classList.remove('panel-collapsed');
            updateMapSize();
        }

        closeBtn.addEventListener('click', collapse);
        openBtn.addEventListener('click', expand);
        window.addEventListener('resize', updateMapSize);

        if (window.innerWidth <= 720) collapse();
    }

    function getFeatureValue(feature, field) {
        if (!feature || typeof feature.get !== 'function') return null;
        return feature.get(field);
    }

    function buildSituationRows(feature) {
        const rows = [];
        SITUATIONS.forEach(([field, label]) => {
            const value = toNumber(getFeatureValue(feature, field));
            if (value > 0) {
                rows.push(`<div class="situation-row"><span class="situation-name">${escapeHtml(label)}</span><span class="situation-count">${formatInteger(value)}</span></div>`);
            }
        });
        return rows.length ? rows.join('') : '<div class="popup-empty">Sem situações informadas para o período.</div>';
    }

    function buildMailto(municipio, exec) {
        const subject = `Solicitação de informações - Convênios - ${municipio}/SC`;
        const body = `Olá,\n\nSolicito informações detalhadas sobre os convênios em execução do município de ${municipio}/SC.\n\nQuantidade indicada no mapa: ${formatInteger(exec)}.\nPeríodo analisado: 2021 a 2026.\n\nNome do solicitante:\nÓrgão/empresa:\nNúmero de contato ligado ao WhatsApp:`;
        return `mailto:daltoncad@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    // Sobrescreve somente a composição visual do popup; dados e interação do qgis2web permanecem preservados.
    window.createPopupField = function (currentFeature) {
        const municipio = getFeatureValue(currentFeature, CONFIG.municipalityField) || 'Município';
        const exec = getFeatureValue(currentFeature, CONFIG.execField);
        const globalFmt = cleanFormatted(getFeatureValue(currentFeature, CONFIG.globalField), 0);
        const repasseFmt = cleanFormatted(getFeatureValue(currentFeature, CONFIG.repasseField), 0);
        const desembFmt = cleanFormatted(getFeatureValue(currentFeature, CONFIG.desembFmtField), getFeatureValue(currentFeature, CONFIG.desembField));
        const saldoFmt = cleanFormatted(getFeatureValue(currentFeature, CONFIG.saldoFmtField), getFeatureValue(currentFeature, CONFIG.saldoField));
        const percSaldo = getFeatureValue(currentFeature, CONFIG.percSaldoField) || '0,00%';
        const mailto = buildMailto(municipio, exec);

        const html = `
            <div class="muni-popup">
                <div class="muni-popup-head">
                    <span class="muni-popup-kicker">Município • SC</span>
                    <h3 class="muni-popup-title">${escapeHtml(municipio)}</h3>
                </div>
                <div class="muni-popup-body">
                    <div class="popup-metrics">
                        <div class="popup-metric exec"><span>Em execução</span><strong>${formatInteger(exec)}</strong></div>
                        <div class="popup-metric"><span>Saldo / Repasse</span><strong>${escapeHtml(percSaldo)}</strong></div>
                        <div class="popup-metric wide"><span>Valor global</span><strong>${escapeHtml(globalFmt)}</strong></div>
                        <div class="popup-metric wide"><span>Repasse</span><strong>${escapeHtml(repasseFmt)}</strong></div>
                        <div class="popup-metric wide"><span>Desembolsado</span><strong>${escapeHtml(desembFmt)}</strong></div>
                        <div class="popup-metric wide"><span>Saldo informado</span><strong>${escapeHtml(saldoFmt)}</strong></div>
                    </div>
                    <div class="popup-situations">
                        <h4 class="popup-section-title">Situações ${CONFIG.period}</h4>
                        <div class="situations-list">${buildSituationRows(currentFeature)}</div>
                    </div>
                    <a class="popup-action" href="${mailto}" target="_blank" rel="noopener">✉ Solicitar informações</a>
                </div>
            </div>`;
        return `<tr><td colspan="2">${html}</td></tr>`;
    };

    if (typeof lyr_SC_Municipios_WEBs_202608_0 !== 'undefined') {
        lyr_SC_Municipios_WEBs_202608_0.set('popuplayertitle', '');
    }

    buildSummaryAndRanking();
    setupPanel();
})();
