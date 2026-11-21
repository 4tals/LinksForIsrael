import {
	ENGLISH_INITIATIVES,
	EnglishInitiative,
} from "@/app/components/EnglishPortal/englishInitiatives";
import {
	computeInitiativeRankScore,
	getCategories,
	InitiativeLink,
} from "@/app/utils/categories";

export type PortalLocale = "en" | "ar" | "ru";

export interface IntlInitiativeItem {
	id: string;
	name: string;
	category: "donate" | "rehab" | "volunteer" | "advocacy";
	categoryLabel: string;
	summary: string;
	url: string;
	tags: string[];
	us501c3?: boolean;
}

export interface EnrichedIntlInitiative extends IntlInitiativeItem {
	link: InitiativeLink;
	sharePath?: string;
	rankScore: number;
}

export interface IntlHotline {
	name: string;
	subtitle: string;
	number: string;
	href: string;
}

export interface IntlPortalConfig {
	locale: PortalLocale;
	dir: "ltr" | "rtl";
	badgeOpenSource: string;
	badgeCountTemplate: string;
	heading: string;
	subtitle: string;
	searchPlaceholder: string;
	hebrewButtonLabel: string;
	shareViewLabel: string;
	viewCopiedTitle: string;
	viewCopiedDesc: string;
	cardCopiedTitle: string;
	noResultsText: string;
	resetFiltersLabel: string;
	visitWebsiteLabel: string;
	detailsSourcesLabel: string;
	hotlinesHeading: string;
	ctaHeading: string;
	ctaBody: string;
	ctaMethodologyLabel: string;
	ctaButtonLabel: string;
	categories: Array<{ id: string; label: string }>;
	hotlines: IntlHotline[];
}

// Flagship orgs with verified US 501(c)(3) / American Friends / JGive-US tax-deductible pathways
export const US_501C3_IDS = new Set([
	"Latet",
	"JGive",
	"PitchonLev",
	"BrothersForLife",
	"NATAL",
	"ERAN",
	"LeketIsrael",
	"LeketIsraelMain",
	"HashomerHaChadash",
	"Yedidim",
	"KremboWings",
	"Elem",
	"YadSarah",
	"EzerMizion",
	"UnitedHatzalah",
	"ZAKA",
	"IsraeliChildrensFund",
	"LargerThanLife",
	"Enosh",
	"IsraelTraumaCoalition",
	"ALUT",
	"ADIIsrael",
	"Etgarim",
	"ZikaronBaSalon",
]);

export const EN_ITEMS: IntlInitiativeItem[] = ENGLISH_INITIATIVES.map(
	(item: EnglishInitiative) => ({
		...item,
		us501c3: US_501C3_IDS.has(item.id),
	}),
);

