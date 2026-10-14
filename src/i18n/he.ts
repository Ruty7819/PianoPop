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
  },
  pressKey: {
    title: 'מוצאים את הקליד',
    prompt: (note: string) => `לחצו על ${note}`,
    progress: (n: number, total: number) => `שאלה ${n} מתוך ${total}`,
    correct: 'נכון!',
    wrong: 'לא בדיוק, נסו שוב',
    done: 'סיימתם!',
    score: (score: number) => `הציון שלכם: ${score}`,
    passed: 'עברתם את התרגיל',
    failed: 'כמעט! אפשר לנסות שוב',
    retry: 'לנסות שוב',
  },
  notes: {
    solfege: ['דו', 'רה', 'מי', 'פה', 'סול', 'לה', 'סי'],
    sharp: '♯',
    flat: '♭',
  },
} as const;
