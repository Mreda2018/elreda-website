/* ============================================================
   Elreda Assistant — knowledge base (English)
   Loaded before chat.js; sets window.ELREDA_KB
   Every answer is hand-written and matches the site. No external calls.
   ============================================================ */
(function () {
  'use strict';

  var WA = '201050020785';

  var SYN = {
    'pricing': 'price', 'prices': 'price', 'cost': 'price', 'costs': 'price',
    'quote': 'price', 'quotation': 'price', 'budget': 'price', 'fee': 'price',
    'fees': 'price', 'charge': 'price',
    'afford': 'price', 'expensive': 'price', 'cheap': 'price', 'pricelist': 'price',
    'logo': 'logo', 'brand': 'identity', 'branding': 'identity',
    'identity': 'identity', 'rebrand': 'identity',
    'printing': 'print', 'printer': 'print', 'printed': 'print',
    'cards': 'cards', 'card': 'cards', 'businesscard': 'cards',
    'website': 'website', 'websites': 'website', 'web': 'website',
    'site': 'website', 'page': 'website', 'pages': 'website',
    'shop': 'store', 'ecommerce': 'store', 'store': 'store',
    'selling': 'store', 'sell': 'store', 'cart': 'store',
    'erp': 'accounting', 'accounting': 'accounting', 'bookkeeping': 'accounting',
    'accounts': 'accounting', 'software': 'accounting', 'system': 'accounting',
    'tax': 'tax', 'taxes': 'tax', 'vat': 'tax', 'invoice': 'invoice',
    'invoices': 'invoice', 'invoicing': 'invoice', 'einvoice': 'invoice',
    'faktra': 'faktra',
    'social': 'social', 'instagram': 'social', 'facebook': 'social',
    'posts': 'social', 'post': 'social',
    'uae': 'uae', 'emirates': 'uae', 'dubai': 'uae', 'abudhabi': 'uae',
    'sharjah': 'uae', 'gulf': 'gulf', 'saudi': 'gulf', 'riyadh': 'gulf',
    'qatar': 'gulf', 'kuwait': 'gulf', 'oman': 'gulf', 'bahrain': 'gulf',
    'timeline': 'time', 'duration': 'time', 'deadline': 'time',
    'delivery': 'time', 'deliver': 'time', 'long': 'time', 'fast': 'time',
    'package': 'packages', 'packages': 'packages', 'bundle': 'packages',
    'deal': 'packages', 'offer': 'packages',
    'discount': 'discount', 'cheaper': 'discount', 'negotiate': 'discount',
    'portfolio': 'work', 'samples': 'work', 'examples': 'work',
    'previous': 'work', 'projects': 'work',
    'phone': 'contact', 'number': 'contact', 'call': 'contact',
    'whatsapp': 'contact', 'email': 'contact', 'reach': 'contact',
    'contact': 'contact', 'talk': 'contact',
    'where': 'location', 'address': 'location', 'located': 'location',
    'office': 'location', 'based': 'location',
    'hours': 'hours', 'open': 'hours', 'working': 'hours'
  };

  var E = [];
  function add(id, k, a, chips, cta) {
    E.push({ id: id, k: k, a: a, chips: chips || null, cta: cta || null });
  }

  /* ---------------- Company & contact ---------------- */
  add('about',
    'who are you company about elreda agency what do you do services overview business',
    '<b>Elreda Advertising</b> is an Egyptian creative agency based in Ebshan, Bila, Kafr El-Sheikh, working with clients across <b>Egypt, the UAE and the Gulf</b>.<br>We cover five services under one roof: <b>design and brand identity</b> · <b>printing</b> · <b>web development</b> · <b>software solutions and AI for business</b> · <b>accounting and tax systems</b>.',
    ['See all services', 'Pricing', 'Our work']);

  add('contact',
    'contact reach how to get in touch numbers',
    'You can reach us any time:<br>📞 <b>Egypt:</b> +20 105 002 0785 (same number on WhatsApp)<br>📞 <b>UAE:</b> +971 55 240 3650<br>🕘 Saturday – Thursday, 10 AM – 10 PM Cairo time',
    ['Open WhatsApp', 'Working hours', 'Location'],
    { type: 'wa', label: 'Open WhatsApp' });

  add('hours',
    'hours when closed friday weekend available',
    'We work <b>Saturday to Thursday</b>, <b>10 AM – 10 PM</b> Cairo time (11 AM – 11 PM UAE time).<br>Friday is our day off, but WhatsApp messages get answered as soon as we can.',
    ['Open WhatsApp', 'Where we work']);

  add('location',
    'location address office based visit come',
    'We are based in <b>Ebshan, Bila district, Kafr El-Sheikh, Egypt</b>.<br>You do not need to come to us: design, websites and accounting systems are delivered <b>fully remotely</b>, and printed work ships anywhere in Egypt.',
    ['Where we work', 'Open WhatsApp']);

  add('areas',
    'areas cover serve egypt cairo alexandria governorate shipping nationwide',
    'We serve <b>every governorate in Egypt</b> — Kafr El-Sheikh, Bila, Desouk, Cairo, Alexandria, Tanta, El-Mahalla and the rest — with printed work shipped to your door.<br>Outside Egypt: <b>the UAE, Saudi Arabia, Qatar, Kuwait, Oman and Bahrain</b>.',
    ['Working with the UAE', 'Pricing']);

  add('uae',
    'uae dubai abudhabi gulf outside abroad international overseas foreign clients saudi',
    'Yes — we work with clients in <b>the UAE, Saudi Arabia, Qatar, Kuwait, Oman and Bahrain</b>.<br>• Every digital service (design, social, websites, stores, accounting systems) is delivered <b>fully remotely</b>.<br>• In the <b>UAE</b> we also handle <b>printing and delivery</b> through a local printing partner that prints and delivers straight to the client.<br>• Prices outside Egypt are in <b>US dollars</b>; payment by international bank transfer, Wise or PayPal.',
    ['Prices in USD', 'Printing in the UAE', 'Accounting for the UAE']);

  add('human',
    'contact speak to human person team real someone owner manager',
    'Of course — the fastest route is WhatsApp, straight to the team. Replies usually come within hours.',
    ['Open WhatsApp'],
    { type: 'wa', label: 'Message the team on WhatsApp' });

  /* ---------------- Design ---------------- */
  add('design_overview',
    'design services graphic what do you design',
    'Our design work covers everything your brand is seen through:<br>• Full brand identity (logo + usage guide + core print)<br>• Social media packs<br>• Invoices, vouchers and stamps<br>• Flyers, brochures, menus, catalogues<br>• Stickers, product labels, packaging and barcodes<br>• Shop signage, façades, indoor and outdoor boards<br>• Roll-ups, pop-ups, backdrops and vehicle branding',
    ['Identity pricing', 'Our work', 'Social media pack']);

  add('identity',
    'identity logo brand full visual design create',
    'A full visual identity includes the <b>logo</b> in all its variants, a <b>usage guide</b> (colours, type, rules), and the <b>core print items</b> (business card, letterhead, envelope, email signature).<br>⏱ <b>7 – 14 working days</b> · 💰 from <b>EGP 11,000</b> (or $450 outside Egypt).',
    ['Why a usage guide?', 'Packages', 'Request a quote']);

  add('brand_guide',
    'identity usage guide guidelines manual rules colours fonts brandbook',
    'A <b>usage guide</b> is what keeps your brand looking the same no matter who produces the work.<br>It fixes logo sizing and clear space, forbidden uses, the colour palette with exact codes, typefaces and scale, and right/wrong examples.<br>Without one, every designer redraws your brand their own way and within a year it is gone.',
    ['Identity pricing', 'Packages']);

  add('social_pack',
    'social media pack posts content instagram management design',
    'The social media pack is <b>10 designs</b> sized per platform (feed, story) delivered publish-ready.<br>⏱ <b>3 – 5 working days</b> · 💰 from <b>EGP 3,500</b> (or $150).<br>Note: this is <b>design</b> — daily page management and copywriting is a separate service; ask us on WhatsApp.',
    ['Social pricing', 'Platform sizes', 'Request a quote']);

  add('packaging',
    'packaging label sticker product box barcode design',
    'We design <b>packaging, labels and stickers</b>, and create the product <b>barcode</b>.<br>You get a press-ready file to the correct specification (CMYK, bleed, proper resolution, outlined fonts), and we review the proof with you before it prints.',
    ['What is bleed?', 'Printing', 'Request a quote']);

  add('signage',
    'signage sign shop front facade billboard board outdoor indoor banner',
    'We design and produce <b>shop signage, façades and advertising boards</b>, indoor and outdoor.<br>Price depends on size, material, mounting and lighting — send us the dimensions in metres and we will price it properly.',
    ['Request a quote', 'Open WhatsApp']);

  add('print_design',
    'design flyer brochure menu catalogue newsletter paper bag poster print materials',
    'We design the full print range: <b>flyers, brochures, menus, catalogues, book covers, newsletters, paper bags, A3 posters and roll-ups</b>.<br>You can take the design only and print it yourself, or let us print it with professional finishing.',
    ['Printing and finishes', 'Pricing']);

  add('wedding',
    'wedding invitation cards event invites',
    'Yes — we design and produce <b>wedding cards and invitations</b> in a range of stocks and finishes (lamination, foiling, laser cutting on request).<br>Price depends on quantity and material — send us the quantity and date on WhatsApp.',
    ['Open WhatsApp']);

  add('car_branding',
    'car vehicle branding wrap sticker fleet',
    'We design and apply <b>vehicle branding</b> — full or partial wraps in materials that survive sun and washing.<br>Price depends on the vehicle and how much of it you cover.',
    ['Request a quote']);

  /* ---------------- Printing ---------------- */
  add('print_overview',
    'print printing services what do you print types',
    'We print <b>business cards, brochures, menus, flyers, letterheads and envelopes, invoices, vouchers and stamps, roll-ups and pop-ups, A3 posters, advertising boards, catalogues and books</b> — with gloss/matt lamination, spot UV and binding on request.<br>Printing is produced <b>in Egypt</b> at our own facility, and <b>in the UAE</b> through a local printing partner that delivers straight to the client.',
    ['1,000 cards price', 'Finishes', 'Printing in the UAE']);

  add('cards',
    'cards business card 1000 print price',
    '<b>1,000 business cards</b> on 300gsm stock with finishing (gloss / matt lamination / UV):<br>💰 from <b>EGP 450</b> · ⏱ <b>2 – 4 working days</b> (design included).<br>Price moves with stock, finish and quantity.',
    ['Finishes', 'Request a quote']);

  add('finishes',
    'print finishes lamination gloss matt uv spot binding',
    'The finishes we offer:<br>• <b>Gloss lamination</b> — vivid colour and scratch protection<br>• <b>Matt lamination</b> — soft, premium touch<br>• <b>Spot UV</b> — gloss on one element (your logo, say) over a matt base<br>• <b>Binding</b> — saddle-stitch, perfect or wire, depending on page count',
    ['1,000 cards price', 'Paper stocks']);

  add('paper',
    'paper stock gsm weight thickness coated uncoated material',
    'The common stocks and what each is for:<br>• <b>130 – 170gsm</b> — flyers and brochures<br>• <b>250 – 350gsm</b> — business cards and covers (300 is the usual card)<br>• <b>Coated</b> for punchy colour · <b>uncoated</b> if people write on it<br>Heavier stock feels more premium in the hand — and that hand is your first impression.',
    ['Finishes', '1,000 cards price']);

  add('print_files',
    'print files what do you need from me format ai psd pdf artwork ready',
    'If you already have artwork, we need:<br>• <b>PDF</b>, <b>AI</b> or <b>PSD</b><br>• <b>CMYK</b> colour, not RGB<br>• <b>300 DPI</b> minimum<br>• <b>3 mm bleed</b> on every edge<br>• Fonts <b>outlined</b> or supplied<br>Not sure? Send it over and we will check it for you.',
    ['What is bleed?', 'CMYK or RGB?', 'Open WhatsApp']);

  add('print_uae',
    'print printing uae abroad shipping partner deliver produce',
    'Yes — in the <b>UAE</b> we work with a <b>local printing partner</b> that produces the job and delivers it directly to the client, so design, print and delivery come from one place.<br>Printing there is <b>quoted on request</b> because it depends on material, quantity and finishing — we send the quote within 24 hours.<br>Elsewhere in the Gulf we hand over <b>press-ready files</b> to the right specification and you print locally, with us reviewing the proof.',
    ['Print file requirements', 'Open WhatsApp']);

  add('min_qty',
    'minimum quantity order small one piece few',
    'There is no hard minimum — but printing economics mean the unit price drops sharply with volume.<br>100 cards can cost three times per card what 1,000 cards cost. Tell us the quantity you have in mind and we will tell you the sensible move.',
    ['1,000 cards price', 'Open WhatsApp']);

  /* ---------------- Web ---------------- */
  add('web_overview',
    'website web services development build',
    'Our web work covers:<br>• 5-page business website<br>• Online store with payment gateways<br>• Corporate site + professional email<br>• Annual hosting + domain name<br>• Monthly maintenance<br>• Responsive design on every device + SEO groundwork<br>• Order forms and WhatsApp integration',
    ['Website pricing', 'Store pricing', 'Hosting and domain']);

  add('website5',
    'website 5 pages business corporate price',
    'A <b>5-page business website</b> covers design, development and <b>a year of hosting plus the domain name</b>.<br>⏱ <b>7 – 14 working days</b> · 💰 from <b>EGP 22,000</b> (or $750).<br>Mobile-responsive, fast, and search-ready from day one.',
    ['Online store', 'Hosting and domain', 'Request a quote']);

  add('store',
    'store ecommerce online selling payment gateway products cart shipping',
    'The <b>online store</b> covers product pages, cart, <b>payment gateway integration</b>, order management, and <b>training so you can run it yourself</b>.<br>⏱ <b>14 – 21 working days</b> · 💰 from <b>EGP 35,000</b> (or $1,500).',
    ['Store vs website', 'Request a quote']);

  add('hosting',
    'hosting domain annual renewal ssl server',
    '<b>Hosting and the domain name</b> are included for a full year in the website price; renewal after that is <b>EGP 4,000 per year</b>.<br>An <b>SSL certificate</b> (the padlock) is included, and so is professional email on your own domain.',
    ['Domain vs hosting', 'Monthly maintenance']);

  add('maintenance',
    'maintenance monthly support updates after launch',
    '<b>Monthly maintenance is EGP 1,000</b> and covers backups, security updates, speed monitoring and small content edits.<br>Larger changes outside maintenance are billed at <b>EGP 500 per hour</b>.',
    ['Hosting and domain', 'Request a quote']);

  add('seo',
    'seo google search ranking first page visibility optimisation',
    'Every site we build ships <b>SEO-ready</b>: unique titles and descriptions, structured data, fast loading, a sitemap, and full mobile support.<br>Be clear though — that groundwork is a <b>foundation, not a guarantee of rank one</b>. Ranking needs ongoing content and time, usually 3 – 6 months.',
    ['Website pricing', 'Content or ads?']);

  add('email_official',
    'email professional business domain official address',
    'Yes — we set up <b>professional email on your own domain</b> (like info@yourbrand.com) and connect it to your phone and computer.<br>It reads far more credible to a corporate client than a free Gmail address.',
    ['Hosting and domain', 'Website pricing']);

  add('web_edit',
    'website edit myself dashboard cms admin update content add',
    'Yes — you get an <b>admin dashboard</b> to edit content, images and products without a developer, and <b>we train you on it</b> before handover.',
    ['Website pricing', 'Monthly maintenance']);

  /* ---------------- ERP / Faktra ---------------- */
  add('erp_overview',
    'accounting erp system tax software company management',
    'We supply a <b>complete accounting and tax system</b> for companies in <b>Egypt and the UAE</b>:<br>• Full accounting with live financial reports<br>• <b>E-invoice and e-receipt</b> integration with the Egyptian Tax Authority<br>• Inventory, purchasing and sales<br>• POS plus payroll and HR<br>• VAT returns and reports<br>• User permissions and secure backups, with training and support',
    ['What is Faktra?', 'E-invoicing', 'System pricing']);

  add('faktra',
    'faktra accounting system name software which',
    'The system is <b>Faktra</b> — accounting and e-invoicing with an Arabic and English interface. <b>You pick the country and it switches to that country\'s tax rules</b>:<br>🇪🇬 <b>Egypt:</b> e-invoices and e-receipts in the Egyptian Tax Authority format, 14% VAT<br>🇦🇪 <b>UAE:</b> the PINT AE standard, 5% VAT, excise tax and the profit margin scheme<br>Modules: invoicing · full accounting · inventory · purchases and suppliers · collections and treasury · payroll and HR.',
    ['Faktra website', 'System pricing', 'E-invoicing'],
    { type: 'link', label: 'Visit the Faktra website', href: 'https://mreda2018.github.io/faktra-website/en/index.html' });

  add('einvoice',
    'invoice electronic tax authority egypt integration registration',
    'The <b>e-invoice</b> is the Egyptian Tax Authority system for business-to-business and business-to-government transactions — invoices are transmitted to the Authority <b>in real time</b> with a digital signature.<br>We handle registration, integration and product coding, and train your team; the system then produces invoices in the required format automatically.',
    ['E-invoice vs e-receipt', 'Penalties', 'System pricing']);

  add('ereceipt',
    'receipt electronic ereceipt difference invoice consumer b2c retail',
    'The difference in short:<br>• <b>E-invoice</b> — transactions with businesses and government (B2B / B2G)<br>• <b>E-receipt</b> — sales to end consumers (B2C) through point-of-sale<br>The system supports <b>both</b>, and we handle registration, training and support for each.',
    ['E-invoicing', 'POS']);

  add('einvoice_penalty',
    'penalty fine non compliance not registered tax risk',
    'Failing to comply with the e-invoice system exposes a company to <b>fines from EGP 20,000 up to EGP 100,000</b> — and beyond that, larger companies increasingly refuse to deal with a supplier who is not connected.<br>So the real cost is not just the fine; it is the contracts you never get.',
    ['E-invoicing', 'System pricing']);

  add('uae_einvoice',
    'uae einvoicing invoicing invoice federal mandatory dates deadline 2027 authority phases',
    'The UAE federal e-invoicing timeline:<br>• <b>30 October 2026</b> — pilot phase begins<br>• <b>1 January 2027</b> — mandatory for companies with revenue above <b>AED 50 million</b><br>• <b>1 July 2027</b> — mandatory for everyone else<br>• <b>1 October 2027</b> — government transactions (B2G)<br>⚠️ Important: transmission goes through an <b>Accredited Service Provider (ASP)</b> appointed by the Federal Tax Authority. Our role is to <b>prepare</b> your system, data and invoices so they are compliant and ready to connect through that provider — not to replace it.',
    ['What is an ASP?', 'PINT AE standard', 'System pricing']);

  add('asp',
    'asp accredited service provider uae connect transmission',
    '<b>ASP</b> stands for Accredited Service Provider — a provider accredited by the UAE Federal Tax Authority, and the only party permitted to transmit invoices into the system.<br>We are <b>not an ASP</b> and we do not claim to be. Our job is to prepare your system, data and invoices so they are technically compliant and ready to connect through whichever accredited provider you choose.',
    ['UAE e-invoicing dates', 'PINT AE standard']);

  add('pint',
    'pint ae standard uae technical specification format',
    '<b>PINT AE</b> is the technical standard the UAE has set for the structure of an electronic invoice (the UAE profile of the international PINT standard).<br>It means the invoice has to carry specific fields in a specific shape for the system to accept it — and Faktra is built on that standard from the ground up.',
    ['UAE e-invoicing dates', 'What is an ASP?']);

  add('vat',
    'tax vat rate percent egypt uae how much',
    'The VAT rates the system handles:<br>🇪🇬 <b>Egypt: 14%</b><br>🇦🇪 <b>UAE: 5%</b> (plus excise tax and the profit margin scheme)<br>It calculates them automatically on every invoice and produces returns and reports ready to file.',
    ['E-invoicing', 'System pricing']);

  add('pos',
    'pos point of sale cashier shop restaurant cafe pharmacy retail',
    '<b>Point of sale (POS)</b> for shops, restaurants, cafés and pharmacies — it links the till to stock and accounts in real time and issues a compliant <b>e-receipt</b>.<br>Every sale deducts from stock, posts to the accounts and reports to the tax system automatically.',
    ['E-receipt', 'System pricing']);

  add('inventory',
    'inventory stock warehouse purchasing suppliers management count',
    'Inventory in the system gives you <b>live stock levels</b>, reorder alerts, stocktaking, barcode tracking, and a full link to purchasing, suppliers and sales.<br>You stop discovering an item is out of stock when a customer asks for it.',
    ['POS', 'System pricing']);

  add('payroll',
    'payroll salaries hr employees staff attendance',
    'The <b>payroll and HR</b> module covers employee records, salary calculation with allowances and deductions, insurance and tax, and monthly payment sheets.',
    ['System pricing', 'Request a quote']);

  add('erp_sectors',
    'sectors factory factories accounting industry suitable suit manufacturing contracting clinic pharmacy restaurant',
    'The system serves <b>every sector in Egypt and the UAE</b>:<br>retail · manufacturing · services · contracting · medical and clinics · restaurants and cafés · pharmacies · accounting firms.<br>Tell me your line of business and I will tell you which modules you actually need.',
    ['System pricing', 'Request a quote']);

  add('erp_training',
    'accounting training support help after setup team onboarding',
    'Training and support are part of the service, not an add-on:<br>• <b>Team training</b> before you go live<br>• <b>Ongoing technical support</b> after setup<br>• Permissions and backups configured for you<br>A system only pays off if the people using it know how.',
    ['System pricing', 'Request a quote']);

  /* ---------------- Pricing & packages ---------------- */
  add('price_general',
    'price all services list table general how much',
    'Prices <b>start from</b> these figures and are finalised by scope (Egyptian pounds, for clients inside Egypt):<br>• Full visual identity — <b>11,000</b><br>• 1,000 business cards — <b>450</b><br>• 5-page website — <b>22,000</b><br>• Online store — <b>35,000</b><br>• Accounting & tax system — <b>8,000</b><br>• Social pack (10 designs) — <b>3,500</b><br>💳 Payment is 50% up front, 50% on delivery.',
    ['Estimate my price', 'Packages', 'Prices in USD']);

  add('price_usd',
    'price usd dollar outside abroad uae gulf international currency payment',
    'Prices for clients outside Egypt are in <b>US dollars</b>, starting from:<br>• Full visual identity — <b>$450</b><br>• 5-page website — <b>$750</b><br>• Online store — <b>$1,500</b><br>• Accounting & tax system — <b>$400</b><br>• Social pack (10 designs) — <b>$150</b><br>• Printing in the UAE — <b>on request</b> (depends on material, quantity and finishing)<br>💳 International bank transfer, Wise or PayPal; 50% up front, 50% on delivery.',
    ['Working with the UAE', 'Request a quote']);

  add('packages',
    'packages bundles deals combined savings',
    'There are <b>3 packages</b>, each saving you 14 – 15% against buying the parts separately:<br>• <b>Starter</b> — from <b>EGP 5,500</b><br>• <b>Full Identity</b> — from <b>EGP 15,000</b> ⭐ most popular<br>• <b>Full Launch</b> — from <b>EGP 39,000</b><br>Any package can be tailored to your needs and budget.',
    ['Recommend a package', 'Starter details', 'Full Identity details']);

  add('pack1',
    'packages starter small entry basic cheapest',
    '<b>Starter Package — from EGP 5,500</b> (instead of 6,400 separately)<br>• Professional logo<br>• Business card + letterhead<br>• 3 social media designs<br>• 1,000 printed cards<br>Right for a business that is just opening and wants to look credible from day one.',
    ['Full Identity details', 'Request this package'],
    { type: 'pack', pack: 'pack1', label: 'Request the Starter Package' });

  add('pack2',
    'packages full identity mid popular',
    '<b>Full Identity Package — from EGP 15,000</b> (instead of 17,600 separately) ⭐<br>• Complete visual identity with usage guide<br>• The full print set<br>• Social media pack (10 designs)<br>• Shop sign or façade<br>This is the most requested one because it covers every point where a customer meets your brand.',
    ['Full Launch details', 'Request this package'],
    { type: 'pack', pack: 'pack2', label: 'Request the Full Identity Package' });

  add('pack3',
    'packages full launch complete everything biggest',
    '<b>Full Launch Package — from EGP 39,000</b> (instead of 45,600 separately)<br>• Everything in the Full Identity package<br>• + a 5-page website with hosting and domain<br>• + professional email<br>• + accounting system with e-invoice integration<br>For when you want to open with everything already working.',
    ['Request this package'],
    { type: 'pack', pack: 'pack3', label: 'Request the Full Launch Package' });

  add('discount',
    'discount cheaper lower budget tight expensive negotiate',
    'Our position is straightforward: <b>we reduce the scope, not the price</b>.<br>If the budget is smaller we remove items you do not need yet and give you a smaller version that can grow — rather than doing the same work to a lower standard.<br>Tell me your budget honestly and I will tell you the best use of it.',
    ['Recommend a package', 'Open WhatsApp']);

  add('payment',
    'payment deposit transfer instapay how to pay method upfront',
    'Payment terms: <b>50% up front when work starts, 50% on delivery</b>.<br>🇪🇬 <b>Inside Egypt:</b> cash, bank transfer, InstaPay, Vodafone Cash<br>🌍 <b>From abroad:</b> international bank transfer, Wise, PayPal (in USD)<br>You get a <b>written quote</b> before any payment and an <b>official invoice</b> after each instalment.',
    ['Instalments?', 'Pricing']);

  add('installment',
    'payment instalments stages split milestones later',
    'The two-payment split (50% + 50%) is the standard.<br>On larger projects — a Full Launch package or an online store — we can split it across <b>delivery milestones</b>, a payment as each stage completes. Talk to us on WhatsApp and we will set it up.',
    ['Open WhatsApp', 'Packages']);

  add('invoice_official',
    'invoice official tax receipt company records',
    'Yes — we issue an <b>official invoice</b> after each payment, which matters if your company needs to book the expense.',
    ['Payment methods']);

  /* ---------------- AI & software solutions ---------------- */
  add('ai_overview',
    'software solutions ai development custom artificial intelligence tech build systems',
    'Our fifth pillar: <b>software solutions and AI for business</b>.<br>We build systems shaped around how you actually work, and put AI on the tasks that eat your team\u2019s day:<br>• Custom internal systems and dashboards<br>• Automating repetitive tasks and reports<br>• Connecting your systems through APIs<br>• Chatbots for your website and WhatsApp<br>• An AI assistant trained on your company\u2019s data<br>• Automated data extraction from invoices and documents<br>• Integration with accounting systems and online stores<br>• Web apps that run on every device',
    ['Software pricing', 'Task automation', 'A chatbot for my site', 'AI assistant']);

  add('ai_price',
    'software ai custom system price cost quote how much is a custom system',
    'Software and AI work is <b>quoted on request</b> — there is no published fixed price, because every system differs by scope, number of users and complexity.<br>How it works: a <b>free session</b> to understand your current process and where the time goes, then a <b>written proposal</b> with scope, timeline and price.',
    ['Task automation', 'Custom systems', 'Open WhatsApp']);

  add('automation',
    'automation automate repetitive tasks reports manual time excel workflow',
    'Automation means the repetitive work happens by itself instead of someone doing it daily:<br>• Reports that assemble and send themselves<br>• Data moving between systems without copy-paste<br>• Alerts when something actually needs you<br>• Spreadsheets that build and update on their own<br>The simple test: any task that repeats, takes time, and has clear steps is usually worth automating.',
    ['Software pricing', 'Connecting systems', 'Custom systems']);

  add('chatbot_service',
    'chatbot bot conversation automatic reply website whatsapp customers',
    'We build <b>chatbots</b> for your website and WhatsApp, trained on your services, prices and the questions your customers actually ask.<br>The value: instant replies around the clock, serious enquiries filtered, and the customer handed to your team with their details already captured.<br>The assistant you are talking to right now is a working example of ours.',
    ['Software pricing', 'AI assistant', 'Task automation']);

  add('ai_assistant',
    'assistant trained company data files ask internal knowledge ai',
    'We build an <b>AI assistant trained on your company\u2019s own data</b> — your files, policies, catalogues and prices.<br>Your team asks a question in plain language and gets the answer in seconds instead of digging through folders, and customers get accurate answers sourced from you rather than from the open internet.',
    ['A chatbot for my site', 'Software pricing']);

  add('custom_system',
    'custom system internal dashboard bespoke software manage my company',
    'When off-the-shelf software does not fit how you work, we build a <b>custom system</b>: a dashboard to run customers, orders, stock or your team the way your business actually operates \u2014 not the way the software insists.<br>It includes user permissions, reporting and backups.',
    ['Software pricing', 'Connecting systems']);

  add('integrations',
    'integration connect api systems together store accounting sync data',
    'We connect your systems through <b>APIs</b> so data moves on its own:<br>• Online store \u2192 accounting system<br>• Orders \u2192 stock \u2192 invoices<br>• WhatsApp \u2192 customer records<br>The result: you enter data once instead of three times, and errors drop sharply.',
    ['Task automation', 'Accounting system', 'Software pricing']);

  /* ---------------- Process & policy ---------------- */
  add('process',
    'process methodology approach how do you work steps stages start workflow',
    'We work in <b>four stages</b>:<br><b>1. Listen and analyse</b> — your business, your audience, your competitors<br><b>2. Strategy and direction</b> — agree the creative direction and the timeline<br><b>3. Design and production</b> — executed with reviews at every step<br><b>4. Delivery and follow-up</b> — files handed over, support continues',
    ['How many revisions?', 'Timelines', 'Request a quote']);

  add('revisions',
    'revisions changes rounds edits how many not happy',
    'You get <b>two rounds of revisions free</b>, with a third at half price.<br>That is not meanness — it forces the feedback to be focused, which gets to a better result than an open-ended loop.',
    ['How we work', 'Source files']);

  add('source_files',
    'source files open ai psd ownership rights copyright',
    'You receive the <b>open source files</b> (AI / PSD) after the final payment, and they are yours outright.<br>Along with press-ready and web-ready exports in every format you will need.',
    ['Payment methods', 'Revisions']);

  add('timeline',
    'time how long deadline days delivery when ready',
    'Typical turnaround:<br>• Full visual identity — <b>7 – 14 working days</b><br>• 1,000 business cards — <b>2 – 4 days</b><br>• 5-page website — <b>7 – 14 days</b><br>• Online store — <b>14 – 21 days</b><br>• Accounting & tax system — <b>5 – 10 days</b><br>• Social pack (10 designs) — <b>3 – 5 days</b><br>The clock starts when the deposit and the information are both in.',
    ['Need it faster?', 'Request a quote']);

  add('rush',
    'rush urgent urgently fast faster asap tomorrow quick express hurry deadline',
    'We can usually move faster depending on the load at the time — there is a rush fee based on the scope and the deadline.<br>Send us the deadline on WhatsApp and we will tell you honestly whether it is doable.',
    ['Open WhatsApp', 'Normal timelines']);

  add('contract',
    'contract agreement guarantee written terms scope',
    'Before any payment we send a <b>detailed written quote</b> covering scope, timeline, revision count and deliverables — so there are no surprises.<br>On larger projects we sign a <b>formal contract</b>.',
    ['Payment methods', 'Open WhatsApp']);

  add('portfolio',
    'work portfolio samples examples previous clients see',
    'You can see samples of our work on the <a href="portfolio.html">Our Work</a> page — identity systems, printed applications, and websites and online stores.',
    ['Services', 'Request a quote'],
    { type: 'link', label: 'Open the work page', href: 'portfolio.html' });

  /* ---------------- General advertising knowledge ---------------- */
  add('what_branding',
    'identity what is branding meaning definition why need explain',
    'A <b>visual identity</b> is not just a logo — it is a whole system: the logo, the colour palette, the typefaces, the patterns, how products are photographed, and the tone of the words.<br>Its job is to make people recognise you before they read your name. That consistency is what turns a shop into a brand.',
    ['Logo vs identity', 'Usage guide', 'Identity pricing']);

  add('logo_vs_identity',
    'difference vs logo identity between brand compare',
    '<b>The logo</b> is the mark itself — one drawing.<br>The <b>visual identity</b> is the system the logo lives in: colours, type, sizing, usage rules, and how it all applies to the card, the menu, the sign and the website.<br>A logo without an identity is a book title with no book behind it.',
    ['What is a visual identity?', 'Identity pricing']);

  add('cmyk_rgb',
    'cmyk rgb colour color difference print screen',
    '<b>RGB</b> is screen colour (light) — wider and more vivid.<br><b>CMYK</b> is print colour (ink) — a narrower range.<br>That is why a neon shade glowing on screen prints dull. The rule: anything destined for print is designed in <b>CMYK</b> from the start, not converted at the last minute.',
    ['What is bleed?', 'Print file requirements']);

  add('bleed',
    'bleed print margin trim 3mm crop',
    '<b>Bleed</b> is 3 mm of artwork extending past the trim line on every edge.<br>Why? Cutting machines drift very slightly. If your design stops exactly at the edge, a white sliver appears. Bleed guarantees the colour runs to the paper edge.',
    ['Print file requirements', 'What is DPI?']);

  add('dpi',
    'dpi resolution image quality pixels sharp blurry',
    '<b>DPI</b> is dots per inch — the resolution of an image when printed.<br>• <b>300 DPI</b> — the minimum for anything printed<br>• <b>72 DPI</b> — fine for screen only<br>An image saved off Facebook is usually 72 DPI, so it will print pixelated no matter how you scale it.',
    ['Vector or image?', 'Print file requirements']);

  add('vector',
    'vector raster pixels scaling quality ai eps svg',
    '<b>Vector</b> artwork is drawn with maths — scale it to the size of a building and it stays razor sharp (AI / EPS / SVG).<br><b>Raster</b> artwork is made of pixels — scale it up and it falls apart (JPG / PNG).<br>Which is why <b>your logo must be vector</b>, or every sign and roll-up becomes a fight.',
    ['What is DPI?', 'Source files']);

  add('gsm',
    'gsm paper weight thickness stock grams',
    '<b>GSM</b> is the weight of a square metre of paper — the practical measure of thickness and feel.<br>• 80 – 100 → ordinary office paper<br>• 130 – 170 → flyers and brochures<br>• 250 – 350 → cards and covers (300 is the standard card)<br>Heavier stock feels more considered in the hand, and that is the first impression of your brand.',
    ['Paper stocks', 'Finishes']);

  add('offset_digital',
    'offset digital printing difference quantity cheaper which',
    '<b>Digital</b> — best for short runs; quick setup and low start cost.<br><b>Offset</b> — higher setup cost but the unit price falls hard at volume, with tighter colour accuracy.<br>Rough rule: under 500 copies go digital, above that offset is usually cheaper.',
    ['Minimum quantity', '1,000 cards price']);

  add('mockup',
    'mockup preview visual how it looks before production',
    'A <b>mockup</b> shows your design applied to the real thing — the card in a hand, the sign on the shopfront, the pack on a shelf.<br>It lets you judge the design in context before you pay for production.',
    ['How we work', 'Our work']);

  add('paper_sizes',
    'sizes a3 a4 a5 paper dimensions format',
    'Standard paper sizes (each is half the one before):<br>• <b>A3</b> = 29.7 × 42 cm — posters<br>• <b>A4</b> = 21 × 29.7 cm — letterheads and brochures<br>• <b>A5</b> = 14.8 × 21 cm — flyers and menus<br>• <b>A6</b> = 10.5 × 14.8 cm — promo cards<br>And the standard business card is <b>9 × 5.5 cm</b>.',
    ['Paper stocks', '1,000 cards price']);

  add('barcode',
    'barcode ean product code scan retail',
    'A <b>barcode</b> is a unique number representing your product, read by a scanner at the till.<br>We design it into the packaging at the right size and contrast so it scans first time. If your business needs international <b>EAN</b> numbers, those are issued by an official body and we will point you to the steps.',
    ['Packaging design', 'POS']);

  add('colors_meaning',
    'colour color psychology meaning choose which suits my business',
    'Colour communicates before anyone reads a word:<br>• <b>Red</b> — energy and urgency (food, offers)<br>• <b>Blue</b> — trust and stability (finance, tech, medical)<br>• <b>Green</b> — health and nature<br>• <b>Black and gold</b> — luxury<br>But <b>distinctiveness</b> matters more than meaning: if every competitor is blue, blue makes you disappear among them.',
    ['What is a visual identity?', 'Identity pricing']);

  add('landing_page',
    'landing page single campaign difference website ads',
    'A <b>landing page</b> is one page with one job — buy, sign up, or call — with no navigation to distract the visitor.<br>It is usually built alongside an ad campaign so every pound of ad spend lands somewhere focused rather than on a general homepage.',
    ['Website pricing', 'Content or ads?']);

  add('store_vs_site',
    'store website difference which do i need business',
    'A <b>business website</b> explains what you do and gets people to contact you.<br>An <b>online store</b> actually sells: products, cart, online payment, orders and stock.<br>Rule of thumb: selling ready products at fixed prices → store. Selling services with custom quotes → a business website is stronger and cheaper.',
    ['Website pricing', 'Store pricing']);

  add('domain_hosting',
    'difference vs domain hosting meaning explain',
    'A simple analogy:<br>• The <b>domain</b> is the street address (your site name)<br>• The <b>hosting</b> is the shop itself (the server holding your files)<br>You need both, and both renew yearly. With us, both are included for a full year in the website price.',
    ['Hosting and domain', 'Website pricing']);

  add('ssl',
    'ssl certificate security https padlock secure',
    '<b>SSL</b> is what makes your address <b>https</b> with a padlock beside it.<br>Without it browsers warn visitors that the site is "not secure" and Google ranks it lower. It is included on every site we build.',
    ['Hosting and domain']);

  add('social_sizes',
    'social sizes post story instagram dimensions square reel',
    'The sizes we deliver:<br>• <b>Square post</b> 1080 × 1080<br>• <b>Portrait post</b> 1080 × 1350 (takes more space in the feed)<br>• <b>Story / Reel</b> 1080 × 1920<br>• <b>Facebook cover</b> 1640 × 856<br>The social pack arrives in these sizes, publish-ready.',
    ['Social media pack', 'Social pricing']);

  add('content_vs_ads',
    'content ads paid organic difference better should i advertise',
    'They do different jobs:<br>• <b>Paid ads</b> — results immediately, but they stop the moment the budget stops<br>• <b>Content and SEO</b> — slow (3 – 6 months) but they build an asset that keeps working<br>The right first move is a clear identity, though — otherwise you are paying to send people to something unconvincing.',
    ['What is SEO?', 'What is a visual identity?']);

  add('start_brand',
    'start new business first advice what should i do beginning',
    'If you are starting out, the order that actually works:<br><b>1.</b> Name, logo and a basic identity<br><b>2.</b> Business card and letterhead (the first point of contact)<br><b>3.</b> A consistent social presence<br><b>4.</b> Signage, if you have premises<br><b>5.</b> A website once you have content and offers worth showing<br>The <b>Starter Package</b> is built in exactly that order.',
    ['Starter details', 'Recommend a package']);

  add('rebrand',
    'identity rebrand refresh old change when should i update',
    'It is time to refresh an identity when:<br>• It looks dated next to your competitors<br>• Your business has outgrown what it says<br>• Different versions of your logo are floating around<br>• You are going after a different kind of customer<br>And it is not always a full rebuild — often a <b>refresh</b> of the existing identity solves it for less.',
    ['Identity pricing', 'Open WhatsApp']);

  add('consistency',
    'identity consistency different each time designer looks inconsistent',
    'The thing that quietly kills small brands is <b>inconsistency</b> — every piece in a different colour and a different typeface.<br>The fix is unglamorous: a written <b>usage guide</b> plus organised master files. After that, any designer you hire produces the same look.',
    ['Usage guide', 'What is a visual identity?']);

  window.ELREDA_KB = {
    lang: 'en',
    dir: 'ltr',
    wa: WA,
    syn: SYN,
    entries: E,

    ui: {
      title: 'Elreda Assistant',
      status: 'Online',
      launch: 'Open chat',
      close: 'Close chat',
      placeholder: 'Ask me anything…',
      send: 'Send',
      disclaimer: 'Automated assistant — formal quotes are confirmed by the team',
      typing: 'Typing…',
      reset: 'New conversation'
    },

    greeting: 'Welcome to <b>Elreda Advertising</b> 👋<br>I can answer questions on our services, prices and timelines, explain the Faktra accounting system, software and AI work, estimate a price, or recommend a package.<br>Ask away, or pick one of these:',
    openChips: ['Pricing', 'Estimate my price', 'AI & software solutions', 'Accounting system', 'Recommend a package'],

    fallback: 'I do not have a precise answer for that, and I would rather not guess about something affecting your business.<br>Would you like to reach the team on WhatsApp? Replies usually come within hours.',
    fallbackChips: ['Services', 'Pricing', 'Packages'],

    smallTalk: [
      { k: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'greetings', 'how are you'],
        a: 'Hello 👋 Ask me anything about design, printing, websites or accounting systems.' },
      { k: ['thanks', 'thank you', 'thx', 'appreciate', 'cheers'],
        a: 'You are welcome 🙏 I am here if you need anything else — and the team is on WhatsApp any time.' },
      { k: ['bye', 'goodbye', 'see you', 'later'],
        a: 'Goodbye 👋 Come back any time.' },
      { k: ['ok', 'okay', 'great', 'nice', 'cool', 'sure'],
        a: 'Good 👍 Anything else you would like to know?' }
    ],

    estimate: {
      trigger: ['estimate', 'calculate', 'how much would', 'roughly', 'ballpark', 'approximate'],
      intro: 'Sure — two quick questions and I will give you a <b>rough price range</b> from our published table. The final quote is confirmed by the team.',
      q1: 'What do you need?',
      services: [
        { id: 'identity', label: 'Brand identity', base: 11000, usd: 450 },
        { id: 'website', label: 'Business website', base: 22000, usd: 750 },
        { id: 'store', label: 'Online store', base: 35000, usd: 1500 },
        { id: 'erp', label: 'Accounting system', base: 8000, usd: 400 },
        { id: 'social', label: 'Social pack', base: 3500, usd: 150 },
        { id: 'print', label: 'Printing', base: 450, usd: 0 }
      ],
      q2: 'Roughly what scale?',
      scales: [
        { id: 'small', label: 'Simple / small business', mult: [1, 1.3] },
        { id: 'mid', label: 'Medium', mult: [1.3, 1.9] },
        { id: 'large', label: 'Large / corporate', mult: [1.9, 3] }
      ],
      q3: 'Where are you?',
      regions: [
        { id: 'eg', label: 'Inside Egypt', cur: 'EGP' },
        { id: 'intl', label: 'Outside Egypt', cur: '$' }
      ],
      printNote: 'Printing is priced by quantity, stock and finishing rather than project scale — send us the quantity and size on WhatsApp and we will price it exactly within 24 hours.',
      printNoteIntl: 'Printing in the UAE is quoted on request through our printing partner — send the specification on WhatsApp and we will come back within 24 hours.',
      result: 'Rough estimate for <b>{svc}</b> at <b>{scale}</b> scale:',
      after: 'That is an <b>indicative range</b> based on our published starting prices; the final figure depends on your actual scope. Would you like a detailed quote?'
    },

    recommend: {
      trigger: ['recommend', 'which package', 'what package', 'suggest', 'best for me', 'suits me'],
      intro: 'Sure — three quick questions and I will tell you which package fits.',
      q1: 'Where is your business right now?',
      a1: [
        { id: 'new', label: 'Just starting from scratch', s: { pack1: 3, pack2: 1, pack3: 1 } },
        { id: 'running', label: 'Running, want to look better', s: { pack1: 1, pack2: 3, pack3: 1 } },
        { id: 'expand', label: 'Running and expanding', s: { pack1: 0, pack2: 2, pack3: 3 } }
      ],
      q2: 'Do you need a website or an accounting system?',
      a2: [
        { id: 'no', label: 'No, identity and print only', s: { pack1: 2, pack2: 3, pack3: 0 } },
        { id: 'site', label: 'Yes, I need a website', s: { pack1: 0, pack2: 0, pack3: 3 } },
        { id: 'erp', label: 'Yes, I need accounting', s: { pack1: 0, pack2: 0, pack3: 3 } }
      ],
      q3: 'Roughly what budget?',
      a3: [
        { id: 'low', label: 'Under EGP 10,000', s: { pack1: 3, pack2: 1, pack3: 0 } },
        { id: 'mid', label: 'EGP 10,000 – 30,000', s: { pack1: 1, pack2: 3, pack3: 1 } },
        { id: 'high', label: 'Above EGP 30,000', s: { pack1: 0, pack2: 1, pack3: 3 } }
      ],
      packs: {
        pack1: { name: 'Starter Package', price: 'EGP 5,500', why: 'Because you are at the beginning and need to look credible at the lowest sensible cost.' },
        pack2: { name: 'Full Identity Package', price: 'EGP 15,000', why: 'Because you need every customer touchpoint covered consistently.' },
        pack3: { name: 'Full Launch Package', price: 'EGP 39,000', why: 'Because you need the identity, the website and the accounting system working together from day one.' }
      },
      result: 'My recommendation: <b>{name}</b> — from <b>{price}</b>.<br>{why}<br>And it can be tailored to what you actually need.'
    },

    lead: {
      trigger: ['i want to order', 'place an order', 'get started', 'request a quote', 'send a quote', 'hire you'],
      intro: 'Great 👌 Three details and I will prepare a WhatsApp message ready to send to the team.',
      qName: 'What is your name?',
      qBiz: 'What is your business? (e.g. restaurant, clinic, factory, online store)',
      qNeed: 'What exactly do you need?',
      done: 'Thanks <b>{name}</b> — here is your message:',
      send: 'Send it on WhatsApp',
      waTemplate: 'Hello 👋\nName: {name}\nBusiness: {biz}\nNeed: {need}\n\n(sent from the website assistant)'
    },

    cancel: 'No problem, cancelled. What would you like to ask about?',
    cancelLabel: 'Cancel',
    waLabel: 'Open WhatsApp',
    suggestLabel: 'Did you mean:'
  };
})();