export const AR_ITEMS: IntlInitiativeItem[] = [
	{
		id: "ERAN",
		name: "عيران (ERAN) — الإسعاف النفسي الأولي 1201",
		category: "rehab",
		categoryLabel: "الصحة النفسية والطوارئ",
		summary:
			"خط دعم نفسي مجاني وسري على مدار الساعة (24/7) باللغة العربية والعبرية والروسية والإنجليزية لجميع سكان إسرائيل.",
		url: "https://www.eran.org.il/",
		tags: ["دعم نفسي", "طوارئ", "1201", "عربي", "24/7"],
	},
	{
		id: "NATAL",
		name: "نطال (NATAL) — مركز الصدمات والمرونة",
		category: "rehab",
		categoryLabel: "الصحة النفسية والطوارئ",
		summary:
			"خط مساعدة 24/7 وعلاج نفسي متخصص للمتضررين من الصدمات النفسية والقلق وحالات الطوارئ.",
		url: "https://www.natal.org.il/",
		tags: ["صدمات", "علاج نفسي", "1-800-363-363"],
	},
	{
		id: "ARCCI1202",
		name: "مراكز مساعدة ضحايا الاعتداء الجنسي (1202 / 1203)",
		category: "rehab",
		categoryLabel: "الصحة النفسية والطوارئ",
		summary:
			"خطوط طوارئ سرية على مدار الساعة للنساء (1202) والرجال (1203)، بما في ذلك خط مخصص باللغة العربية (04-6566813).",
		url: "https://1202.org.il/",
		tags: ["طوارئ", "1202", "دعم", "عربي"],
	},
	{
		id: "UnitedHatzalah",
		name: "إيحود هتسالا — الإسعاف الطبي التطوعي (1221)",
		category: "donate",
		categoryLabel: "الصحة والإغاثة",
		summary:
			"شبكة وطنية من المسعفين المتطوعين من جميع فئات المجتمع للاستجابة الطبية الفورية مجاناً خلال دقائق.",
		url: "https://1221.org.il/",
		tags: ["إسعاف", "طوارئ", "1221", "تطوع"],
	},
	{
		id: "YadSarah",
		name: "يد سارة (Yad Sarah) — إعارة المعدات الطبية",
		category: "donate",
		categoryLabel: "الصحة والإغاثة",
		summary:
			"أكبر شبكة في إسرائيل لإعارة الكراسي المتحركة والأسرّة الطبية والمعدات الصحية مجاناً لجميع المواطنين.",
		url: "https://yad-sarah.net/",
		tags: ["معدات طبية", "كبار السن", "إعارة مجانية"],
	},
	{
		id: "Yedidim",
		name: "يديديم (Yedidim) — المساعدة على الطرق (1230)",
		category: "volunteer",
		categoryLabel: "التطوع والحقوق والمجتمع",
		summary:
			"شبكة متطوعين قطرية تقدم مساعدة فورية ومجانية على الطرق وفي المنازل (بنشر، بطارية، فتح سيارة).",
		url: "https://yedidim-il.org/",
		tags: ["طرق", "1230", "مساعدة مجانية", "تطوع"],
	},
	{
		id: "KavLaOved",
		name: "عنوان العامل (Kav LaOved) — حقوق العمال",
		category: "volunteer",
		categoryLabel: "التطوع والحقوق والمجتمع",
		summary:
			"منظمة غير ربحية لحماية حقوق العمال في إسرائيل، مع استشارات ومعلومات كاملة باللغة العربية.",
		url: "https://www.kavlaoved.org.il/",
		tags: ["حقوق العمال", "استشارة قانونية", "عربي"],
	},
	{
		id: "RuachTova",
		name: "روح طوفا (Ruach Tova) — منصة التطوع القطرية",
		category: "volunteer",
		categoryLabel: "التطوع والحقوق والمجتمع",
		summary:
			"المنصة الأكبر في إسرائيل للربط بين المتطوعين والجمعيات المحلية في كافة البلدات والمجالات.",
		url: "https://www.ruachtova.org.il/",
		tags: ["تطوع", "جمعيات", "مجتمع"],
	},
	{
		id: "Latet",
		name: "لاتيت (Latet) — المساعدات الغذائية والإنسانية",
		category: "donate",
		categoryLabel: "الصحة والإغاثة",
		summary:
			"أكبر منظمة إنسانية في إسرائيل لتقديم الطرود الغذائية والمساعدات للعائلات المحتاجة وكبار السن.",
		url: "https://www.latet.org.il/",
		tags: ["غذاء", "عائلات", "مساعدات"],
	},
	{
		id: "LeketIsraelMain",
		name: "ليكت إسرائيل (Leket Israel) — بنك الغذاء الوطني",
		category: "donate",
		categoryLabel: "الصحة والإغاثة",
		summary:
			"إنقاذ الفائض الغذائي والزراعي وتوزيع وجبات مغذية عبر مئات الجمعيات الشريكة في جميع أنحاء البلاد.",
		url: "https://www.leket.org/",
		tags: ["غذاء", "زراعة", "مساعدات"],
	},
	{
		id: "Enosh",
		name: "إنوش (Enosh) — الجمعية الإسرائيلية للصحة النفسية",
		category: "rehab",
		categoryLabel: "الصحة النفسية والطوارئ",
		summary:
			"خدمات تأهيل مجتمعي، سكن، تشغيل، ومراكز دعم للشباب والعائلات التي تواجه تحديات نفسية.",
		url: "https://www.enosh.org.il/",
		tags: ["صحة نفسية", "تأهيل", "عائلات"],
	},
	{
		id: "ALUT",
		name: "ألوط (ALUT) — الجمعية القطرية للأطفال والبالغين ذوي التوحد",
		category: "rehab",
		categoryLabel: "الصحة النفسية والطوارئ",
		summary:
			"مراكز رعاية وتأهيل وإرشاد للعائلات والأطفال والبالغين على طيف التوحد في جميع أنحاء إسرائيل.",
		url: "https://alut.org.il/",
		tags: ["توحد", "عائلات", "تأهيل"],
	},
	{
		id: "Elem",
		name: "إيلم (ELEM) — دعم الشباب في ضائقة",
		category: "volunteer",
		categoryLabel: "التطوع والحقوق والمجتمع",
		summary:
			"مراكز آمنة، استشارات، ومرافقة للشباب والفتيان في حالات الخطر أو الضائقة النفسية والاجتماعية.",
		url: "https://elem.org.il/",
		tags: ["شباب", "دعم", "استشارة"],
	},
	{
		id: "LargerThanLife",
		name: "أكبر من الحياة (Larger Than Life) — دعم الأطفال مرضى السرطان",
		category: "donate",
		categoryLabel: "الصحة والإغاثة",
		summary:
			"تحسين جودة حياة الأطفال مرضى السرطان وعائلاتهم من جميع الأديان والخلفيات في إسرائيل.",
		url: "https://gdolim.org.il/",
		tags: ["أطفال", "سرطان", "صحة"],
	},
	{
		id: "Paamonim",
		name: "فعامونيم (Paamonim) — الإرشاد المالي المجاني للعائلات",
		category: "volunteer",
		categoryLabel: "التطوع والحقوق والمجتمع",
		summary:
			"مرافقة اقتصادية مجانية ومهنية للعائلات والأفراد لتحقيق الاستقرار المالي وإدارة الميزانية.",
		url: "https://www.paamonim.org/",
		tags: ["إرشاد مالي", "ميزانية", "عائلات"],
	},
	{
		id: "KremboWings",
		name: "أجنحة كريمبو (Krembo Wings) — حركة شبابية دامجة",
		category: "volunteer",
		categoryLabel: "التطوع والحقوق والمجتمع",
		summary:
			"حركة شبابية تجمع الأطفال والشباب ذوي الاحتياجات الخاصة وأقرانهم في عشرات الفروع بالبلاد.",
		url: "https://www.krembo.org.il/",
		tags: ["دمج", "شباب", "تطوع"],
	},
];

