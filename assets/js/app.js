/* RCCS Homeowner Self-Assessment — interaction layer.
   Vanilla JS, no build step. Scoring mirrors the workbook formulas exactly:
     points = (answer / 10) * weight * 100   →   Yes 10, Partially 5, No 0
   Weights sum to 1.00, so a perfect assessment totals 100. */

(function () {
  'use strict';

  var STORAGE_KEY = 'hausmark-rccs-v1';
  var MAX_FIRMS = 3;

  var state = load() || { firms: [clone(SAMPLE)], active: 0 };

  /* ------------------------------------------------------------ utils -- */

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (!d || !Array.isArray(d.firms) || !d.firms.length) return null;
      return d;
    } catch (e) { return null; }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  /* ---------------------------------------------------------- scoring -- */

  function pointsFor(pillar, answer) {
    if (answer == null) return 0;
    return (answer / 10) * pillar.weight * 100;
  }

  function scoreOf(firm) {
    var total = 0, answered = 0;
    PILLARS.forEach(function (p) {
      var a = firm.answers[p.n];
      if (a != null) { answered++; total += pointsFor(p, a); }
    });
    return { total: total, answered: answered, complete: answered === PILLARS.length };
  }

  function bandOf(total) {
    for (var i = 0; i < BANDS.length; i++) if (total >= BANDS[i].min) return BANDS[i];
    return BANDS[BANDS.length - 1];
  }

  /* Critical-pillar check — mirrors the workbook's RED FLAG formula on
     pillars 6 (Commitment Confidence) and 11 (Online Presence). */
  function flagCheck(firm) {
    var crit = PILLARS.filter(function (p) { return p.critical; });
    var answers = crit.map(function (p) { return firm.answers[p.n]; });
    if (answers.every(function (a) { return a == null; })) {
      return { state: 'none', title: 'Critical pillar check', body: 'Answer pillars 6 and 11 to run this check.' };
    }
    var failed = crit.filter(function (p) { return firm.answers[p.n] === 0; });
    if (failed.length) {
      return {
        state: 'flag',
        title: 'Red flag',
        body: 'Pillar ' + failed.map(function (p) { return p.n; }).join(' and ') +
              ' scored No / Unsure. Investigate before signing.'
      };
    }
    var partial = crit.filter(function (p) { return firm.answers[p.n] === 5; });
    if (partial.length) {
      return {
        state: 'caution',
        title: 'Caution',
        body: 'Pillar ' + partial.map(function (p) { return p.n; }).join(' and ') +
              ' is only Partially. Clarify before signing.'
      };
    }
    if (answers.some(function (a) { return a == null; })) {
      return { state: 'none', title: 'Critical pillar check', body: 'Answer both critical pillars to complete this check.' };
    }
    return { state: 'clear', title: 'No critical red flags', body: 'Pillars 6 and 11 both scored Yes / Good.' };
  }

  /* The single most valuable thing left to do: the unanswered pillar
     carrying the most weight, or the biggest recoverable gap once complete. */
  function nextAction(firm) {
    var open = PILLARS.filter(function (p) { return firm.answers[p.n] == null; });
    if (open.length) {
      open.sort(function (a, b) { return b.weight - a.weight || a.n - b.n; });
      var p = open[0];
      return {
        label: 'Answer next',
        text: 'Pillar ' + p.n + ' · ' + p.name + ' carries ' + Math.round(p.weight * 100) +
              ' of the 100 points — the most of anything you have left.'
      };
    }
    var lost = PILLARS.map(function (p) {
      return { p: p, gap: p.weight * 100 - pointsFor(p, firm.answers[p.n]) };
    }).filter(function (x) { return x.gap > 0; }).sort(function (a, b) { return b.gap - a.gap; });

    if (!lost.length) {
      return { label: 'Complete', text: 'Every pillar scored Yes / Good. Keep the escrow arrangement in writing before you pay a deposit.' };
    }
    var top = lost[0];
    return {
      label: 'Biggest gap',
      text: 'Pillar ' + top.p.n + ' · ' + top.p.name + ' cost you ' + fmt(top.gap) +
            ' points. Ask them to close it, then re-score.'
    };
  }

  function fmt(n) {
    return (Math.round(n * 10) / 10).toString().replace(/\.0$/, '');
  }

  /* ------------------------------------------------------ build pillars -- */

  var pillarNodes = {};

  function buildPillars() {
    var host = $('#pillars');
    host.textContent = '';

    PILLARS.forEach(function (p) {
      var card = el('article', 'pillar');
      card.dataset.critical = String(p.critical);
      card.id = 'pillar-' + p.n;

      var head = el('div', 'pillar__head');
      head.appendChild(el('div', 'pillar__n', String(p.n).padStart(2, '0')));

      var titles = el('div', 'pillar__titles');
      var nameRow = el('div', 'pillar__name');
      nameRow.appendChild(document.createTextNode(p.name));
      if (p.critical) nameRow.appendChild(el('span', 'flag', '⚑ Critical'));
      titles.appendChild(nameRow);
      titles.appendChild(el('p', 'pillar__q', p.question));
      head.appendChild(titles);

      var w = el('div', 'pillar__weight');
      w.appendChild(el('i', null, 'Worth'));
      w.appendChild(el('b', null, Math.round(p.weight * 100) + ' pts'));
      var meter = el('div', 'weight-meter');
      var meterFill = el('i');
      /* Scaled against the heaviest pillar so the bars use their full range. */
      meterFill.style.width = (p.weight / 0.15 * 100) + '%';
      meter.appendChild(meterFill);
      w.appendChild(meter);
      head.appendChild(w);

      card.appendChild(head);

      var opts = el('div', 'opts');
      opts.setAttribute('role', 'group');
      opts.setAttribute('aria-label', 'Pillar ' + p.n + ': ' + p.name);

      var buttons = {};
      [10, 5, 0].forEach(function (v) {
        var b = el('button', 'opt');
        b.type = 'button';
        b.dataset.v = String(v);
        b.id = 'p' + p.n + '-opt' + v;
        b.setAttribute('aria-pressed', 'false');

        var lab = el('div', 'opt__label');
        lab.appendChild(el('span', null, ANSWER_LABELS[v]));
        lab.appendChild(el('span', 'opt__pts', '+' + fmt(p.weight * 100 * (v / 10))));
        b.appendChild(lab);
        b.appendChild(el('div', 'opt__desc', p.levels[v]));

        b.addEventListener('click', function () { answer(p.n, v); });
        opts.appendChild(b);
        buttons[v] = b;
      });

      card.appendChild(opts);
      host.appendChild(card);
      pillarNodes[p.n] = { card: card, buttons: buttons };
    });
  }

  function answer(pillarN, value) {
    var firm = state.firms[state.active];
    if (firm.sample) {
      /* First real answer retires the worked example rather than mixing
         the homeowner's scoring into it. */
      state.firms[state.active] = { name: '', answers: {} };
      firm = state.firms[state.active];
    }
    firm.answers[pillarN] = firm.answers[pillarN] === value ? null : value;
    if (firm.answers[pillarN] == null) delete firm.answers[pillarN];
    save();
    render();
  }

  /* ---------------------------------------------------------- rendering -- */

  function render() {
    var firm = state.firms[state.active];
    renderFirms();
    renderAnswers(firm);
    renderVerdict(firm);
    renderBreakdown(firm);
    renderCompare();
    $('#sample-note').hidden = !firm.sample;
  }

  function renderFirms() {
    var host = $('#firm-tabs');
    host.textContent = '';

    state.firms.forEach(function (f, i) {
      var s = scoreOf(f);
      var tab = el('button', 'firm-tab');
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(i === state.active));
      tab.appendChild(el('span', 'firm-tab__name', f.name || ('ID Firm ' + String.fromCharCode(65 + i))));

      var pill = el('span', 'firm-tab__score', s.answered ? fmt(s.total) : '—');
      if (s.complete) pill.dataset.band = bandOf(s.total).key;
      tab.appendChild(pill);

      tab.addEventListener('click', function () { state.active = i; save(); render(); });
      host.appendChild(tab);
    });

    /* With a single firm the tab is just a duplicate of the name field. */
    host.hidden = state.firms.length < 2;

    var input = $('#firm-name');
    var firm = state.firms[state.active];
    if (document.activeElement !== input) {
      input.value = firm.sample ? firm.name : (firm.name || '');
    }
    input.placeholder = 'Name this ID firm (e.g. ' + ['Lumen & Co', 'Studio Tiga', 'Rumah Works'][state.active] + ')';

    $('#add-firm').hidden = state.firms.length >= MAX_FIRMS;
    $('#remove-firm').hidden = state.firms.length < 2;
  }

  function renderAnswers(firm) {
    PILLARS.forEach(function (p) {
      var node = pillarNodes[p.n];
      var a = firm.answers[p.n];
      node.card.dataset.answered = String(a != null);
      [10, 5, 0].forEach(function (v) {
        node.buttons[v].setAttribute('aria-pressed', String(a === v));
      });
    });
  }

  function renderVerdict(firm) {
    var s = scoreOf(firm);
    var band = bandOf(s.total);

    $('#v-firm').textContent = firm.name || ('ID Firm ' + String.fromCharCode(65 + state.active));
    $('#v-score').textContent = s.answered ? fmt(s.total) : '—';

    var bandEl = $('#v-band');
    var detailEl = $('#v-band-detail');
    if (!s.complete) {
      bandEl.removeAttribute('data-band');
      bandEl.textContent = 'In progress';
      detailEl.textContent = 'Answer all 11 questions to see your result.';
    } else {
      bandEl.dataset.band = band.key;
      bandEl.textContent = band.verdict;
      detailEl.textContent = band.detail;
    }

    $('#v-progress-label').textContent = s.answered + ' of ' + PILLARS.length + ' answered';
    $('#v-progress-fill').style.width = (s.answered / PILLARS.length * 100) + '%';

    /* The gradient band mirrors the rail, so progress stays visible at the top
       of the page the way Handshake's onboarding form shows its step. */
    $('#band-fill').style.width = (s.answered / PILLARS.length * 100) + '%';
    $('#band-step').textContent = s.answered + ' of ' + PILLARS.length + ' answered';
    $('#band-score').innerHTML = '';
    $('#band-score').appendChild(document.createTextNode(s.answered ? fmt(s.total) : '\u2014'));
    var den = el('small', null, '/ 100');
    $('#band-score').appendChild(document.createTextNode(' '));
    $('#band-score').appendChild(den);

    var fc = flagCheck(firm);
    var fcEl = $('#v-flagcheck');
    fcEl.dataset.state = fc.state;
    $('#v-flag-title').textContent = fc.title;
    $('#v-flag-body').textContent = fc.body;

    var na = nextAction(firm);
    $('#v-nudge-label').textContent = na.label;
    $('#v-nudge-text').textContent = na.text;
  }

  function renderBreakdown(firm) {
    var s = scoreOf(firm);
    $('#breakdown').hidden = s.answered === 0;
    var host = $('#bd-rows');
    host.textContent = '';

    PILLARS.forEach(function (p) {
      var a = firm.answers[p.n];
      var earned = pointsFor(p, a);
      var row = el('div', 'bd-row');
      row.appendChild(el('span', 'bd-row__n', String(p.n).padStart(2, '0')));
      row.appendChild(el('span', 'bd-row__name', p.name));

      /* Track width encodes the pillar's weight; fill encodes points earned. */
      var trackWrap = el('div');
      var track = el('div', 'bd-track');
      track.style.width = (p.weight / 0.15 * 100) + '%';
      var fill = el('div', 'bd-fill');
      fill.style.width = a == null ? '0%' : (a / 10 * 100) + '%';
      if (a != null) fill.dataset.v = String(a);
      track.appendChild(fill);
      trackWrap.appendChild(track);
      row.appendChild(trackWrap);

      row.appendChild(el('span', 'bd-row__pts', a == null ? '— / ' + Math.round(p.weight * 100)
        : fmt(earned) + ' / ' + Math.round(p.weight * 100)));
      host.appendChild(row);
    });

    $('#bd-total').textContent = fmt(s.total) + ' / 100';
  }

  function renderCompare() {
    var scored = state.firms.filter(function (f) { return !f.sample && scoreOf(f).answered > 0; });
    var show = state.firms.length > 1 && scored.length > 1;
    $('#compare').hidden = !show;
    if (!show) return;

    var thead = $('#cmp-head'), tbody = $('#cmp-body'), tfoot = $('#cmp-foot');
    thead.textContent = ''; tbody.textContent = ''; tfoot.textContent = '';

    var hr = el('tr');
    hr.appendChild(el('th', null, 'Pillar'));
    state.firms.forEach(function (f, i) {
      hr.appendChild(el('th', null, f.name || ('ID Firm ' + String.fromCharCode(65 + i))));
    });
    thead.appendChild(hr);

    PILLARS.forEach(function (p) {
      var tr = el('tr');
      var th = el('th', null, p.n + '. ' + p.name + (p.critical ? ' ⚑' : ''));
      th.scope = 'row';
      tr.appendChild(th);

      var vals = state.firms.map(function (f) { return f.answers[p.n]; });
      var best = Math.max.apply(null, vals.map(function (v) { return v == null ? -1 : v; }));

      vals.forEach(function (v) {
        var td = el('td');
        var pip = el('span', 'pip');
        pip.dataset.v = v == null ? '' : String(v);
        pip.title = v == null ? 'Not answered' : ANSWER_LABELS[v];
        td.appendChild(pip);
        if (v != null && v === best && best > 0 && vals.filter(function (x) { return x === best; }).length < vals.length) {
          td.className = 'is-best';
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    var fr = el('tr');
    var fth = el('th', null, 'Total RCCS score');
    fth.scope = 'row';
    fr.appendChild(fth);
    var totals = state.firms.map(function (f) { return scoreOf(f); });
    var bestTotal = Math.max.apply(null, totals.map(function (t) { return t.answered ? t.total : -1; }));
    totals.forEach(function (t) {
      var td = el('td', null, t.answered ? fmt(t.total) : '—');
      if (t.answered && t.total === bestTotal) td.className = 'is-best';
      fr.appendChild(td);
    });
    tfoot.appendChild(fr);
  }

  /* ------------------------------------------------------------ events -- */

  function init() {
    buildPillars();

    $('#firm-name').addEventListener('input', function (e) {
      var firm = state.firms[state.active];
      if (firm.sample) { state.firms[state.active] = { name: '', answers: {} }; firm = state.firms[state.active]; }
      firm.name = e.target.value;
      save();
      renderFirms();
      renderVerdict(firm);
      renderCompare();
      $('#sample-note').hidden = true;
    });

    $('#add-firm').addEventListener('click', function () {
      if (state.firms.length >= MAX_FIRMS) return;
      state.firms = state.firms.filter(function (f) { return !f.sample; });
      state.firms.push({ name: '', answers: {} });
      state.active = state.firms.length - 1;
      save(); render();
      $('#firm-name').focus();
    });

    $('#remove-firm').addEventListener('click', function () {
      if (state.firms.length < 2) return;
      var name = state.firms[state.active].name || 'this firm';
      if (!confirm('Remove ' + name + ' and its answers?')) return;
      state.firms.splice(state.active, 1);
      state.active = Math.max(0, state.active - 1);
      save(); render();
    });

    $('#clear-sample').addEventListener('click', startFresh);
    $('#reset').addEventListener('click', function () {
      if (!confirm('Clear every answer for every firm and start again?')) return;
      state = { firms: [{ name: '', answers: {} }], active: 0 };
      save(); render();
      $('#firm-name').focus();
    });

    function startFresh() {
      state.firms[state.active] = { name: '', answers: {} };
      save(); render();
      $('#firm-name').focus();
      document.getElementById('assess').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    $('#print').addEventListener('click', function () { window.print(); });

    $('#copy').addEventListener('click', function (e) {
      var btn = e.currentTarget;
      var firm = state.firms[state.active];
      var s = scoreOf(firm);
      var fc = flagCheck(firm);
      var lines = [
        'RCCS assessment — ' + (firm.name || 'ID Firm ' + String.fromCharCode(65 + state.active)),
        'Score: ' + fmt(s.total) + ' / 100  (' + s.answered + ' of 11 answered)',
        s.complete ? 'Verdict: ' + bandOf(s.total).verdict + ' — ' + bandOf(s.total).detail : 'Verdict: incomplete',
        'Critical check: ' + fc.title + ' — ' + fc.body,
        ''
      ];
      PILLARS.forEach(function (p) {
        var a = firm.answers[p.n];
        lines.push(p.n + '. ' + p.name + (p.critical ? ' (critical)' : '') + ': ' +
          (a == null ? 'not answered' : ANSWER_LABELS[a]) +
          '  [' + (a == null ? '—' : fmt(pointsFor(p, a))) + '/' + Math.round(p.weight * 100) + ']');
      });
      lines.push('', 'Hausmark RCCS framework · hausmark.com.sg', 'Escrow payments in partnership with Handshake · handshake.finance');

      var text = lines.join('\n');
      var done = function () {
        var old = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
      } else { fallbackCopy(text, done); }
    });

    function fallbackCopy(text, done) {
      var ta = el('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (err) { /* no clipboard */ }
      document.body.removeChild(ta);
    }

    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
