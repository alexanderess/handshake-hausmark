/* RCCS framework data — transcribed verbatim from Hausmark_RCCS_Scorecard.xlsx
   ("RCCS Scorecard" + "Pillar Guide" sheets). Weights sum to 1.00. */

const PILLARS = [
  {
    n: 1, name: 'Getting Started', weight: 0.05, critical: false,
    question: 'Was the process of getting started easy and welcoming?',
    levels: {
      10: 'Prompt, welcoming, accommodative scheduling, clear next step',
      5:  'Some delays, or the next steps were unclear',
      0:  'You felt rushed or confused, and they were not responsive'
    }
  },
  {
    n: 2, name: 'Understand Your Needs', weight: 0.12, critical: false,
    question: 'Did the ID take the time to listen to and understand your needs, lifestyle and renovation requirements?',
    levels: {
      10: 'Asked about your live-in profile and requirements, listened patiently and took notes',
      5:  'Asked some questions, but did not go deep',
      0:  'Did not seem to listen, or pushed their own ideas over yours'
    }
  },
  {
    n: 3, name: 'Professional Advice', weight: 0.12, critical: false,
    question: 'Was the ID knowledgeable, honest and willing to share practical renovation advice, such as cost-saving tips and pitfalls to avoid?',
    levels: {
      10: 'Provided renovation tips, including highlighting potential challenges',
      5:  'Somewhat useful advices',
      0:  'Lacked knowledge, or it felt like a hard sell'
    }
  },
  {
    n: 4, name: 'Design Fit', weight: 0.11, critical: false,
    question: 'Based on the ID\u2019s proposed layout design, can you see yourself living comfortably in the space they designed?',
    levels: {
      10: 'Original ideas with a practical layout that met your requirements',
      5:  'Some good ideas, not fully practical in some cases',
      0:  'Recycled ideas, and the design does not suit your needs'
    }
  },
  {
    n: 5, name: 'Project Monitoring', weight: 0.11, critical: false,
    question: 'Based on the ID\u2019s explanation and project management system, are you confident your renovation will be properly supervised and that you will receive regular progress updates?',
    levels: {
      10: 'Dedicated supervision (e.g. CCTV, site management) and fixed, routine updates',
      5:  'Non-committal about how they monitor the site and update you',
      0:  'You are unsure of the monitoring plan and the update method'
    }
  },
  {
    n: 6, name: 'Commitment Confidence', weight: 0.15, critical: true,
    question: 'Do you understand, and are you comfortable with, the quotation and every clause in the renovation contract?',
    levels: {
      10: 'Itemised quote, clear specs, unambiguous clauses, warranties clearly spelled out',
      5:  'Some \u201CFOC\u201D or \u201CKIV\u201D items are included, with unclear T&Cs and/or key commitments made verbally on matters such as after-sales service, warranties, design amendments or payment milestones.',
      0:  'Poorly detailed or vague quotations, with lump-sum items, unclear terms and conditions, or clauses the ID cannot clearly explain.'
    }
  },
  {
    n: 7, name: 'Quality Showcase', weight: 0.05, critical: false,
    question: 'Did their showroom, portfolio or past projects give you confidence in their design ability and workmanship?',
    levels: {
      10: 'Well-designed showroom, quality finishes, strong portfolio',
      5:  'Uninspiring showroom, with a limited portfolio',
      0:  'No showroom or past projects to show'
    }
  },
  {
    n: 8, name: 'Trust & Credentials', weight: 0.08, critical: false,
    question: 'Did their certifications and credentials give you added peace of mind?',
    levels: {
      10: 'CASETrust, HDB Licence, industry awards (e.g. RCMA)',
      5:  'Some certificates, but not issued by a governmental or official body',
      0:  'Unable to verify, or none provided'
    }
  },
  {
    n: 9, name: 'Escrow Payment', weight: 0.05, critical: false,
    question: 'Is this ID onboarded to, or willing to onboard, an escrow payment arrangement (e.g. Handshake)?',
    levels: {
      10: 'Already onboarded, or willing to use an escrow payment scheme',
      5:  'Not onboarded, but open to discussion with conditions',
      0:  'Does not allow escrow-based payment'
    }
  },
  {
    n: 10, name: 'Hausmark Confidence', weight: 0.10, critical: false,
    question: 'Has the ID earned the Hausmark Seal or demonstrated willingness to undergo voluntary independent assessment?',
    note: [
      { text: 'Check accredited IDs at ' },
      { href: 'https://www.hausmark.com.sg', label: 'www.hausmark.com.sg' },
      { text: '. For a free Hausmark assessment, please notify us at ' },
      { href: 'mailto:wecanhelp@hausmark.com.sg', label: 'wecanhelp@hausmark.com.sg' },
      { text: '.' }
    ],
    levels: {
      10: 'Hausmark Accredited (Seal Award), or willing to voluntarily undergo an independent Hausmark Assessment.',
      5:  'Hausmark Accredited (Aspiring Award), or hesitant to undergo a voluntary Hausmark Assessment.',
      0:  'No Hausmark Accreditation or unwilling to undergo voluntary Hausmark Assessment.'
    }
  },
  {
    n: 11, name: 'Online Presence', weight: 0.06, critical: true,
    question: 'Did their social media and online reviews make you feel confident about them?',
    levels: {
      10: 'Active social media, positive reviews, transparent handling of feedback',
      5:  'Mixed reviews',
      0:  'Many negative reviews, or no online presence at all'
    }
  }
];

const ANSWER_LABELS = { 10: 'Yes / Good', 5: 'Partially', 0: 'No / Unsure' };

/* Score bands — from the "SCORE GUIDE" block on the scorecard sheet. */
const BANDS = [
  { min: 80, key: 'strong',  verdict: 'Strong confidence',  detail: 'Likely a good choice.' },
  { min: 65, key: 'caution', verdict: 'Proceed with caution', detail: 'Investigate further before committing.' },
  { min: 0,  key: 'risk',    verdict: 'High risk',           detail: 'Slow down before signing anything.' }
];

/* Worked example shown on a first visit so the tool opens in a real working
   state. Cleared the moment the homeowner starts their own. */
const SAMPLE = {
  name: 'Lumen & Co Interiors',
  sample: true,
  answers: { 1: 10, 2: 10, 3: 5, 4: 10, 5: 5, 6: 5, 7: 10, 8: 10, 9: 0, 10: 10, 11: 10 }
};