export const RU_ITEMS: IntlInitiativeItem[] = [
	{
		id: "ERAN",
		name: "ЭРАН (ERAN) — Первая психологическая помощь 1201",
		category: "rehab",
		categoryLabel: "Психологическая помощь и экстренные службы",
		summary:
			"Бесплатная и анонимная круглосуточная горячая линия психологической поддержки на русском, иврите, арабском и английском языках.",
		url: "https://www.eran.org.il/",
		tags: ["психологическая помощь", "1201", "24/7", "русский"],
	},
	{
		id: "NATAL",
		name: "НАТАЛЬ (NATAL) — Центр помощи при травме и стрессе",
		category: "rehab",
		categoryLabel: "Психологическая помощь и экстренные службы",
		summary:
			"Круглосуточная линия помощи (1-800-363-363) и профессиональная терапия для пострадавших от травмы и тревоги.",
		url: "https://www.natal.org.il/",
		tags: ["травма", "ПТСР", "1-800-363-363", "терапия"],
	},
	{
		id: "ARCCI1202",
		name: "Центры помощи пострадавшим от сексуального насилия (1202 / 1203)",
		category: "rehab",
		categoryLabel: "Психологическая помощь и экстренные службы",
		summary:
			"Анонимные круглосуточные линии поддержки для женщин (1202) и мужчин (1203), юридическое и психологическое сопровождение.",
		url: "https://1202.org.il/",
		tags: ["кризис", "1202", "поддержка"],
	},
	{
		id: "UnitedHatzalah",
		name: "Ихуд Ацала (United Hatzalah) — Экстренная медпомощь (1221)",
		category: "donate",
		categoryLabel: "Медицина и гуманитарная помощь",
		summary:
			"Всеизраильская сеть волонтёров-парамедиков 24/7, прибывающих на экстренные вызовы за считанные минуты.",
		url: "https://1221.org.il/",
		tags: ["медицина", "1221", "скорая", "экстренно"],
	},
	{
		id: "YadSarah",
		name: "Яд Сара (Yad Sarah) — Бесплатный прокат медоборудования",
		category: "donate",
		categoryLabel: "Медицина и гуманитарная помощь",
		summary:
			"Крупнейшая в Израиле сеть бесплатной выдачи инвалидных колясок, медицинских кроватей и тревожных кнопок для пожилых.",
		url: "https://yad-sarah.net/",
		tags: ["медоборудование", "пожилые", "бесплатно"],
	},
	{
		id: "EzerMizion",
		name: "Эзер Мицион (Ezer Mizion) — Помощь онкопациентам и семьям",
		category: "donate",
		categoryLabel: "Медицина и гуманитарная помощь",
		summary:
			"Крупнейший в мире еврейский регистр доноров костного мозга, медицинские перевозки и горячее питание в больницах.",
		url: "https://www.ami.org.il/",
		tags: ["онкология", "донорство", "медицина"],
	},
	{
		id: "Yedidim",
		name: "Едидим (Yedidim) — Бесплатная помощь на дорогах (1230)",
		category: "volunteer",
		categoryLabel: "Волонтёрство, права и сообщество",
		summary:
			"Всеизраильская сеть волонтёров, бесплатно помогающая водителям и жителям (аккумулятор, колесо, захлопнутая дверь).",
		url: "https://yedidim-il.org/",
		tags: ["дороги", "1230", "волонтёры"],
	},
	{
		id: "KavLaOved",
		name: "Кав ла-Овед (Kav LaOved) — Защита прав работников",
		category: "volunteer",
		categoryLabel: "Волонтёрство, права и сообщество",
		summary:
			"Правозащитная организация, предоставляющая консультации и информацию о трудовых правах в Израиле (включая репатриантов).",
		url: "https://www.kavlaoved.org.il/",
		tags: ["права", "работа", "репатрианты", "консультация"],
	},
	{
		id: "Paamonim",
		name: "Паамоним (Paamonim) — Бесплатное финансовое сопровождение",
		category: "volunteer",
		categoryLabel: "Волонтёрство, права и сообщество",
		summary:
			"Бесплатная помощь семьям и частным лицам в планировании бюджета, выходе из долгов и финансовой устойчивости.",
		url: "https://www.paamonim.org/",
		tags: ["финансы", "бюджет", "семьи"],
	},
	{
		id: "RuachTova",
		name: "Руах Това (Ruach Tova) — Платформа волонтёрства",
		category: "volunteer",
		categoryLabel: "Волонтёрство, права и сообщество",
		summary:
			"Крупнейший в Израиле сервис подбора волонтёрских программ в проверенных НКО по всей стране.",
		url: "https://www.ruachtova.org.il/",
		tags: ["волонтёрство", "НКО", "сообщество"],
	},
	{
		id: "Latet",
		name: "Латет (Latet) — Продовольственная и гуманитарная помощь",
		category: "donate",
		categoryLabel: "Медицина и гуманитарная помощь",
		summary:
			"Крупнейшая гуманитарная организация Израиля, помогающая нуждающимся семьям и пережившим Холокост.",
		url: "https://www.latet.org.il/",
		tags: ["продукты", "помощь", "пожилые"],
	},
	{
		id: "LeketIsraelMain",
		name: "Лекет Исраэль (Leket Israel) — Национальный банк еды",
		category: "donate",
		categoryLabel: "Медицина и гуманитарная помощь",
		summary:
			"Спасение излишков сельхозпродукции и готовой еды с последующей раздачей нуждающимся через сотни местных НКО.",
		url: "https://www.leket.org/",
		tags: ["еда", "сельское хозяйство", "волонтёрство"],
	},
	{
		id: "Enosh",
		name: "Энош (Enosh) — Ассоциация психического здоровья",
		category: "rehab",
		categoryLabel: "Психологическая помощь и экстренные службы",
		summary:
			"Реабилитационные программы, трудоустройство, жильё и центры поддержки для молодёжи и семей.",
		url: "https://www.enosh.org.il/",
		tags: ["психическое здоровье", "реабилитация", "семьи"],
	},
	{
		id: "ALUT",
		name: "АЛУТ (ALUT) — Поддержка детей и взрослых с аутизмом",
		category: "rehab",
		categoryLabel: "Психологическая помощь и экстренные службы",
		summary:
			"Семейные центры, реабилитационные сады, сопровождение и программы занятости для людей с РАС.",
		url: "https://alut.org.il/",
		tags: ["аутизм", "дети", "реабилитация"],
	},
	{
		id: "Elem",
		name: "ЭЛЕМ (ELEM) — Помощь подросткам в трудной ситуации",
		category: "volunteer",
		categoryLabel: "Волонтёрство, права и сообщество",
		summary:
			"Безопасные пространства, психологические консультации и поддержка молодёжи по всему Израилю.",
		url: "https://elem.org.il/",
		tags: ["подростки", "поддержка", "консультация"],
	},
	{
		id: "LargerThanLife",
		name: "Больше чем жизнь (Gdolim MeHaChaim) — Помощь детям с онкологией",
		category: "donate",
		categoryLabel: "Медицина и гуманитарная помощь",
		summary:
			"Улучшение качества жизни и поддержка семей детей, проходящих лечение от онкологических заболеваний.",
		url: "https://gdolim.org.il/",
		tags: ["дети", "онкология", "медицина"],
	},
];

