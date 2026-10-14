// All UI strings. Plural addressing ("לחצו", "נגנו") — D-67.
export const he = {
  appName: 'PianoPop',
  home: {
    title: 'ברוכים הבאים ל-PianoPop',
    subtitle: 'לומדים פסנתר צעד אחר צעד',
  },
  notFound: 'העמוד לא נמצא',
  piano: {
    keyboard: 'מקלדת פסנתר',
    volume: 'עוצמת קול',
    mute: 'השתקה',
    unmute: 'ביטול השתקה',
    showKeyLetters: 'הצגת אותיות המקלדת',
    lower: 'אוקטבה נמוכה יותר',
    higher: 'אוקטבה גבוהה יותר',
  },
  demo: {
    title: 'ניסיון פסנתר',
    start: 'התחילו',
    loading: 'טוענים צלילים…',
    blocked: 'הדפדפן חסם את הצליל. לחצו שוב על "התחילו".',
    showNames: 'הצגה בשמות תווים',
    showStaff: 'הצגה על חמשה',
  },
  exercise: {
    progress: (n: number, total: number) => `שאלה ${n} מתוך ${total}`,
    correct: 'נכון!',
    wrong: 'לא בדיוק, נסו שוב',
    done: 'סיימתם!',
    score: (score: number) => `הציון שלכם: ${score}`,
    passed: 'עברתם את התרגיל',
    failed: 'כמעט! אפשר לנסות שוב',
    retry: 'לנסות שוב',
  },
  pressKey: {
    title: 'מוצאים את הקליד',
    prompt: (note: string) => `לחצו על ${note}`,
  },
  staff: {
    label: 'חמשה',
  },
  readNote: {
    title: 'קוראים תווים',
    prompt: 'לחצו על התו שעל החמשה',
  },
  playSequence: {
    title: 'נגנו את הרצף',
    prompt: 'נגנו את התווים לפי הסדר',
    listen: 'השמיעו את הרצף',
    sequence: 'הרצף',
  },
  higherLower: {
    title: 'גבוה או נמוך',
    prompt: 'איזה צליל גבוה יותר?',
    first: 'הראשון',
    second: 'השני',
    listening: 'הקשיבו…',
    answerFirst: 'הצליל הראשון היה גבוה יותר',
    answerSecond: 'הצליל השני היה גבוה יותר',
  },
  notes: {
    solfege: ['דו', 'רה', 'מי', 'פה', 'סול', 'לה', 'סי'],
    sharp: '♯',
    flat: '♭',
  },
} as const;
