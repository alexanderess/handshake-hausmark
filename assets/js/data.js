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
    question: 'Did the designer really listen to what you want and need?',
    levels: {
      10: 'Asked about your live-in profile and requirements, listened patiently and took notes',
      5:  'Asked some questions, but did not go deep',
      0:  'Did not seem to listen, or pushed their own ideas over yours'
    }
  },
  {
    n: 3, name: 'Professional Advice', weight: 0.12, critical: false,
    question: 'Did the designer seem knowledgeable and able to bring your ideas to life?',
    levels: {
      10: 'Provided renovation tips, including highlighting potential challenges',
      5:  'Somewhat useful advices',
      0:  'Lacked knowledge, or it felt like a hard sell'
    }
  },
  {
    n: 4, name: 'Design Fit', weight: 0.11, critical: false,
    question: 'Can you picture yourself at home in the space they designed?',
    levels: {
      10: 'Original ideas with a practical layout that met your requirements',
      5:  'Some good ideas, not fully practical in some cases',
      0:  'Recycled ideas, and the design does not suit your needs'
    }
  },
  {
    n: 5, name: 'Project Monitoring', weight: 0.11, critical: false,
    question: 'Do you feel the renovation work will be supervised, and that you will be kept updated as it progresses?',
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
      5:  'Many KIV items in quote, some unclear clauses but clarified only under verbal warranty commitment',
      0:  'Poorly detailed and vague quote, terms unclear and not transparently explained'
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
    question: 'Is this ID onboarded to, or willing to onboard, an escrow payment arrangement?',
    levels: {
      10: 'Already onboarded, or willing to use an escrow payment scheme',
      5:  'Not onboarded, but open to discussion with conditions',
      0:  'Does not allow escrow-based payment'
    }
  },
  {
    n: 10, name: 'Hausmark Confidence', weight: 0.10, critical: false,
    question: 'Has this ID obtained a Hausmark Seal?',
    levels: {
      10: 'Hausmark Accredited ID (holds the Hausmark Seal)',
      5:  'Hausmark Accredited ID (with aspiring award)',
      0:  'No Hausmark accreditation'
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