export const PORTAL_CONFIGS: Record<PortalLocale, IntlPortalConfig> = {
	en: {
		locale: "en",
		dir: "ltr",
		badgeOpenSource: "Open Source · Live MOJ Registry Verified",
		badgeCountTemplate: "{count} Flagship Organizations",
		heading: "Links For Israel — Support, Volunteer & Donate",
		subtitle:
			"A curated, open-source directory of verified Israeli charities, mental health & veteran rehabilitation centers, volunteering networks, and remembrance archives — verified against Israel's Ministry of Justice (data.gov.il) and independent press.",
		searchPlaceholder: "Search charities, 501(c)(3), volunteering, hotlines...",
		hebrewButtonLabel: "לפורטל המלא בעברית (115+ יוזמות)",
		shareViewLabel: "Share view",
		viewCopiedTitle: "View link copied",
		viewCopiedDesc: "Anyone opening this link will see your exact filters.",
		cardCopiedTitle: "Card link copied",
		noResultsText: "No organizations matched your current filters.",
		resetFiltersLabel: "Reset filters",
		visitWebsiteLabel: "Visit Website",
		detailsSourcesLabel: "Details & Sources",
		hotlinesHeading: "24/7 National Emergency & Crisis Hotlines:",
		ctaHeading: "Know a verified Israeli organization we should add?",
		ctaBody:
			"Links For Israel is 100% open source and community-maintained on GitHub.",
		ctaMethodologyLabel: "Read how we verify & rank initiatives.",
		ctaButtonLabel: "Suggest an Organization on GitHub",
		categories: [
			{ id: "all", label: "All Resources" },
			{ id: "donate", label: "Humanitarian & Donations" },
			{ id: "rehab", label: "Veterans & Mental Health" },
			{ id: "volunteer", label: "Volunteering & Community" },
			{ id: "advocacy", label: "Advocacy & Remembrance" },
		],
		hotlines: [
			{
				name: "ERAN",
				subtitle: "Mental Health 24/7",
				number: "1201",
				href: "tel:1201",
			},
			{
				name: "NATAL",
				subtitle: "Trauma Support",
				number: "1-800-363-363",
				href: "tel:1800363363",
			},
			{
				name: "United Hatzalah",
				subtitle: "EMS",
				number: "1221",
				href: "tel:1221",
			},
			{
				name: "Yedidim",
				subtitle: "Roadside",
				number: "1230",
				href: "tel:1230",
			},
			{
				name: "Home Front",
				subtitle: "Emergency Info",
				number: "104",
				href: "tel:104",
			},
			{ name: "MDA", subtitle: "Ambulance", number: "101", href: "tel:101" },
		],
	},
	ar: {
		locale: "ar",
		dir: "rtl",
		badgeOpenSource: "مفتوح المصدر · موثق رسمياً",
		badgeCountTemplate: "{count} منظمة وخدمة معتمدة",
		heading: "لينك لإسرائيل — بوابة الطوارئ والدعم والجمعيات المعتمدة",
		subtitle:
			"دليل مفتوح المصدر ومجاني لخطوط الطوارئ والدعم النفسي، الجمعيات المعتمدة رسمياً في وزارة العدل (data.gov.il)، حقوق العمال، والتطوع في إسرائيل — في الأوقات العادية وحالات الطوارئ.",
		searchPlaceholder: "ابحث عن دعم نفسي، طوارئ، حقوق، تطوع...",
		hebrewButtonLabel: "البوابة الكاملة بالعبرية",
		shareViewLabel: "مشاركة العرض",
		viewCopiedTitle: "تم نسخ رابط العرض",
		viewCopiedDesc: "سيفتح الرابط بنفس الفلاتر والنتائج الحالية.",
		cardCopiedTitle: "تم نسخ رابط البطاقة",
		noResultsText: "لم يتم العثور على منظمات مطابقة لبحثك.",
		resetFiltersLabel: "إعادة تعيين الفلاتر",
		visitWebsiteLabel: "زيارة الموقع",
		detailsSourcesLabel: "التفاصيل والمصادر",
		hotlinesHeading: "خطوط الطوارئ والمساعدة الفورية 24/7:",
		ctaHeading: "هل تعرف جمعية أو مبادرة موثوقة ينبغي إضافتها؟",
		ctaBody:
			"المشروع مفتوح المصدر بالكامل وتديره المبادرة المجتمعية عبر GitHub.",
		ctaMethodologyLabel: "كيف نتحقق من الجمعيات ونرتبها؟",
		ctaButtonLabel: "اقترح منظمة عبر GitHub",
		categories: [
			{ id: "all", label: "جميع الخدمات" },
			{ id: "rehab", label: "الصحة النفسية والطوارئ" },
			{ id: "donate", label: "الصحة والإغاثة" },
			{ id: "volunteer", label: "التطوع والحقوق والمجتمع" },
		],
		hotlines: [
			{
				name: "عيران (ERAN)",
				subtitle: "دعم نفسي بالعربية 24/7",
				number: "1201",
				href: "tel:1201",
			},
			{
				name: "نطال (NATAL)",
				subtitle: "طوارئ وصدمات",
				number: "1-800-363-363",
				href: "tel:1800363363",
			},
			{
				name: "إيحود هتسالا",
				subtitle: "إسعاف طبي",
				number: "1221",
				href: "tel:1221",
			},
			{
				name: "يديديم",
				subtitle: "مساعدة طرق",
				number: "1230",
				href: "tel:1230",
			},
			{
				name: "الجبهة الداخلية",
				subtitle: "معلومات طوارئ",
				number: "104",
				href: "tel:104",
			},
			{ name: "نجمة داوود", subtitle: "إسعاف", number: "101", href: "tel:101" },
		],
	},
	ru: {
		locale: "ru",
		dir: "ltr",
		badgeOpenSource: "Открытый код · Проверено в реестре Минюста",
		badgeCountTemplate: "{count} проверенных организаций",
		heading: "Links For Israel — Справочник помощи, экстренных линий и НКО",
		subtitle:
			"Открытый каталог проверенных израильских благотворительных фондов, круглосуточных линий психологической поддержки, защиты прав работников и волонтёрских сетей — проверено через официальный реестр data.gov.il.",
		searchPlaceholder: "Поиск помощи, горячих линий, прав, волонтёрства...",
		hebrewButtonLabel: "Полный портал на иврите",
		shareViewLabel: "Поделиться",
		viewCopiedTitle: "Ссылка скопирована",
		viewCopiedDesc: "Ссылка сохраняет выбранные фильтры и карточку.",
		cardCopiedTitle: "Ссылка на карточку скопирована",
		noResultsText: "По заданным фильтрам организации не найдены.",
		resetFiltersLabel: "Сбросить фильтры",
		visitWebsiteLabel: "Открыть сайт",
		detailsSourcesLabel: "Подробнее и источники",
		hotlinesHeading: "Круглосуточные горячие линии в Израиле (24/7):",
		ctaHeading: "Знаете проверенную организацию, которую стоит добавить?",
		ctaBody: "Links For Israel — открытый общественный проект на GitHub.",
		ctaMethodologyLabel: "Как мы проверяем организации.",
		ctaButtonLabel: "Предложить организацию на GitHub",
		categories: [
			{ id: "all", label: "Все ресурсы" },
			{ id: "rehab", label: "Психологическая помощь и экстренные службы" },
			{ id: "donate", label: "Медицина и гуманитарная помощь" },
			{ id: "volunteer", label: "Волонтёрство, права и сообщество" },
		],
		hotlines: [
			{
				name: "ЭРАН (ERAN)",
				subtitle: "Психолог 24/7 (рус.)",
				number: "1201",
				href: "tel:1201",
			},
			{
				name: "НАТАЛЬ",
				subtitle: "Помощь при травме",
				number: "1-800-363-363",
				href: "tel:1800363363",
			},
			{
				name: "Ихуд Ацала",
				subtitle: "Экстренная медицина",
				number: "1221",
				href: "tel:1221",
			},
			{
				name: "Едидим",
				subtitle: "Помощь на дорогах",
				number: "1230",
				href: "tel:1230",
			},
			{
				name: "Командование тыла",
				subtitle: "Информация",
				number: "104",
				href: "tel:104",
			},
			{
				name: "МАДА",
				subtitle: "Скорая помощь",
				number: "101",
				href: "tel:101",
			},
		],
	},
};

