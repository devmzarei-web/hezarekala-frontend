/**
 * capabilities-data.ts
 * Comprehensive definition of the 7 Industrial Capability Divisions
 * of Hezareh Kala Danesh Arvand in Abadan Industrial Estate.
 */

export interface MachineItem {
  id: string;
  name: string;
  specs: string;
  capacityHighlight: string;
  keyLimits?: {
    maxWeight?: string;
    maxDiameter?: string;
    maxLength?: string;
    maxThickness?: string;
  };
  applications: string[];
  status: "available" | "active";
}

export interface CapabilityDivision {
  id: string;
  number: number;
  title: string;
  englishTitle: string;
  slug: string;
  badge: string;
  description: string;
  iconName: "Layers" | "Cog" | "Flame" | "Droplets" | "ShieldCheck" | "Zap" | "Paintbrush";
  stats: {
    label: string;
    value: string;
  }[];
  machines: MachineItem[];
  standards: string[];
  ctaText: string;
  ctaLink: string;
}

export const CAPABILITY_DIVISIONS: CapabilityDivision[] = [
  // ── ۱. مبدل شاپ و مخازن تحت فشار ──
  {
    id: "div-heat-exchangers",
    number: 1,
    title: "مبدل شاپ و تجهیزات فرآیندی",
    englishTitle: "Heat Exchangers & Thermal Systems",
    slug: "heat-exchangers",
    badge: "پوسته و لوله / تیوب شیت",
    description:
      "ساخت، بازسازی، تعویض باندل لوله‌ای (Tube Bundle)، رولیک‌کاری و تست هیدرواستاتیک انواع مبدل‌های حرارتی پوسته و لوله و خنک‌کننده‌های فرآیندی صنایع نفت، گاز و پتروشیمی با تجهیزات تخصصی اکسپندینگ و واترجت فشار قوی.",
    iconName: "Layers",
    stats: [
      { label: "حداکثر قطر لوله خم‌کاری", value: "۶۰ میلی‌متر" },
      { label: "سیستم اکسپندینگ لوله‌ها", value: "هیدرولیک و بادی دقیق" },
      { label: "شستشو و رسوب‌زدایی تیوب‌ها", value: "واترجت فوق‌فشار قوی" },
      { label: "ایستگاه آزمون نشتی", value: "تست هیدرواستاتیک تخصصی" },
    ],
    standards: ["TEMA Class R, C, B", "ASME Sec VIII Div 1", "API 660"],
    ctaText: "استعلام ساخت و تعمیر مبدل حرارتی",
    ctaLink: "/contact?service=heat-exchangers",
    machines: [
      {
        id: "hx-tube-bender",
        name: "دستگاه لوله خم‌کن صنعتی تا قطر ۶۰ میلی‌متر",
        specs: "خم‌کاری سرد بدون چروکیدگی انواع لوله‌های کربن استیل، استنلس استیل و مس‌نیکل جهت ساخت لوله‌های یو (U-Tube) مبدل‌ها",
        capacityHighlight: "قطر ۶۰mm",
        keyLimits: { maxDiameter: "60 mm" },
        applications: ["خم‌کاری تیوب‌های مبدل", "پایپینگ بویلرها", "کویل‌های تبادل حرارتی"],
        status: "available",
      },
      {
        id: "hx-expander",
        name: "دستگاه‌های اکسپندر هیدرولیک و پنوماتیک (Air & Hydraulic Tube Expanders)",
        specs: "اکسپندینگ و آب‌بندی متالوژیکی دقیق لوله‌ها در داخل حفره‌های تیوب‌شیت با کنترل دیجیتال گشتاور و فشار",
        capacityHighlight: "گشتاور دیجیتال",
        applications: ["اکسپند لوله‌های تیوب‌شیت", "والس‌کاری لوله‌های بویلر", "تعویض باندل مبدل"],
        status: "available",
      },
      {
        id: "hx-waterjet",
        name: "سیستم شستشوی داخل لوله‌ها با واترجت فشار قوی (High-Pressure Tube Cleaning)",
        specs: "رسوب‌زدایی عمیق، حذف کک و لایه‌های سخت اکسیدی از درون لوله‌های مبدل بدون آسیب به دیواره لوله",
        capacityHighlight: "فوق‌فشار قوی",
        applications: ["رسوب‌زدایی لوله‌های مبدل پالایشگاهی", "تمیزکاری پیش از آزمون دوره‌ای"],
        status: "available",
      },
      {
        id: "hx-hydrotest",
        name: "میزهای تخصصی تست هیدرواستاتیک و نشتی شل و تیوب",
        specs: "بسترسازی آزمون فشار پوسته و لوله تا ۲۰۰ بار با گیج‌های کالیبره و پایش پیوسته افت فشار جهت صدور گواهی بازرسی",
        capacityHighlight: "تا ۲۰۰ بار",
        applications: ["تست نشتی تیوب‌شیت", "آزمون هیدرواستاتیک مبدل و وسل"],
        status: "available",
      },
    ],
  },

  // ── ۲. ماشین‌کاری سنگین و تراشکاری CNC ──
  {
    id: "div-heavy-machining",
    number: 2,
    title: "ماشین‌کاری سنگین و تراشکاری CNC",
    englishTitle: "Heavy Machining & Precision CNC",
    slug: "heavy-machining",
    badge: "قطعه‌گیری تا ۲۰ تن",
    description:
      "تراشکاری فوق‌سنگین به طول ۶ متر و دهانه ۱.۸ متر با ظرفیت بارگیری ۲۰ تن، فرز دروازه‌ای CNC مدل KF3000 اسپانیا تا ۱۲ تن، دریل رادیال ۴ متری و برش فوق‌دقیق وایرکات مولتی‌کات بدون نیاز به برون‌سپاری.",
    iconName: "Cog",
    stats: [
      { label: "حداکثر وزن قطعه‌گیری تراش", value: "۲۰ تن" },
      { label: "حداکثر طول کارگیر تراش", value: "۶ متر" },
      { label: "حداکثر قطر کارگیر تراش", value: "۱.۸ متر" },
      { label: "فرز CNC اسپانیا (KF3000)", value: "۱۲ تن / میز ۳ متر" },
    ],
    standards: ["ISO 2768", "DIN ISO 286", "API 610 Machining Limits"],
    ctaText: "استعلام سفارش تراشکاری و ماشین‌کاری سنگین",
    ctaLink: "/contact?service=heavy-machining",
    machines: [
      {
        id: "m-lathe-6m",
        name: "دستگاه تراش سنگین ۶ متری (قطعه‌گیری ۲۰ تن)",
        specs: "طول کارگیر ۶ متر، دهانه کارگیر ۱.۸ متر، ظرفیت بارگذاری قطعه تا ۲۰ تن بین مرغک و لینت هیدرولیک صنعتی",
        capacityHighlight: "۲۰ تن / طول ۶m",
        keyLimits: { maxWeight: "20 Ton", maxLength: "6 m", maxDiameter: "1.8 m" },
        applications: ["تراش شفت‌های توربین و کمپرسور", "تراش پوسته‌ها و روتورهای حجیم", "بوش‌های عظیم شناورها"],
        status: "available",
      },
      {
        id: "m-cnc-kf3000",
        name: "دستگاه فرز سنگین CNC مدل KF3000 اسپانیا",
        specs: "طول میز ۳ متر، کنترلر تمام اتوماتیک CNC با قابلیت قطعه‌گیری تا ۱۲ تن، ماشین‌کاری ۵ محور فرضی قطعات پیچیده",
        capacityHighlight: "۱۲ تن / میز ۳m",
        keyLimits: { maxWeight: "12 Ton", maxLength: "3 m" },
        applications: ["پوسته‌های دوپارچه پمپ نفت", "تیوب‌شیت‌های سایز بزرگ", "بلوک‌های سیلندر و هوزینگ‌ها"],
        status: "available",
      },
      {
        id: "m-radial-drill-4m",
        name: "دستگاه دریل رادیال سنگین بازوی ۴ متری",
        specs: "شعاع گردش بازو ۴ متر، مورس بزرگ، قابلیت مته‌کاری و قلاویزکاری روی قطعات فوق‌سنگین صنعتی بدون جابجایی کار",
        capacityHighlight: "شعاع ۴ متر",
        keyLimits: { maxLength: "4 m" },
        applications: ["سوراخ‌کاری فلنج‌های غول‌پیکر", "تیوب‌شیت‌ها", "سازه و فریم‌های صنعتی سنگین"],
        status: "available",
      },
      {
        id: "m-wirecut",
        name: "دستگاه وایرکات مولتی‌کات سایز بزرگ (Multi-Cut Wire EDM)",
        specs: "برشکاری تخلیه الکتریکی فوق‌دقیق با سیم با پرداخت سطحی آینه‌ای، بدون ایجاد تنش حرارتی و دفرمگی روی فلزات سخت",
        capacityHighlight: "دقت میکرونی",
        applications: ["ساخت پروانه‌های پمپ", "چرخ‌دنده‌ها و شیارهای دقیق", "قالب‌های سنبه و ماتریس"],
        status: "available",
      },
      {
        id: "m-superdrill",
        name: "دستگاه سوپردریل سوراخ‌کاری تخلیه الکتریکی (EDM Drill)",
        specs: "ایجاد سریع سوراخ‌های عمیق راهنما از قطر ۰.۳ تا ۳ میلی‌متر در سوپرآلیاژها و فولادهای سخت‌کاری‌شده",
        capacityHighlight: "سوراخ‌های میکرونی",
        applications: ["سوراخ راهنمای وایرکات", "نازل‌های پاشش", "گذرگاه‌های خنک‌کاری سوپاپ"],
        status: "available",
      },
      {
        id: "m-tabriz-lathes",
        name: "مجموعه ۳ دستگاه تراش صنعتی ماشین‌سازی تبریز",
        specs: "تراشکاری دقیق، رزوه قطعات، ساخت بوش‌ها، فلنج‌ها، شفت‌های ثانویه و رینگ‌های سایش با دقت صدم میلی‌متر",
        capacityHighlight: "دقت صدم میلی‌متر",
        applications: ["قطعات پمپ و ولو", "ساخت رینگ‌های تعادلی", "ماشین‌کاری قطعات متوسط"],
        status: "available",
      },
      {
        id: "m-manual-mill",
        name: "دستگاه فرز منوال یونیورسال تبریز",
        specs: "فرزکاری قطعات پایه، ایجاد جای‌خار، شکاف‌های دقیق و پرداخت نشیمنگاه‌های یاتاقان و بیرینگ‌ها",
        capacityHighlight: "فرزکاری منوال",
        applications: ["جای‌خار شفت", "پایه‌های تجهیزات", "تسطیح قطعات"],
        status: "available",
      },
      {
        id: "m-bandsaw",
        name: "دستگاه اره نواری هیدرولیک صنعتی سایز بزرگ",
        specs: "برش مقاطع گرد، چهارپهلو و لوله‌های ضخیم آلیاژی تا قطر بالا با برش صاف، زاویه‌دار و بدون پرت متریال",
        capacityHighlight: "برش تمیز هیدرولیک",
        applications: ["برش میل‌گردهای سنگین آلیاژی", "تکه‌کاری قطعات خام شفت"],
        status: "available",
      },
    ],
  },

  // ── ۳. آهنگری، برش و فرم‌دهی فلزات ──
  {
    id: "div-forming-fabrication",
    number: 3,
    title: "آهنگری، برش و فرم‌دهی فلزات",
    englishTitle: "Forging, Rolling & Sheet Metal Forming",
    slug: "forging-forming",
    badge: "نورد ورق تا ۶۰mm",
    description:
      "نورد سرد و گرم ۴ غلطکه تا ضخامت استثنایی ۶۰ میلی‌متر، برش لیزر پرقدرت فایبر ۶ کیلووات، پرس‌برک ۴ متری ۳۲۰ تن، پرس ضربه‌ای ۴۰ تن و پانچ هیدرولیک ۶۰ تن جهت تولید سازه‌ها و پوسته‌های ضخیم صنعتی.",
    iconName: "Flame",
    stats: [
      { label: "حداکثر ضخامت نورد ورق", value: "۶۰ میلی‌متر" },
      { label: "توان سورس برش لیزر فایبر", value: "۶ کیلووات (6kW)" },
      { label: "ظرفیت خم‌کاری پرس برک", value: "۳۲۰ تن / ۴ متر" },
      { label: "ظرفیت پانچ و پرس ضربه‌ای", value: "۶۰ تن / ۴۰ تن" },
    ],
    standards: ["ASME Sec VIII", "AWS D1.1", "DIN EN 10025"],
    ctaText: "استعلام خدمات نورد سنگین و برش لیزر",
    ctaLink: "/contact?service=forging-forming",
    machines: [
      {
        id: "f-roller-60mm",
        name: "دستگاه نورد ۴ غلطکه سنگین صنعتی (ورق تا ضخامت ۶۰ میلی‌متر)",
        specs: "قابلیت پیش‌خم طرفین و رول‌کاری انواع ورق‌های فولادی ضخیم کربن استیل و آلیاژی تا ضخامت ۶۰ میلی‌متر برای شل مخازن و پمپ‌ها",
        capacityHighlight: "ضخامت ۶۰mm",
        keyLimits: { maxThickness: "60 mm" },
        applications: ["نورد شل مخازن تحت فشار", "بدنه مبدل‌های حرارتی", "لوله‌های ضخیم با قطر بالا"],
        status: "available",
      },
      {
        id: "f-laser-6kw",
        name: "دستگاه برش لیزر فایبر صنعتی ۶ کیلووات (6 kW)",
        specs: "برشکاری فوق‌العاده سریع و دقیق انواع ورق‌های آهن، استیل تا ضخامت ۲۵mm و آلومینیوم با کمترین پخ و ناحیه اثر حرارتی (HAZ)",
        capacityHighlight: "توان 6000W",
        applications: ["برش فلنج‌های اختصاصی", "پره‌های پروانه پمپ", "قطعات پیچیده بدنه و شاسی"],
        status: "available",
      },
      {
        id: "f-press-brake-320t",
        name: "دستگاه پرس برک CNC سنگین ۳۲۰ تن به طول ۴ متر",
        specs: "خم‌کاری چندمرحله‌ای صفحات فولادی با دقت زاویه‌ای بالا به طول ۴ متر با نیروی پرس ۳۲۰ تن و بومبله هیدرولیک",
        capacityHighlight: "۳۲۰ تن / ۴m",
        keyLimits: { maxWeight: "320 Ton", maxLength: "4 m" },
        applications: ["خم‌کاری شاسی پمپ و ژنراتور", "کانوپی سایلنت", "سازه و فرم‌های صنعتی"],
        status: "available",
      },
      {
        id: "f-stroke-press-40t",
        name: "دستگاه پرس ضربه‌ای کلاچ‌دار ۴۰ تن",
        specs: "قالب‌کاری، ضربه‌زنی، فرم‌دهی قطعات تیراژی و فرم‌دادن فلزات با کورس و تناژ قابل تنظیم",
        capacityHighlight: "۴۰ تن",
        applications: ["تولید قطعات واسط فرم‌دار", "بست‌ها و براکت‌های نگهدارنده"],
        status: "available",
      },
      {
        id: "f-punch-60t",
        name: "دستگاه پانچ هیدرولیک چندکاره ۶۰ تن",
        specs: "سوراخ‌کاری، گوشه‌زنی، برش نبشی، ناودانی و تسمه‌های ضخیم صنعتی با تناژ برش ۶۰ تن",
        capacityHighlight: "۶۰ تن",
        applications: ["سوراخ‌کاری تسمه و لچکی", "ساخت استراکچر و فونداسیون شاسی پمپ"],
        status: "available",
      },
    ],
  },

  // ── ۴. پمپ شاپ صنعتی و پکیج‌های پرتابل ──
  {
    id: "div-pump-shop",
    number: 4,
    title: "پمپ شاپ صنعتی و پکیج‌های پرتابل",
    englishTitle: "Industrial Pump Shop & Mobile Packages",
    slug: "pump-shop",
    badge: "تست هیدرولیک و هیدرواستاتیک",
    description:
      "طراحی، ساخت و پکیجینگ انواع پمپ‌های خودمکش خودمکش (Self-Priming)، پمپ‌های دنده‌ای غلیظ‌کش، سامانه‌های لجن‌کش پرتابل، تعمیر، بازسازی و تست عملکردی انواع پمپ‌های صنایع نفت و گاز روی بنچ تست هیدرولیک کارخانه.",
    iconName: "Droplets",
    stats: [
      { label: "دامنه دبی ساخت و تعمیر", value: "تا ۱۲۰۰ مترمکعب در ساعت" },
      { label: "حداکثر فشار تست بدنه", value: "۱۰۰ بار (100 Bar)" },
      { label: "تجهیزات تست عملکردی", value: "بنچ هیدرولیک فلومتری و فشار" },
      { label: "پکیجینگ و کوپلینگ", value: "دیزلی و الکتروموتور شاسی‌دار" },
    ],
    standards: ["API 610", "ISO 5199", "HI (Hydraulic Institute) Standards"],
    ctaText: "درخواست ساخت سفارشی پمپ یا مشاوره اورهال",
    ctaLink: "/contact?service=pump-shop",
    machines: [
      {
        id: "p-packaging-line",
        name: "خط ساخت و پکیجینگ پمپ‌های خودمکش و پکیج‌های دیزلی پرتابل",
        specs: "طراحی و مونتاژ پکیج‌های خودمکش دیزلی و الکتریکی شاسی چرخ‌دار از سایز ۴ اینچ تا ۱۰ اینچ با سیستم پرایمینگ کمکی",
        capacityHighlight: "سایز ۴ تا ۱۰ اینچ",
        applications: ["پمپ‌های خودمکش سیلاب", "پمپ‌های دنده‌ای مازوت و قیر", "ایستگاه‌های موقت پمپاژ"],
        status: "available",
      },
      {
        id: "p-overhaul-station",
        name: "ایستگاه تخصصی تعمیر و بازسازی انواع پمپ‌های فرآیندی و صنعتی",
        specs: "دمونتاژ، بالانس دینامیکی روتورها، جایگزینی سیل مکانیکال، بازسازی نشیمن یاتاقان‌ها و تراش قطعات مستهلک",
        capacityHighlight: "اورهال کامل فرآیندی",
        applications: ["اورهال پمپ‌های چندطبقه بویلرفید", "پمپ‌های دو مکشه BB2", "پمپ‌های اسلاری"],
        status: "available",
      },
      {
        id: "p-test-bench",
        name: "بنچ تست هیدرولیک عملکردی و هیدرواستاتیک کارخانه‌ای",
        specs: "حوضچه آزمون، مانیتورینگ آنلاین پارامترهای هیدرولیکی (دبی، هد، توان مصرفی، راندمان، NPSH و تست ارتعاشات)",
        capacityHighlight: "تست عملکردی دقیق",
        applications: ["استخراج منحنی عملکرد Q-H", "تست آب‌بندی تحت فشار نامی", "آزمون ارتعاشات طبق ISO"],
        status: "available",
      },
    ],
  },

  // ── ۵. شیرآلات صنعتی و ولو (Valves Shop) ──
  {
    id: "div-valves-shop",
    number: 5,
    title: "شیرآلات صنعتی و ولو (Valve Shop)",
    englishTitle: "Valves Maintenance, Overhaul & API Testing",
    slug: "valves",
    badge: "آزمون طبق API 598",
    description:
      "تعمیر، بازسازی، لپینگ و اورهال اساسی انواع ولوهای پالایشگاهی، پتروشیمی و خطوط لوله شامل Gate, Globe, Ball, Check و Control Valves به همراه میز تست هیدرواستاتیک و آزمون نشتی هوابندی (Leak Test).",
    iconName: "ShieldCheck",
    stats: [
      { label: "کلاس کاری تحت پوشش", value: "کلاس ۱۵۰ تا ۲۵۰۰ (Class 2500)" },
      { label: "استاندارد تست و آزمون", value: "API 598 / API 6D" },
      { label: "تجهیزات لپینگ نشیمنگاه", value: "دستگاه‌های تخصصی پرتابل و ثابت" },
      { label: "تست نشتی سیت و شل", value: "هیدرواستاتیک و پنوماتیک حبابی" },
    ],
    standards: ["API 598", "API 6D", "BS 6755", "ASME B16.34"],
    ctaText: "استعلام تعمیرات و تست ولوهای صنعتی",
    ctaLink: "/contact?service=valves",
    machines: [
      {
        id: "v-lapping-unit",
        name: "تجهیزات تخصصی لپینگ نشیمنگاه و دیسک (Lapping & Grinding Machines)",
        specs: "پرداخت و لایه‌برداری میکرونی آب‌بندهای فلزی سیت و بال با خمیرهای الماسه جهت حذف کامل شیارها و خراشیدگی‌ها",
        capacityHighlight: "پرداخت میکرونی بدون نشتی",
        applications: ["لپینگ سیت ولوهای صنعتی", "پرداخت گیت‌ولو و بال‌ولوهای کلاس بالا"],
        status: "available",
      },
      {
        id: "v-test-bench",
        name: "میز تست هیدرواستاتیک و نشتی‌سنجی شیرآلات طبق استانداردهای API",
        specs: "کلمپینگ هیدرولیکی دوطرفه، تست فشار هیدرواستاتیک بدنه (Shell Test) و تست آب‌بندی سیت با گاز/هوا (Seat Air Leak Test)",
        capacityHighlight: "تست دوطرفه API 598",
        applications: ["تست فشار کلاس‌های ۱۵۰ الی ۲۵۰۰", "آزمون نشتی شیرهای اطمینان PSV"],
        status: "available",
      },
      {
        id: "v-overhaul-tooling",
        name: "ابزارآلات تخصصی دمونتاژ، سنگ‌زنی استم و بوشینگ ولو",
        specs: "بازسازی ساقه‌شیر (Stem)، تعویض گسکت و پکینگ‌های نسوز، تنظیم کالیبراسیون اکچویتورهای پنوماتیک و موتوری",
        capacityHighlight: "کالیبراسیون اکچویتور",
        applications: ["اورهال شیرهای کنترل نیوماتیک", "تعمیر شیرهای دروازه‌ای و توپی نفت و گاز"],
        status: "available",
      },
    ],
  },

  // ── ۶. جوشکاری و اتصال تخصصی ──
  {
    id: "div-specialized-welding",
    number: 6,
    title: "جوشکاری و اتصال تخصصی",
    englishTitle: "Specialized Welding & Metallurgy",
    slug: "welding",
    badge: "جوش لیزر و TIG فرآیندی",
    description:
      "عملیات اتصال و روکش‌کاری سخت (Hardfacing) با استفاده از فناوری جوشکاری لیزری پرقدرت، جوش آرگون TIG، جوش الکترود دستی SMAW و جوش تحت گاز محافظ MIG/MAG همراه با رکتیفایرهای سنگین کارگاهی و نظارت بازرسان دارای گواهی NDT.",
    iconName: "Zap",
    stats: [
      { label: "روش‌های جوشکاری فعال", value: "Laser, GTAW (TIG), SMAW, GMAW" },
      { label: "گستره متریال قابل جوشکاری", value: "فولاد کربنی، زنگ‌نزن، اینکونل، مونل، داپلکس" },
      { label: "روکش‌کاری و سخت‌کاری", value: "Hardfacing مقاوم در برابر سایش شدید" },
      { label: "کنترل کیفی و تست", value: "دستورالعمل جوشکاری WPS/PQR و NDT" },
    ],
    standards: ["ASME Sec IX", "AWS D1.1", "ISO 3834"],
    ctaText: "استعلام پروژه‌های جوشکاری و سخت‌کاری آلیاژی",
    ctaLink: "/contact?service=welding",
    machines: [
      {
        id: "w-laser-welder",
        name: "دستگاه‌های جوشکاری پیوسته لیزری (Fiber Laser Welding System)",
        specs: "جوشکاری عمیق و دقیق قطعات حساس صنعتی با کمترین تغییر فرم هندسی، بدون نیاز به فیلرمتال و عمق نفوذ بالا",
        capacityHighlight: "نفوذ عمیق بدون دفرمگی",
        applications: ["جوشکاری پروانه‌ها و قطعات آب‌بند", "تعمیر شیارهای حساس شفت"],
        status: "available",
      },
      {
        id: "w-tig-smaw-mig",
        name: "واحدهای جوشکاری تخصصی TIG (آرگون)، SMAW و MIG/MAG",
        specs: "جوشکاری پاس ریشه و پرکننده لوله‌ها، فلنج‌ها و اتصالات مخازن با گاز محافظ آرگون و میکس برای متریال‌های ضدزنگ و سوپرآلیاژ",
        capacityHighlight: "پاس ریشه با کیفیت رادیوگرافی",
        applications: ["جوشکاری لوله‌ها و تیوب‌شیت مبدل", "پایپینگ فشار قوی", "اتصالات سازه‌ای"],
        status: "available",
      },
      {
        id: "w-industrial-rectifiers",
        name: "رکتیفایرهای سنگین صنعتی چندمنظوره با جریان بالا",
        specs: "تأمین قوس پایدار با پاشش حداقلی برای الکترودهای سلولزی، قلیایی و ضدسایش در شیفت‌های کاری طولانی‌مدت کارگاهی",
        capacityHighlight: "قوس پایدار در جریان سنگین",
        applications: ["سخت‌کاری سطحی پروانه‌های پمپ", "جوشکاری شاسی‌های سنگین فولادی"],
        status: "available",
      },
    ],
  },

  // ── ۷. تمیزکاری، آماده‌سازی سطح و رنگ ──
  {
    id: "div-surface-coating",
    number: 7,
    title: "آماده‌سازی سطح، وت‌بلاست و رنگ صنعتی",
    englishTitle: "Surface Preparation, Blasting & Industrial Coating",
    slug: "surface-coating",
    badge: "وت‌بلاست بدون غبار و اتاق رنگ",
    description:
      "آماده‌سازی پیشرفته سطح فلزات به درجه Sa 2.5 و Sa 3 با دستگاه‌های تمیزکاری لیزری، سامانه‌های وت‌بلاست مرطوب پرتابل، سندبلاست خشک، پاشش رنگ با ایرلس و اعمال پوشش‌های اپوکسی چندلایه داخل اتاق رنگ اختصاصی کارخانه.",
    iconName: "Paintbrush",
    stats: [
      { label: "درجه تمیزی سطح حاصله", value: "استاندارد Sa 2.5 و Sa 3" },
      { label: "سامانه آماده‌سازی سبز", value: "دستگاه لیزر کلینینگ و وت‌بلاست بدون غبار" },
      { label: "روش اعمال رنگ", value: "سیستم پاشش بدون هوا (Airless)" },
      { label: "محیط اعمال پوشش", value: "اتاق رنگ صنعتی با فیلتراسیون هوا" },
    ],
    standards: ["SSPC-SP10 / NACE No. 2", "ISO 8501-1", "ISO 12944"],
    ctaText: "استعلام خدمات وت‌بلاست و رنگ‌آمیزی صنعتی",
    ctaLink: "/contact?service=surface-coating",
    machines: [
      {
        id: "s-laser-cleaner",
        name: "دستگاه پیشرفته تمیزکاری و زنگ‌زدایی لیزری (Laser Cleaning)",
        specs: "حذف آنی اکسیدها، رنگ‌های قدیمی و چربی از سطوح فلزی با پالس‌های لیزر، کاملاً عاری از پسماندهای شیمیایی و بدون سایش متریال پایه",
        capacityHighlight: "پاکسازی بدون آسیب به فلز",
        applications: ["آماده‌سازی محل‌های جوشکاری", "رسوب‌زدایی سیت و قطعات حساس ولو و پمپ"],
        status: "available",
      },
      {
        id: "s-wet-blast",
        name: "دستگاه‌های وت‌بلاست پرتابل اختصاصی هزاره کالا (Dustless Wet Blast)",
        specs: "سندبلاست مرطوب بدون غبار با مخلوط آب و مواد ساینده جهت کاربری در مناطق عملیاتی و پالایشگاهی بدون توقف خطوط مجاور",
        capacityHighlight: "۹۵٪ کاهش گرد و غبار",
        applications: ["زنگ‌زدایی خطوط لوله و مخازن", "آماده‌سازی بدنه شناورها در اسکله"],
        status: "available",
      },
      {
        id: "s-sandblast",
        name: "واحد سندبلاست کارگاهی با سیستم مکش و تهویه هوا",
        specs: "پرتاب ذرات ساینده سیلیس و مس‌باره با فشار باد کمپرسور جهت دستیابی به پروفایل زبری (Anchor Pattern) ایده‌آل چسبندگی رنگ",
        capacityHighlight: "زبری پروفایل استاندارد",
        applications: ["آماده‌سازی استراکچرهای فولادی", "شاسی‌ها و مخازن پیش از آستری"],
        status: "available",
      },
      {
        id: "s-airless",
        name: "پمپ‌های پاشش رنگ بدون هوا ایرلس هیدرولیک و بادی (Airless Sprayers)",
        specs: "اعمال یکنواخت رنگ‌های سنگین پلی‌اورتان، زینک ریچ اپوکسی، فنولیک و گلس‌فلیک با ضخامت فیلم تر بالا و بدون افت فشار",
        capacityHighlight: "پوشش یکدست با ضخامت بالا",
        applications: ["رنگ‌آمیزی بدنه پمپ‌ها و مخازن", "سیستم‌های حفاظتی سه‌لایه دریایی"],
        status: "available",
      },
      {
        id: "s-paint-booth",
        name: "اتاق رنگ صنعتی استاندارد مجهز به سیستم تهویه و حرارت",
        specs: "محیط کنترل‌شده بدون گرد و خاک با گردش هوای فیلترشده و پایش مداوم رطوبت نسبی و دما جهت پخت استاندارد پوشش‌های صنعتی",
        capacityHighlight: "محیط کاملاً کنترل‌شده و پاک",
        applications: ["پوشش‌دهی نهایی تجهیزات تولیدی", "خشک‌کنی سریع پوشش‌های مقاوم شیمیایی"],
        status: "available",
      },
    ],
  },
];

/**
 * Factory Infrastructure & Credentials
 */
export const FACTORY_INFRASTRUCTURE = {
  location: "استان خوزستان، منطقه آزاد اروند، شهرک صنعتی شماره یک آبادان",
  landArea: "۴۰۰۰ متر مربع محوطه صنعتی و سالن‌های سرپوشیده تولید",
  liftingCapacity: "جرثقیل سقفی ۲۰ تن در سالن اصلی ساخت و ماشین‌کاری سنگین",
  powerBackup: "دیزل ژنراتور اضطراری ۴۰۰ کاوا جهت استمرار شبانه‌روزی خطوط تولید",
  testingFacility: "ایستگاه مرکزی آزمون هیدرولیک و هیدرواستاتیک مجهز به گیج‌های معتبر",
  standards: [
    "ASME Sec VIII & IX",
    "API 610 & API 598",
    "TEMA Class R, C, B",
    "ISO 9001:2015 Quality Management",
    "ISO 45001:2018 HSE Management",
  ],
};