function normalizeHost(url?: string): string | null {
	if (!url) return null;
	try {
		return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
	} catch {
		return null;
	}
}

export async function getEnrichedIntlInitiatives(
	locale: PortalLocale,
): Promise<EnrichedIntlInitiative[]> {
	const categories = await getCategories();
	const sourceItems =
		locale === "ar" ? AR_ITEMS : locale === "ru" ? RU_ITEMS : EN_ITEMS;

	const byName = new Map<string, { link: InitiativeLink; sharePath: string }>();
	const byHost = new Map<string, { link: InitiativeLink; sharePath: string }>();

	for (const cat of categories) {
		for (const sub of cat.subCategories) {
			for (const link of sub.links) {
				const entry = {
					link,
					sharePath: `/${encodeURIComponent(cat.id)}/${encodeURIComponent(
						sub.name,
					)}/${encodeURIComponent(link.name)}`,
				};
				byName.set(link.name.toLowerCase(), entry);
				const host = normalizeHost(link.url || link.website);
				if (host && !byHost.has(host)) {
					byHost.set(host, entry);
				}
			}
		}
	}

	return sourceItems
		.map((item) => {
			const matched =
				byName.get(item.id.toLowerCase()) ||
				byHost.get(normalizeHost(item.url) || "");
			const source = matched?.link;

			const mergedLink: InitiativeLink = {
				...(source || {}),
				name: source?.name || item.id,
				displayName: item.name,
				shortDescription: item.summary,
				description: undefined,
				url: item.url,
				website: item.url,
				tags: item.tags,
				us501c3: item.us501c3 || source?.us501c3,
			};

			return {
				...item,
				link: mergedLink,
				sharePath: matched?.sharePath,
				rankScore: computeInitiativeRankScore(mergedLink),
			};
		})
		.sort((a, b) => b.rankScore - a.rankScore);
}
