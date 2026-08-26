-- JayTech Database Seed Data
-- Run this after schema.sql

-- ============================================
-- SETTINGS
-- ============================================
insert into public.settings (id, key, value, category) values
('a0000000-0000-0000-0000-000000000001', 'business_name', '"JayTech"', 'general'),
('a0000000-0000-0000-0000-000000000002', 'business_description', '"Professional solar installation, Starlink setup, electrical solutions and reliable energy services delivered nationwide across Nigeria."', 'general'),
('a0000000-0000-0000-0000-000000000003', 'phone', '"+234 800 123 4567"', 'contact'),
('a0000000-0000-0000-0000-000000000004', 'whatsapp', '"+234 800 123 4567"', 'contact'),
('a0000000-0000-0000-0000-000000000005', 'email', '"info@jaytech.ng"', 'contact'),
('a0000000-0000-0000-0000-000000000006', 'address', '"123 Tech Avenue, Victoria Island, Lagos, Nigeria"', 'contact'),
('a0000000-0000-0000-0000-000000000007', 'working_hours', '"Mon - Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM"', 'contact'),
('a0000000-0000-0000-0000-000000000008', 'state', '"Lagos"', 'location'),
('a0000000-0000-0000-0000-000000000009', 'city', '"Lagos"', 'location'),
('a0000000-0000-0000-0000-000000000010', 'service_areas', '["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu", "Benin City", "Warri"]', 'location'),
('a0000000-0000-0000-0000-000000000011', 'social_links', '{"facebook": "https://facebook.com/jaytech.ng", "instagram": "https://instagram.com/jaytech.ng", "twitter": "https://twitter.com/jaytech_ng", "linkedin": "https://linkedin.com/company/jaytech", "youtube": "https://youtube.com/@jaytechng"}', 'social'),
('a0000000-0000-0000-0000-000000000012', 'hero_headline', '"Powering Your World. Connecting You to What Matters."', 'hero'),
('a0000000-0000-0000-0000-000000000013', 'hero_subheadline', '"Professional solar installation, Starlink setup, electrical solutions and reliable energy services delivered nationwide across Nigeria."', 'hero'),
('a0000000-0000-0000-0000-000000000014', 'hero_images', '["/images/jay1.jpg", "/images/jay2.jpg", "/images/jay3.jpg"]', 'hero'),
('a0000000-0000-0000-0000-000000000015', 'stats', '{"projects_completed": 500, "happy_customers": 1200, "years_experience": 8, "states_covered": 15}', 'general'),
('a0000000-0000-0000-0000-000000000016', 'meta_title', '"JayTech - Solar Installation, Starlink Setup & Electrical Services in Nigeria"', 'seo'),
('a0000000-0000-0000-0000-000000000017', 'meta_description', '"Nigeria''s trusted partner for professional solar panel installation, Starlink internet setup, electrical wiring, and complete energy solutions. Serving Lagos, Abuja, Port Harcourt and nationwide."', 'seo'),
('a0000000-0000-0000-0000-000000000018', 'logo_url', '"/images/jay.png"', 'general'),
('a0000000-0000-0000-0000-000000000019', 'footer_text', '"© 2026 JayTech. All rights reserved. Powering Nigeria, one home at a time."', 'general'),
('a0000000-0000-0000-0000-000000000020', 'currency', '"NGN"', 'general');

-- ============================================
-- SERVICE CATEGORIES (6)
-- ============================================
insert into public.service_categories (id, name, slug, description, image_url, display_order) values
('b0000000-0000-0000-0000-000000000001', 'Solar Energy', 'solar-energy', 'Complete solar power solutions for homes and businesses across Nigeria', '/images/jay4.jpg', 1),
('b0000000-0000-0000-0000-000000000002', 'Starlink & Connectivity', 'starlink-connectivity', 'Starlink satellite internet installation and network setup services', '/images/jay5.jpg', 2),
('b0000000-0000-0000-0000-000000000003', 'Electrical Services', 'electrical-services', 'Professional electrical wiring, installation, and safety inspection services', '/images/jay6.jpg', 3),
('b0000000-0000-0000-0000-000000000004', 'Repairs & Maintenance', 'repairs-maintenance', 'Expert repair and maintenance services for solar systems, inverters, and electrical installations', '/images/jay7.jpg', 4),
('b0000000-0000-0000-0000-000000000005', 'Consultation', 'consultation', 'Professional energy consultation and system design services', '/images/jay8.jpg', 5),
('b0000000-0000-0000-0000-000000000006', 'Electrical Gadgets', 'electrical-gadgets', 'Quality electrical gadgets, appliances, and smart home devices', '/images/jay9.jpg', 6);

-- ============================================
-- SERVICES (6)
-- ============================================
insert into public.services (id, category_id, title, slug, description, short_description, image_url, hero_image_url, benefits, includes, equipment, process_steps, estimated_duration, pricing_type, starting_price, meta_title, meta_description, display_order) values

-- 1. Solar Installation
('c0000000-0000-0000-0000-000000000001',
 'b0000000-0000-0000-0000-000000000001',
 'Solar Panel Installation',
 'solar-installation',
 'Transform your home or business into an energy-independent powerhouse with our professional solar panel installation services. We design and install custom solar systems tailored to Nigeria''s unique climate and your specific energy needs. From rooftop residential setups to large-scale commercial solar farms, our certified technicians ensure maximum efficiency and long-lasting performance. We use only Tier-1 solar panels, premium inverters, and high-quality batteries to deliver reliable clean energy that significantly reduces your electricity bills and eliminates reliance on fossil fuel generators.',
 'Professional solar panel installation for homes and businesses. Reduce electricity bills and enjoy 24/7 clean energy.',
 '/images/jay4.jpg',
 '/images/jay1.jpg',
 '["Significantly reduce your monthly electricity bills by up to 80%", "Enjoy 24/7 uninterrupted power supply even during grid outages", "Increase your property value with a modern solar installation", "Zero noise pollution compared to diesel and petrol generators", "Environmentally friendly - reduce your carbon footprint", "Low maintenance with 25+ year panel lifespan", "Protection against rising electricity tariffs and fuel costs"]',
 '["Free on-site survey and energy assessment", "Custom system design optimized for your location", "Premium Tier-1 solar panels (LONGi, JinkoSolar, Canadian Solar)", "Hybrid or grid-tie inverter system", "Battery storage solution (for hybrid systems)", "Complete mounting structure and wiring", "Professional installation by certified technicians", "Post-installation monitoring setup", "25-year panel performance warranty", "5-year inverter and installation warranty"]',
 '["Tier-1 Monocrystalline or Polycrystalline Solar Panels", "Deye, Growatt, or Luminous Hybrid Inverter", "Tubular or Lithium Battery Bank", "MC4 Connectors and Solar Cables", "Aluminium Mounting Rails and Clamps", "DC Breaker and AC Distribution Box", "Lightning Arrestor and Surge Protector", "Smart Energy Monitor (optional)"]',
 '["1. Initial consultation and energy needs assessment", "2. On-site survey to evaluate roof condition and sun exposure", "3. Custom system design with 3D layout and energy projection", "4. Transparent quotation with detailed breakdown", "5. Procurement of quality equipment and materials", "6. Professional installation (typically 1-3 days)", "7. System testing, commissioning, and grid connection", "8. Handover with training on system operation and monitoring", "9. Post-installation support and warranty activation"]',
 '1-3 days',
 'starting',
 350000,
 'Solar Panel Installation in Nigeria | JayTech',
 'Professional solar panel installation services in Nigeria. Custom solar systems for homes and businesses. Starting from ₦350,000. 25-year warranty.',
 1),

-- 2. Starlink Installation
('c0000000-0000-0000-0000-000000000002',
 'b0000000-0000-0000-0000-000000000002',
 'Starlink Installation',
 'starlink-installation',
 'Get blazing-fast satellite internet anywhere in Nigeria with our professional Starlink installation service. SpaceX''s Starlink delivers high-speed, low-latency broadband internet through a constellation of satellites, making it perfect for locations where traditional ISP coverage is unreliable or unavailable. Our certified Starlink technicians handle everything from site survey and equipment setup to optimal dish positioning and network configuration. Whether you need reliable internet for your home, office, farm, school, or remote business location, we ensure you get the best possible Starlink performance with proper installation and setup.',
 'Professional Starlink satellite internet installation across Nigeria. High-speed internet anywhere, anytime.',
 '/images/jay5.jpg',
 '/images/jay3.jpg',
 '["High-speed internet (50-200 Mbps) even in remote areas", "Low latency perfect for video calls and online gaming", "No data caps or throttling - unlimited satellite internet", "Works where traditional ISPs cannot reach", "Quick installation - same day internet access", "Professional dish positioning for optimal signal", "Reliable connection during rainy season with proper setup", "Increase productivity for remote work and businesses"]',
 '["Complete Starlink kit procurement assistance", "Professional site survey for optimal dish placement", "Expert dish mounting and installation", "Network configuration and WiFi optimization", "Speed testing and performance verification", "Router setup for whole-home coverage", "Basic training on Starlink app and system management", "30-day post-installation support"]',
 '["Starlink Standard or Business Kit", "Starlink Gen 3 Router", "Mounting Pole or Roof Mount bracket", "Cat6 Outdoor Ethernet Cable", "Lightning Surge Protector", "Weatherproof Junction Box (if needed)", "Cable management accessories"]',
 '["1. Pre-installation consultation and site assessment", "2. Starlink kit procurement guidance or supply", "3. Optimal dish placement identification (clear sky view)", "4. Professional mounting - roof, pole, or ground installation", "5. Cable routing and weatherproofing", "6. Router setup and WiFi network configuration", "7. Speed test and performance optimization", "8. Starlink app setup and account walkthrough", "9. Handover with usage tips and support contact"]',
 '1 day',
 'starting',
 85000,
 'Starlink Installation in Nigeria | JayTech',
 'Professional Starlink satellite internet installation in Nigeria. Get high-speed internet anywhere. Expert technicians available nationwide.',
 2),

-- 3. Electrical Services
('c0000000-0000-0000-0000-000000000003',
 'b0000000-0000-0000-0000-000000000003',
 'Electrical Services',
 'electrical-services',
 'From complete home wiring to complex commercial electrical installations, JayTech delivers safe, reliable, and code-compliant electrical services across Nigeria. Our licensed electricians handle residential wiring, office electrical fit-outs, industrial electrical systems, transformer installations, earthing and grounding, lighting design, and power distribution. We adhere strictly to Nigerian electrical standards and international best practices to ensure the safety of your property and loved ones. Whether you are building a new home, renovating, or need electrical repairs, our team has the expertise and experience to deliver exceptional results.',
 'Complete electrical wiring, installation, and maintenance services for residential and commercial properties.',
 '/images/jay6.jpg',
 '/images/jay16.jpg',
 '["Licensed and insured electrical professionals", "Strict adherence to Nigerian and international electrical codes", "Safe and reliable installations that protect your property", "Comprehensive solutions from design to maintenance", "Energy-efficient lighting and wiring solutions", "Emergency electrical repair services available", "Transparent pricing with detailed quotations", "Post-service warranty on all electrical work"]',
 '["Full electrical wiring for new buildings", "Electrical rewiring for old properties", "Distribution board and panel installation", "Lighting installation and design", "Power socket and switch installation", "Ceiling fan and AC point installation", "Earthing and lightning protection systems", "Electrical safety inspection and certification", "Generator changeover and manual/automatic transfer switch installation"]',
 '["Copper wiring (cables and conductors)", "Distribution boards and circuit breakers", "MCBs, MCCBs, and RCDs", "Conduit pipes and trunking systems", "LED light fixtures and fittings", "Switches, sockets, and accessories", "Earthing rods and copper tapes", "Electrical meters and monitoring equipment"]',
 '["1. Initial consultation and electrical needs assessment", "2. Site survey and electrical load calculation", "3. Detailed electrical design and layout plan", "4. Transparent quotation with material specifications", "5. Procurement of quality electrical materials", "6. Professional installation by licensed electricians", "7. Thorough testing and quality inspection", "8. Final connection and commissioning", "9. Certification and handover with as-built documentation"]',
 '1-7 days',
 'request_quote',
 0,
 'Electrical Services in Nigeria | JayTech',
 'Professional electrical services in Nigeria. Home wiring, commercial installations, safety inspections. Licensed electricians. Get a free quote today.',
 3),

-- 4. Repairs & Maintenance
('c0000000-0000-0000-0000-000000000004',
 'b0000000-0000-0000-0000-000000000004',
 'Repairs & Maintenance',
 'repairs-maintenance',
 'Keep your solar systems, inverters, electrical installations, and Starlink equipment running at peak performance with our expert repair and maintenance services. Our skilled technicians diagnose and fix issues quickly, from inverter faults and battery problems to wiring defects and Starlink connectivity issues. We offer both one-time repair services and comprehensive maintenance packages designed to extend the lifespan of your equipment and prevent costly breakdowns. Regular maintenance not only ensures optimal performance but also protects your warranty and investment.',
 'Expert repair and maintenance for solar systems, inverters, electrical installations, and Starlink equipment.',
 '/images/jay7.jpg',
 '/images/jay7.jpg',
 '["Fast diagnosis and resolution of electrical and solar issues", "Preventive maintenance to avoid costly breakdowns", "Extend the lifespan of your solar and electrical systems", "Restore optimal performance and efficiency", "Genuine replacement parts and components", "Flexible scheduling to minimize disruption", "Maintenance packages for ongoing system health", "Emergency repair response available"]',
 '["Solar panel cleaning and inspection", "Inverter diagnosis and repair", "Battery testing and replacement", "Wiring fault detection and repair", "Starlink dish realignment and troubleshooting", "Electrical system safety inspection", "Preventive maintenance contracts", "Emergency breakdown response"]',
 '["Diagnostic testing equipment", "Solar panel cleaning solutions", "Inverter testing tools", "Battery load testers", "Multimeters and clamp meters", "Replacement fuses and breakers", "Spare cables and connectors", "Starlink alignment tools"]',
 '["1. Service request and issue description", "2. Remote or on-site diagnosis", "3. Detailed repair quotation with parts breakdown", "4. Authorisation and parts procurement", "5. Professional repair or maintenance work", "6. System testing and quality verification", "7. Service report and maintenance recommendations", "8. Follow-up support and warranty on repairs"]',
 'Same day - 2 days',
 'request_quote',
 0,
 'Solar & Electrical Repairs in Nigeria | JayTech',
 'Expert solar, inverter, and electrical repair and maintenance services in Nigeria. Fast diagnosis, quality repairs. Book a service today.',
 4),

-- 5. Consultation
('c0000000-0000-0000-0000-000000000005',
 'b0000000-0000-0000-0000-000000000005',
 'Energy Consultation',
 'energy-consultation',
 'Make informed decisions about your energy future with our professional consultation services. Our energy experts analyze your current power consumption, property characteristics, and budget to recommend the most cost-effective and efficient solar, electrical, or connectivity solutions. Whether you are planning a new solar installation, upgrading your electrical system, or need guidance on the best Starlink package for your needs, our consultants provide unbiased, expert advice tailored to your specific situation. We help you avoid common mistakes and ensure you get maximum value from your energy investment.',
 'Professional energy consultation and system design. Get expert advice on solar, electrical, and connectivity solutions.',
 '/images/jay8.jpg',
 '/images/jay8.jpg',
 '["Expert guidance from certified energy consultants", "Customized solutions based on your specific needs", "Accurate energy consumption analysis and projections", "Budget-friendly recommendations with ROI analysis", "Unbiased advice - we recommend what works best for you", "Detailed written report with recommendations", "Follow-up support after consultation", "Saves you money by avoiding wrong system sizing"]',
 '["Detailed energy consumption audit", "Property and site assessment", "Custom system design and recommendation", "Cost-benefit analysis and ROI projection", "Written consultation report with specifications", "Equipment recommendations and sourcing guidance", "Implementation roadmap and timeline", "One-month follow-up consultation"]',
 '["Energy monitoring equipment", "Solar irradiance measurement tools", "Electrical testing instruments", "Thermal imaging camera (for inspections)", "Design software for system modeling", "Specification sheets and product catalogs"]',
 '["1. Initial consultation to understand your needs", "2. On-site assessment and energy audit", "3. Data analysis and system modeling", "4. Solution development with multiple options", "5. Detailed report with cost analysis", "6. Presentation and Q&A session", "7. Final recommendation and implementation plan", "8. Follow-up support and implementation assistance"]',
 '1-3 days',
 'request_quote',
 0,
 'Energy Consultation Services in Nigeria | JayTech',
 'Professional energy consultation in Nigeria. Expert advice on solar, electrical, and Starlink solutions. Book your consultation today.',
 5),

-- 6. Electrical Gadgets
('c0000000-0000-0000-0000-000000000006',
 'b0000000-0000-0000-0000-000000000006',
 'Electrical Gadgets',
 'electrical-gadgets',
 'Browse our curated selection of quality electrical gadgets, smart home devices, and energy-efficient appliances. From smart inverters and solar charge controllers to CCTV cameras, automatic voltage regulators, and smart home automation systems, we offer products that complement our installation services and enhance your daily life. All our products are tested, verified, and come with manufacturer warranties. We also provide expert advice on choosing the right gadgets for your home or business, along with professional installation and setup services.',
 'Quality electrical gadgets, smart home devices, and energy-efficient appliances. Shop smart, live better.',
 '/images/jay9.jpg',
 '/images/jay9.jpg',
 '["Wide range of quality electrical products", "All products tested and verified for Nigerian conditions", "Manufacturer warranty on all gadgets", "Expert advice on product selection", "Professional installation and setup available", "Competitive prices with flexible payment options", "After-sales support and technical assistance", "Genuine products - no counterfeit items"]',
 '["Quality product selection and sourcing", "Pre-delivery inspection and testing", "Delivery to your location nationwide", "Professional installation and setup (where applicable)", "Product training and demonstration", "Warranty documentation and registration", "After-sales technical support", "Exchange and return policy"]',
 '["Smart Inverters (Deye, Growatt, Victron)", "Solar Charge Controllers (MPPT)", "Automatic Voltage Regulators (AVR)", "CCTV and Security Camera Systems", "Smart Home Automation Devices", "LED Lighting Systems", "Wireless Routers and Network Equipment", "Portable Power Stations and Solar Generators"]',
 '["1. Browse our catalog or consult with our team", "2. Product recommendation based on your needs", "3. Order placement and payment", "4. Quality check and preparation", "5. Delivery to your location", "6. Professional installation (if applicable)", "7. Setup, configuration, and training", "8. Warranty activation and after-sales support"]',
 '1-5 days',
 'starting',
 15000,
 'Electrical Gadgets & Smart Home Devices | JayTech',
 'Shop quality electrical gadgets, smart home devices, and energy-efficient appliances at JayTech. Genuine products with warranty.',
 6);

-- ============================================
-- SERVICE FAQs (3 per service = 18)
-- ============================================
insert into public.service_faqs (id, service_id, question, answer, display_order) values

-- Solar Installation FAQs
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
 'How much does solar panel installation cost in Nigeria?',
 'Solar installation costs in Nigeria depend on your energy needs and the system size. A basic 1kVA system starts from ₦350,000, while a typical 3kVA home system ranges from ₦800,000 to ₦1,500,000. Larger commercial systems can range from ₦2,000,000 to ₦10,000,000+. We provide free consultations and custom quotes to match your exact needs and budget.', 1),

('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001',
 'How long does a solar installation take?',
 'A typical residential solar installation takes 1-3 days depending on the system size and complexity. Commercial installations may take 3-7 days. The process includes site survey, installation, testing, and handover. We work efficiently to minimize disruption to your daily activities.', 2),

('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001',
 'What warranty do you offer on solar installations?',
 'We provide a 25-year performance warranty on solar panels (guaranteeing at least 80% efficiency), a 5-year warranty on inverters, and a 5-year installation warranty. Batteries come with their own manufacturer warranty (typically 2-5 years depending on the type). All warranties are documented and backed by JayTech.', 3),

-- Starlink Installation FAQs
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002',
 'Is Starlink available in Nigeria?',
 'Yes! Starlink is officially available in Nigeria. SpaceX launched the service and you can order the Starlink kit directly or through authorized resellers. JayTech helps you procure the kit and provides professional installation to ensure you get the best possible speeds and performance from your Starlink system.', 1),

('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002',
 'How fast is Starlink internet in Nigeria?',
 'Starlink typically delivers 50-200 Mbps download speeds in Nigeria, with latency of 20-50ms. Actual speeds depend on your location, time of day, and local conditions. This is significantly faster than most traditional ISPs, especially in areas with limited broadband infrastructure. The service is ideal for streaming, video calls, gaming, and remote work.', 2),

('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002',
 'How much does Starlink installation cost?',
 'The Starlink Standard kit costs approximately ₦350,000-₦450,000 (prices vary). Our professional installation service fee starts from ₦85,000 which includes site survey, dish mounting, cable routing, router setup, and network configuration. We also help with Starlink kit procurement if needed. Monthly subscription is paid directly to SpaceX.', 3),

-- Electrical Services FAQs
('d0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000003',
 'How much does home wiring cost in Nigeria?',
 'Home wiring costs vary based on the size of the house and complexity. A standard 2-bedroom flat wiring typically costs ₦150,000-₦300,000, a 3-bedroom house ₦250,000-₦500,000, and a duplex ₦400,000-₦800,000. These estimates include materials and labour. We provide free on-site assessments and detailed quotations before any work begins.', 1),

('d0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000003',
 'Do you provide emergency electrical repair services?',
 'Yes, we understand that electrical emergencies can happen at any time. JayTech offers emergency electrical repair services with rapid response times across Lagos, Abuja, and other major cities. Call our emergency line and a qualified electrician will be dispatched to your location as quickly as possible to resolve urgent electrical issues safely.', 2),

('d0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000003',
 'Are your electricians licensed and insured?',
 'Absolutely. All JayTech electricians are fully licensed by the Nigerian Society of Engineers and carry valid practicing licenses. We are also fully insured with comprehensive liability insurance to protect your property during all electrical work. Our team undergoes regular training to stay updated with the latest electrical standards and safety protocols.', 3),

-- Repairs & Maintenance FAQs
('d0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000004',
 'How often should I maintain my solar system?',
 'We recommend professional solar system maintenance at least twice a year. Regular maintenance includes panel cleaning, inverter inspection, battery health check, wiring inspection, and system performance monitoring. Our preventive maintenance packages help you schedule regular check-ups and can extend your system lifespan significantly while maintaining optimal energy production.', 1),

('d0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000004',
 'My inverter is not working. Can you fix it?',
 'Yes! Our technicians are experienced in repairing all major inverter brands including Deye, Growatt, Luminous, and others. Common issues we fix include inverter not charging, error codes, reduced backup time, abnormal sounds, and complete failure. We diagnose the issue, provide a repair quotation, and fix it typically within 24-48 hours depending on parts availability.', 2),

('d0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000004',
 'Do you offer maintenance contracts for businesses?',
 'Yes, we offer tailored maintenance contracts for businesses, schools, hospitals, and commercial properties. Our maintenance packages include scheduled inspections, preventive maintenance, priority emergency response, discounted repair rates, and detailed performance reports. Contact us to discuss a maintenance plan that fits your needs and budget.', 3),

-- Consultation FAQs
('d0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000005',
 'How much does a consultation cost?',
 'Our initial phone consultation is completely free! For on-site consultations that include a detailed energy audit, site assessment, and custom system design report, we charge a professional fee that is fully credited toward your project cost if you proceed with JayTech. This ensures you get expert advice with no financial risk.', 1),

('d0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000005',
 'What does an energy consultation include?',
 'Our comprehensive energy consultation includes: analysis of your current electricity usage and bills, assessment of your property for solar potential or electrical upgrades, customized system recommendations with specifications, detailed cost-benefit analysis and ROI projections, equipment recommendations, and a written report you can use for planning. We provide actionable, practical advice tailored to your specific situation.', 2),

('d0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000005',
 'Can I get a consultation online or does it have to be in person?',
 'We offer both online and in-person consultations. Online consultations via video call are great for initial assessments and general guidance. For detailed energy audits and system design, an on-site visit is recommended to accurately assess your property, measure available space, and evaluate sun exposure or electrical infrastructure. Many clients start with an online consultation and then proceed to an on-site assessment.', 3),

-- Electrical Gadgets FAQs
('d0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000006',
 'What gadgets do you sell?',
 'We offer a wide range of electrical gadgets including smart inverters, MPPT solar charge controllers, automatic voltage regulators (AVRs), CCTV security cameras, smart home devices, LED lighting systems, portable power stations, and solar generators. All products are sourced from reputable manufacturers and are tested to work well in Nigerian conditions with voltage fluctuations.', 1),

('d0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000006',
 'Do you offer installation for purchased gadgets?',
 'Yes! When you purchase gadgets from JayTech, we offer professional installation and setup services. This includes CCTV camera installation and configuration, smart home device setup, inverter and charge controller installation, and network equipment configuration. Installation fees vary by product and are quoted separately. Many gadgets come with free basic setup.', 2),

('d0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000006',
 'Do your products come with warranties?',
 'Yes, all electrical gadgets sold by JayTech come with manufacturer warranties ranging from 6 months to 3 years depending on the product. We provide warranty documentation at the time of purchase. If you experience any issues within the warranty period, we handle the warranty claim process for you and provide replacement or repair services.', 3);

-- ============================================
-- PROJECTS (6)
-- ============================================
insert into public.projects (id, title, slug, description, location, service_id, service_type, client_name, is_published, is_featured, meta_title, meta_description) values

('e0000000-0000-0000-0000-000000000001',
 'Lekki Phase 1 Solar Installation',
 'lekki-phase-1-solar-installation',
 'A comprehensive 10kVA hybrid solar installation for a luxury 5-bedroom duplex in Lekki Phase 1, Lagos. The system was designed to completely eliminate the owner''s dependence on their diesel generator, saving an estimated ₦150,000 monthly on fuel costs. The installation included 20 premium monocrystalline panels, a Deye hybrid inverter, and a lithium battery bank providing over 8 hours of backup power. The client now enjoys 24/7 power with zero noise pollution and dramatically reduced carbon emissions. The rooftop mounting system was carefully designed to complement the building''s modern architecture.',
 'Lekki Phase 1, Lagos',
 'c0000000-0000-0000-0000-000000000001',
 'Solar Installation',
 'Chief Adewale Ogundimu',
 true, true,
 'Lekki Phase 1 Solar Installation | JayTech Portfolio',
 'View our 10kVA hybrid solar installation project in Lekki Phase 1, Lagos. Eliminated generator dependency and saved ₦150,000 monthly.'),

('e0000000-0000-0000-0000-000000000002',
 'Abuja Office Starlink Setup',
 'abuja-office-starlink-setup',
 'Professional Starlink Business installation for a co-working space in Wuse 2, Abuja. The client needed reliable, high-speed internet to support 50+ workstations and video conferencing rooms. We installed a Starlink Business kit with optimal dish placement on the building rooftop, paired with enterprise-grade WiFi access points for whole-floor coverage. The result was a consistent 150+ Mbps connection with sub-40ms latency, enabling seamless video calls, cloud operations, and file transfers for all tenants. The installation eliminated the client''s dependence on unreliable local ISP infrastructure.',
 'Wuse 2, Abuja',
 'c0000000-0000-0000-0000-000000000002',
 'Starlink Installation',
 'GreenHub Coworking',
 true, false,
 'Abuja Office Starlink Installation | JayTech Portfolio',
 'Starlink Business installation for a co-working space in Wuse 2, Abuja. 150+ Mbps reliable internet for 50+ workstations.'),

('e0000000-0000-0000-0000-000000000003',
 'Ikeja Residential Wiring',
 'ikeja-residential-wiring',
 'Complete electrical rewiring of a 3-story residential building in Ikeja, Lagos. The existing wiring was over 20 years old and posed serious safety risks including frequent tripping, overheating, and outdated fuse boxes. Our team replaced all wiring with modern copper conductors, installed a new distribution board with MCBs and RCDs for each circuit, added proper earthing throughout, and installed energy-efficient LED lighting throughout the property. The project also included dedicated circuits for the kitchen, air conditioning units, and water heating system. All work was certified to meet Nigerian electrical standards.',
 'Ikeja, Lagos',
 'c0000000-0000-0000-0000-000000000003',
 'Electrical Services',
 'Mr. Oluwaseun Bakare',
 true, false,
 'Ikeja Residential Electrical Rewiring | JayTech Portfolio',
 'Complete electrical rewiring of a 3-story building in Ikeja, Lagos. Modern copper wiring, new distribution board, and LED lighting.'),

('e0000000-0000-0000-0000-000000000004',
 'Port Harcourt Factory Solar System',
 'port-harcourt-factory-solar-system',
 'A large-scale 50kVA commercial solar installation for a manufacturing facility in Trans Amadi, Port Harcourt. The factory was spending over ₦800,000 monthly on electricity from the national grid plus diesel generator backup. Our team designed and installed a hybrid solar system with 80 high-efficiency panels, three-phase hybrid inverters, and a substantial battery bank. The system now offsets approximately 60% of the factory''s energy consumption, saving over ₦500,000 monthly. The installation was completed without interrupting factory operations, with most work done during weekends and off-peak hours.',
 'Trans Amadi, Port Harcourt',
 'c0000000-0000-0000-0000-000000000001',
 'Solar Installation',
 'Riverview Manufacturing Ltd',
 true, true,
 'Port Harcourt Factory Solar Installation | JayTech Portfolio',
 '50kVA commercial solar system for a factory in Trans Amadi, PH. Saving over ₦500,000 monthly on electricity costs.'),

('e0000000-0000-0000-0000-000000000005',
 'Village Home Solar Upgrade',
 'village-home-solar-upgrade',
 'A life-changing solar installation for a family home in a rural community in Enugu State. The family had been relying solely on kerosene lamps and occasional generator use due to the unreliable national grid supply in their area. We installed a 3kVA solar system with 4 panels, a hybrid inverter, and tubular batteries that provides enough power for lighting, phone charging, a small refrigerator, and a television. The children can now study at night, and the family enjoys clean, reliable power for the first time. This project was part of our community outreach initiative.',
 'Enugu, Enugu State',
 'c0000000-0000-0000-0000-000000000001',
 'Solar Installation',
 'The Nwachukwu Family',
 true, true,
 'Village Home Solar Installation | JayTech Portfolio',
 '3kVA solar installation for a rural home in Enugu State. Bringing reliable clean energy to off-grid communities.'),

('e0000000-0000-0000-0000-000000000006',
 'Starlink for Remote School',
 'starlink-for-remote-school',
 'Starlink satellite internet installation for a secondary school in a remote area of Kaduna State. The school had no reliable internet access, making it impossible for students to access online educational resources, participate in digital literacy programs, or connect with educational platforms. We installed Starlink with a clear-sky dish mount on the school building, configured a school-wide WiFi network covering classrooms, the computer lab, and the staff room. Teachers now access online teaching materials, students can use educational apps, and the school has joined the digital education revolution. The installation was completed as part of JayTech''s educational CSR initiative.',
 'Kaduna, Kaduna State',
 'c0000000-0000-0000-0000-000000000002',
 'Starlink Installation',
 'Government Secondary School, Rigachikun',
 true, true,
 'Starlink for Remote School in Kaduna | JayTech Portfolio',
 'Starlink internet installation for a secondary school in Kaduna. Bringing digital education to underserved communities.');

-- ============================================
-- PROJECT IMAGES (2 per project)
-- ============================================
insert into public.project_images (project_id, image_url, caption, image_type, display_order) values
('e0000000-0000-0000-0000-000000000001', '/images/jay10.jpg', 'Completed solar panel array on Lekki duplex rooftop', 'after', 1),
('e0000000-0000-0000-0000-000000000001', '/images/jay10.jpg', 'Inverter and battery room setup', 'after', 2),
('e0000000-0000-0000-0000-000000000002', '/images/jay11.jpg', 'Starlink dish mounted on office building rooftop', 'after', 1),
('e0000000-0000-0000-0000-000000000002', '/images/jay11.jpg', 'WiFi network equipment installation', 'after', 2),
('e0000000-0000-0000-0000-000000000003', '/images/jay12.jpg', 'New distribution board installation', 'after', 1),
('e0000000-0000-0000-0000-000000000003', '/images/jay12.jpg', 'Complete wiring upgrade in progress', 'standard', 2),
('e0000000-0000-0000-0000-000000000004', '/images/jay13.jpg', '80-panel solar array installed at factory', 'after', 1),
('e0000000-0000-0000-0000-000000000004', '/images/jay13.jpg', 'Three-phase inverter system for factory', 'after', 2),
('e0000000-0000-0000-0000-000000000005', '/images/jay14.jpg', 'Solar panels installed on village home rooftop', 'after', 1),
('e0000000-0000-0000-0000-000000000005', '/images/jay14.jpg', 'Family enjoying electric light for the first time', 'standard', 2),
('e0000000-0000-0000-0000-000000000006', '/images/jay15.jpg', 'Starlink dish installation at school', 'after', 1),
('e0000000-0000-0000-0000-000000000006', '/images/jay15.jpg', 'Students using computers with new internet', 'standard', 2);

-- ============================================
-- REVIEWS (8 - all approved)
-- ============================================
insert into public.reviews (id, customer_id, service_id, name, rating, review, service_used, is_approved, is_featured) values

('f0000000-0000-0000-0000-000000000001', null, 'c0000000-0000-0000-0000-000000000001',
 'Adebayo Olatunji', 5,
 'JayTech transformed our home! We were spending over ₦120,000 monthly on diesel for our generator before installing solar. Now our electricity bill has dropped by 80% and we enjoy 24/7 power. The installation team was professional, clean, and finished in just two days. The system has been running perfectly for 8 months now. Highly recommend JayTech for anyone considering solar in Lagos!',
 'Solar Installation', true, true),

('f0000000-0000-0000-0000-000000000002', null, 'c0000000-0000-0000-0000-000000000002',
 'Chioma Eze', 5,
 'After struggling with unreliable internet from our local ISP, we decided to try Starlink. JayTech handled the entire process from helping us order the kit to professional installation. We are now getting 150+ Mbps consistently! Video calls are smooth, streaming is perfect, and my kids can finally do their online classes without constant disconnections. Best investment we have made this year.',
 'Starlink Installation', true, true),

('f0000000-0000-0000-0000-000000000003', null, 'c0000000-0000-0000-0000-000000000003',
 'Ibrahim Musa Danja', 4,
 'JayTech rewired our entire 4-bedroom house in Abuja. The old wiring was a disaster waiting to happen - we had experienced two electrical fires in neighboring houses. The team was thorough and professional. They installed a modern distribution board, replaced all the old aluminum wiring with proper copper cables, and even added extra sockets where we needed them. The only reason for 4 stars instead of 5 is that the project took a day longer than estimated, but the quality of work is excellent.',
 'Electrical Services', true, false),

('f0000000-0000-0000-0000-000000000004', null, 'c0000000-0000-0000-0000-000000000001',
 'Folake Adeyemi', 5,
 'We installed a 5kVA system for our pharmacy in Ikeja. JayTech was recommended by a friend and they did not disappoint. From the initial consultation to the final installation, everything was handled professionally. They even helped us choose the right battery size to ensure our refrigerators (for medicines) never lose power. 8 months later and we have not experienced a single power interruption. Thank you JayTech!',
 'Solar Installation', true, true),

('f0000000-0000-0000-0000-000000000005', null, 'c0000000-0000-0000-0000-000000000004',
 'Emeka Okonkwo', 5,
 'My inverter stopped working and I thought I would need to buy a new one. JayTech diagnosed the issue within hours - it was a faulty charge controller board. They ordered the part and fixed it within 2 days. The technician was knowledgeable and explained everything clearly. Their repair cost was very reasonable compared to buying a new inverter. These guys know their stuff!',
 'Repairs & Maintenance', true, false),

('f0000000-0000-0000-0000-000000000006', null, 'c0000000-0000-0000-0000-000000000005',
 'Blessing Ogba', 4,
 'I needed expert advice on whether to go solar or stick with my generator for my new house in Port Harcourt. JayTech''s consultation service was incredibly helpful. They assessed my energy needs, showed me the numbers, and recommended a hybrid system that lets me use solar during the day and grid power at night. The detailed report they provided helped me make an informed decision. Great service!',
 'Energy Consultation', true, false),

('f0000000-0000-0000-0000-000000000007', null, 'c0000000-0000-0000-0000-000000000006',
 'Yusuf Abdullahi', 5,
 'Bought a smart inverter and CCTV cameras from JayTech. The prices were very competitive and they provided free installation for the CCTV system. The cameras work perfectly with the mobile app and I can monitor my shop from anywhere. Their after-sales support is also top-notch - they called to check if everything was working fine. Will definitely buy from them again.',
 'Electrical Gadgets', true, false),

('f0000000-0000-0000-0000-000000000008', null, 'c0000000-0000-0000-0000-000000000001',
 'Ngozi Nwosu', 5,
 'JayTech installed a 3kVA solar system for my parents'' village home in Enugu. It was their community outreach program and they offered us a very affordable rate. My parents can now charge their phones, watch TV, and have light at night for the first time ever. I am emotional just writing this review. JayTech is doing amazing work bringing clean energy to rural communities. God bless the team!',
 'Solar Installation', true, true);

-- ============================================
-- FAQs (10 - general)
-- ============================================
insert into public.faqs (id, question, answer, category, display_order) values
('aa000000-0000-0000-0000-000000000001',
 'How much does solar installation cost in Nigeria?',
 'Solar installation costs in Nigeria vary based on system size and components. A basic 1kVA system starts from ₦350,000, while a typical 3kVA home system ranges from ₦800,000 to ₦1,500,000. Larger commercial systems can range from ₦2,000,000 to ₦10,000,000+. We offer free consultations and customized quotations to match your energy needs and budget. Contact us today for a free assessment.',
 'solar', 1),

('aa000000-0000-0000-0000-000000000002',
 'Is Starlink available in all parts of Nigeria?',
 'Yes, Starlink satellite internet is available throughout Nigeria since its official launch. Unlike traditional ISPs that require physical infrastructure, Starlink connects via satellite, making it available even in remote and rural areas. JayTech provides professional Starlink installation services nationwide, including areas in Lagos, Abuja, Port Harcourt, Kano, Enugu, and beyond.',
 'starlink', 2),

('aa000000-0000-0000-0000-000000000003',
 'Which states and cities does JayTech service?',
 'JayTech provides services across Nigeria. We have strong presence in Lagos, Abuja, Port Harcourt, Ibadan, Kano, Enugu, Benin City, and Warri. Our technicians travel to other locations nationwide for projects. Contact us to confirm availability in your specific area. For Starlink and solar consultations, we can assist remotely regardless of your location.',
 'general', 3),

('aa000000-0000-0000-0000-000000000004',
 'What warranty do you offer on your installations?',
 'We provide comprehensive warranties on all our installations. Solar panels come with a 25-year performance warranty (maintaining at least 80% efficiency). Inverters have a 5-year manufacturer warranty. Our installation workmanship is covered by a 5-year warranty. Batteries come with 2-5 year warranties depending on the type (tubular or lithium). All warranties are documented and honored by JayTech.',
 'general', 4),

('aa000000-0000-0000-0000-000000000005',
 'What payment methods do you accept?',
 'We accept multiple payment methods for your convenience: Bank transfer (all major Nigerian banks), Paystack online payments (cards, bank transfer, USSD), POS payments at our office, and structured payment plans for larger projects. For projects above ₦500,000, we offer flexible installment payment options. We typically require a 50% deposit to begin work, with the balance due upon completion.',
 'general', 5),

('aa000000-0000-0000-0000-000000000006',
 'How do I book a service with JayTech?',
 'Booking a service with JayTech is easy! You can: 1) Fill out the booking form on our website, 2) Call or WhatsApp us at +234 800 123 4567, 3) Send an email to info@jaytech.ng, or 4) Visit our office at 123 Tech Avenue, Victoria Island, Lagos. We will schedule a consultation, provide a detailed quotation, and agree on a timeline before beginning any work.',
 'general', 6),

('aa000000-0000-0000-0000-000000000007',
 'Do you offer free consultations?',
 'Yes! We offer free initial consultations for all our services. This includes a phone or video call to discuss your needs, and for solar and electrical projects, we provide a free on-site assessment in Lagos and Abuja. Our consultation includes energy analysis, system recommendations, and a detailed quotation at no cost to you. We believe in helping you make informed decisions.',
 'general', 7),

('aa000000-0000-0000-0000-000000000008',
 'Do you offer emergency services?',
 'Yes, JayTech offers emergency electrical and solar repair services. If you have an urgent electrical issue, a malfunctioning inverter, or a solar system breakdown, call our emergency line at +234 800 123 4567. We prioritize emergency calls and aim to have a technician dispatched to your location within hours in Lagos, Abuja, and other major cities we serve.',
 'general', 8),

('aa000000-0000-0000-0000-000000000009',
 'How often should I service my solar or electrical system?',
 'We recommend professional maintenance for solar systems at least twice a year. This includes panel cleaning, inverter inspection, battery health check, and wiring inspection. For electrical installations, we recommend a safety inspection every 2-3 years, or immediately if you notice any issues like flickering lights, burning smells, or frequent tripping. JayTech offers affordable maintenance packages to keep your systems running optimally.',
 'general', 9),

('aa000000-0000-0000-0000-000000000010',
 'Are your prices fixed or negotiable?',
 'Our published starting prices are indicative and may vary based on specific project requirements. Each project is unique, so we provide customized quotations after assessing your needs. We are transparent about pricing and will always provide a detailed breakdown before you commit. For commercial projects and bulk orders, we offer competitive pricing. We never compromise on quality materials or workmanship to offer lower prices.',
 'general', 10);

-- ============================================
-- BLOG CATEGORIES (3)
-- ============================================
insert into public.blog_categories (id, name, slug, description) values
('bb000000-0000-0000-0000-000000000001', 'Solar Guides', 'solar-guides', 'Expert guides and tips on solar energy systems in Nigeria'),
('bb000000-0000-0000-0000-000000000002', 'Starlink Guides', 'starlink-guides', 'Everything you need to know about Starlink satellite internet in Nigeria'),
('bb000000-0000-0000-0000-000000000003', 'Electrical Safety', 'electrical-safety', 'Electrical safety tips and best practices for Nigerian homes and businesses');

-- ============================================
-- BLOG POSTS (4)
-- ============================================
insert into public.blog_posts (id, title, slug, content, excerpt, featured_image, category_id, tags, meta_title, meta_description, seo_keywords, status, published_at) values

('cc000000-0000-0000-0000-000000000001',
 'Complete Guide to Solar Installation in Nigeria',
 'complete-guide-to-solar-installation-in Nigeria',
 '<h2>Why Solar Energy is the Future in Nigeria</h2>
<p>Nigeria receives an average of 6 hours of sunlight daily, making it one of the most solar-rich countries in the world. Yet, millions of Nigerians still struggle with erratic power supply from the national grid and spend huge sums on diesel and petrol generators. Solar energy presents a clean, reliable, and increasingly affordable alternative that can transform how we power our homes, businesses, and communities.</p>

<p>The cost of solar panels has dropped by over 80% in the last decade, making solar installation more accessible to everyday Nigerians. A well-designed solar system can pay for itself within 2-4 years through savings on electricity bills and generator fuel. Beyond the financial benefits, solar energy is environmentally friendly, produces zero noise, and requires minimal maintenance compared to traditional generators.</p>

<h2>Understanding Solar System Components</h2>
<p>A complete solar installation consists of several key components working together. <strong>Solar panels</strong> (also called PV modules) capture sunlight and convert it into direct current (DC) electricity. The <strong>inverter</strong> then converts this DC electricity into alternating current (AC) that powers your appliances. <strong>Batteries</strong> store excess energy for use during nighttime or cloudy periods. A <strong>charge controller</strong> regulates the flow of electricity to protect your batteries from overcharging. Finally, <strong>mounting structures</strong> secure your panels in the optimal position to capture maximum sunlight.</p>

<h2>Choosing the Right System Size</h2>
<p>The right solar system size depends on your daily electricity consumption. Start by listing all the appliances you want to power and their wattage. A typical Nigerian household might need: lighting (100W), fan (75W × 3), television (100W), refrigerator (150W), decoder (25W), and phone/laptop charging (100W). Adding these up and accounting for daily usage hours helps determine your total daily energy need in watt-hours. A professional consultation ensures you get the right system size without overspending or being underserved.</p>

<h2>The Installation Process</h2>
<p>Professional solar installation follows a structured process. It begins with an on-site survey to assess your roof condition, available space, and sun exposure. Based on this assessment, a custom system design is created. Once you approve the design and quotation, equipment is procured and installation begins. The process typically takes 1-3 days for residential systems. After installation, the system is tested, commissioned, and you receive training on how to operate and monitor your solar system effectively.</p>

<h2>Why Choose Professional Installation</h2>
<p>While DIY solar installation might seem tempting to save costs, professional installation ensures safety, optimal performance, and warranty protection. Certified installers understand local building codes, electrical standards, and the best practices for Nigeria''s climate conditions. They ensure proper wiring, earthing, and protection against electrical surges - all critical for the safety and longevity of your solar investment.</p>',
 'A comprehensive guide to understanding solar panel installation in Nigeria. Learn about system components, sizing, costs, and the installation process.',
 '/images/jay17.jpg',
 'bb000000-0000-0000-0000-000000000001',
 '["solar", "installation", "nigeria", "energy", "renewable", "guide"]',
 'Complete Guide to Solar Installation in Nigeria | JayTech Blog',
 'Everything you need to know about solar panel installation in Nigeria. System sizing, costs, components, and the installation process explained.',
 'solar installation nigeria, solar panel cost nigeria, how to install solar in nigeria, solar energy guide',
 'published',
 '2026-03-15T10:00:00Z'),

('cc000000-0000-0000-0000-000000000002',
 'Starlink Internet in Nigeria: Everything You Need to Know',
 'starlink-internet-in-nigeria-everything-you-need-to-know',
 '<h2>What is Starlink?</h2>
<p>Starlink is a satellite internet constellation developed by SpaceX, the American aerospace company founded by Elon Musk. Unlike traditional internet service providers that rely on physical infrastructure like fiber optic cables and cell towers, Starlink beams internet directly from thousands of satellites orbiting the Earth. This revolutionary approach means high-speed internet is available virtually anywhere with a clear view of the sky, including remote and rural areas of Nigeria where traditional ISPs have never reached.</p>

<h2>Starlink Availability in Nigeria</h2>
<p>Starlink officially launched in Nigeria in January 2023, making Nigeria one of the first African countries to receive the service. The Starlink Standard kit is available for purchase through the Starlink website or authorized resellers like JayTech. The service covers the entire country, with particularly strong performance in areas with clear sky visibility. Unlike GSM networks that experience congestion during peak hours, Starlink maintains consistent speeds throughout the day.</p>

<h2>Starlink Speeds and Performance in Nigeria</h2>
<p>Users in Nigeria typically experience download speeds between 50-200 Mbps, with upload speeds of 10-30 Mbps. Latency ranges from 20-50ms, which is excellent for video conferencing, online gaming, and real-time applications. During the rainy season, some temporary signal disruption may occur during heavy downpours, but the system generally recovers quickly. Starlink''s performance in Nigeria has been consistently improving as SpaceX continues to launch more satellites and optimize coverage over the African continent.</p>

<h2>How Much Does Starlink Cost in Nigeria?</h2>
<p>The Starlink Standard kit costs between ₦350,000-₦450,000 (prices may vary). The monthly subscription fee is approximately ₦38,000 (or the equivalent in USD at current exchange rates). While this may seem expensive compared to some local ISPs, the speed, reliability, and unlimited data make it excellent value, especially for businesses and users in areas with poor traditional internet infrastructure. Professional installation by JayTech starts from ₦85,000 and ensures you get the best possible performance from your system.</p>

<h2>Is Starlink Worth It in Nigeria?</h2>
<p>For many Nigerians, Starlink is absolutely worth the investment. If you work remotely, run an online business, need reliable video conferencing, or live in an area with poor internet coverage, Starlink can be a game-changer. The unlimited data, consistent speeds, and low latency make it superior to most alternatives. Businesses especially benefit from the reliable connection for cloud operations, POS systems, and customer-facing services. Contact JayTech today to discuss whether Starlink is the right choice for your needs.</p>',
 'Everything you need to know about Starlink satellite internet in Nigeria. Availability, pricing, speeds, installation, and whether its worth it.',
 '/images/jay18.jpg',
 'bb000000-0000-0000-0000-000000000002',
 '["starlink", "internet", "nigeria", "satellite", "broadband", "spacex"]',
 'Starlink Internet in Nigeria: Everything You Need to Know | JayTech Blog',
 'Complete guide to Starlink in Nigeria. Learn about availability, pricing, speeds, and installation. Is Starlink worth it in Nigeria?',
 'starlink nigeria, starlink price nigeria, starlink installation nigeria, starlink speed nigeria, satellite internet nigeria',
 'published',
 '2026-04-10T10:00:00Z'),

('cc000000-0000-0000-0000-000000000003',
 'Top 5 Electrical Safety Tips for Nigerian Homes',
 'top-5-electrical-safety-tips-for-nigerian-homes',
 '<h2>Why Electrical Safety Matters</h2>
<p>Electrical accidents are one of the leading causes of house fires in Nigeria. Faulty wiring, overloaded circuits, and improper electrical installations claim lives and destroy properties every year. Many of these tragedies are preventable with proper knowledge and regular maintenance. As a leading electrical services company, JayTech is committed to educating Nigerian homeowners on electrical safety to protect their families and properties.</p>

<h2>1. Avoid Overloading Power Sockets and Extension Boards</h2>
<p>One of the most common causes of electrical fires in Nigerian homes is overloading power sockets. Using multiple adapters plugged into a single socket to power high-wattage appliances like electric irons, microwaves, and heaters can cause overheating and fire. Each power socket should only handle appliances within its rated capacity. Distribute your appliances across multiple sockets on different circuits, and never daisy-chain extension boards together.</p>

<h2>2. Regularly Inspect Your Electrical Wiring</h2>
<p>Old and deteriorating wiring is a silent killer. If your home is over 15 years old and has never had its wiring inspected, you could be at risk. Warning signs include flickering lights, burning smells from outlets, warm or discolored switch plates, frequently tripping breakers, and sparking when plugging in appliances. Schedule a professional electrical inspection with JayTech every 2-3 years to identify and fix potential hazards before they cause fires or electrocution.</p>

<h2>3. Install Circuit Breakers and RCDs</h2>
<p>A modern distribution board with Miniature Circuit Breakers (MCBs) and Residual Current Devices (RCDs) is essential for electrical safety. MCBs automatically cut off power when a circuit is overloaded, preventing overheating and fire. RCDs detect earth faults and cut power in milliseconds, preventing electrocution. If your home still uses old fuse boxes or has no circuit protection at all, upgrading your distribution board should be a top priority.</p>

<h2>4. Keep Water Away from Electrical Points</h2>
<p>Water and electricity are a deadly combination. Ensure all electrical points, switches, and appliances are kept away from water sources. In bathrooms and kitchens, use moisture-resistant switch plates. Never touch electrical switches or plugs with wet hands. Install ground fault protection (RCDs) in wet areas. Ensure outdoor electrical installations are properly weatherproofed. During flooding, switch off the main breaker before water reaches electrical outlets.</p>

<h2>5. Use Qualified Electricians Only</h2>
<p>Always use licensed, qualified electricians for any electrical work in your home. Unqualified work is one of the leading causes of electrical fires and injuries in Nigeria. A qualified electrician understands load calculations, proper wire sizing, earthing requirements, and Nigerian electrical standards. At JayTech, all our electricians are licensed by the Nigerian Society of Engineers and undergo regular safety training. Never attempt DIY electrical repairs unless you are a trained professional.</p>',
 'Protect your family and property with these essential electrical safety tips for Nigerian homes. Learn about wiring safety, circuit protection, and more.',
 '/images/jay19.jpg',
 'bb000000-0000-0000-0000-000000000003',
 '["electrical safety", "home safety", "nigeria", "wiring", "fire prevention"]',
 'Top 5 Electrical Safety Tips for Nigerian Homes | JayTech Blog',
 'Essential electrical safety tips for Nigerian homeowners. Prevent electrical fires and keep your family safe with expert advice.',
 'electrical safety nigeria, home electrical safety tips, electrical fire prevention, nigerian home safety',
 'published',
 '2026-05-20T10:00:00Z'),

('cc000000-0000-0000-0000-000000000004',
 'How to Choose the Right Solar System for Your Home',
 'how-to-choose-the-right-solar-system-for-your-home',
 '<h2>Understanding Your Energy Needs</h2>
<p>Choosing the right solar system for your home starts with understanding your energy consumption. Many Nigerians make the mistake of either overspending on a system that is too large or undersizing and still relying heavily on generators. The key is to accurately assess your daily electricity needs and design a system that matches those needs efficiently and cost-effectively.</p>

<h2>Step 1: Conduct an Energy Audit</h2>
<p>Begin by listing all the electrical appliances you want to power with solar and noting their wattage. Common household items include: LED bulbs (10W each), ceiling fans (75W), television (100-150W), refrigerator (150-300W), decoder (25W), air conditioner (1000-2000W), water heater (2000-3000W), and washing machine (500W). Multiply each appliance wattage by the number of hours you use it daily to get watt-hours. Add up all watt-hours to determine your total daily energy requirement.</p>

<h2>Step 2: Decide on System Type</h2>
<p>There are three main types of solar systems: <strong>Off-grid</strong> systems are completely independent of the national grid and rely entirely on batteries for nighttime power. They are ideal for areas with no grid access. <strong>Grid-tied</strong> systems are connected to the national grid and export excess solar energy, reducing your electricity bill. However, they do not provide backup during grid outages. <strong>Hybrid</strong> systems combine solar panels with both battery storage and grid connection, providing the best of both worlds - they store excess energy for use during outages while also being connected to the grid as a backup.</p>

<h2>Step 3: Choose Quality Components</h2>
<p>The quality of your solar components directly impacts system performance and lifespan. For panels, choose Tier-1 brands like LONGi, JinkoSolar, or Canadian Solar - these come with 25-year performance warranties. For inverters, reputable brands include Deye, Growatt, and Luminous. For batteries, lithium batteries offer longer lifespan and better performance but cost more upfront, while tubular lead-acid batteries are more affordable but require more maintenance. Always prioritize quality over the lowest price.</p>

<h2>Step 4: Get Professional Sizing</h2>
<p>While you can estimate your needs, professional sizing ensures accuracy. A JayTech energy consultant will analyze your consumption patterns, consider seasonal variations, account for system losses, and recommend the optimal system size. This prevents oversizing (which wastes money) or undersizing (which leaves you without enough power). Professional sizing also considers future expansion needs if you plan to add more appliances.</p>',
 'A practical guide to choosing the perfect solar system for your Nigerian home. Learn about energy needs assessment, system types, and component selection.',
 '/images/jay20.jpg',
 'bb000000-0000-0000-0000-000000000001',
 '["solar", "home", "guide", "inverter", "battery", "energy"]',
 'How to Choose the Right Solar System for Your Home | JayTech Blog',
 'Practical guide to selecting the perfect solar system for your home in Nigeria. Energy assessment, system types, and component selection explained.',
 'choose solar system, solar system for home nigeria, right solar size, solar inverter battery nigeria',
 'draft',
 null);

-- ============================================
-- TECHNICIANS (3)
-- ============================================
insert into public.technicians (id, user_id, name, phone, email, specialization, profile_photo, availability, status, bio) values
('dd000000-0000-0000-0000-000000000001', null,
 'Ade Okonkwo', '+234 812 345 6789', 'ade.okonkwo@jaytech.ng',
 'Solar Installation & Design',
 '/images/jay.png',
 'available', 'active',
 'Ade is a certified solar energy specialist with over 6 years of experience in designing and installing residential and commercial solar systems across Nigeria. He has successfully completed over 150 solar installations and holds certifications from the Nigerian Society of Engineers and multiple solar equipment manufacturers. Ade specializes in hybrid solar systems and energy optimization.'),

('dd000000-0000-0000-0000-000000000002', null,
 'Chidi Nnamdi', '+234 813 456 7890', 'chidi.nnamdi@jaytech.ng',
 'Electrical Installation & Maintenance',
 '/images/jay.png',
 'available', 'active',
 'Chidi is a licensed electrical engineer with 8 years of experience in residential and commercial electrical installations. He is an expert in building wiring, distribution systems, earthing and lightning protection, and generator changeover systems. Chidi has worked on electrical projects for major companies and residential estates in Lagos and Abuja. He holds a B.Eng in Electrical Engineering from the University of Nigeria.'),

('dd000000-0000-0000-0000-000000000003', null,
 'Ibrahim Musa', '+234 814 567 8901', 'ibrahim.musa@jaytech.ng',
 'Starlink & Network Installation',
 '/images/jay.png',
 'busy', 'active',
 'Ibrahim is a specialized Starlink and network infrastructure technician with 4 years of experience. He has installed over 80 Starlink systems for homes, businesses, schools, and farms across Nigeria. Ibrahim is an expert in satellite internet optimization, WiFi network design, and enterprise-grade networking solutions. He ensures every Starlink installation delivers maximum performance with optimal dish placement and network configuration.');

-- ============================================
-- SAMPLE BOOKINGS (5 - mixed statuses)
-- ============================================
insert into public.bookings (id, booking_number, customer_id, service_id, status, service_name, service_type, full_name, email, phone, whatsapp, state, city, address, description, preferred_date, preferred_time, appointment_date, appointment_time, assigned_technician_id, estimated_cost, final_cost, payment_status) values

('ee000000-0000-0000-0000-000000000001', 'JT-2601-0001', null,
 'c0000000-0000-0000-0000-000000000001',
 'completed', 'Solar Panel Installation', 'Solar Installation',
 'Adebayo Olatunji', 'adebayo@email.com', '+234 805 123 4567', '+234 805 123 4567',
 'Lagos', 'Lekki', '15 Admiralty Way, Lekki Phase 1',
 'I need a 5kVA solar system installed for my 4-bedroom duplex. We use about 15kWh per day. Please include battery backup.',
 '2026-02-15', '10:00 AM', '2026-02-18', '09:00 AM',
 'dd000000-0000-0000-0000-000000000001',
 1200000, 1150000, 'paid'),

('ee000000-0000-0000-0000-000000000002', 'JT-2603-0042', null,
 'c0000000-0000-0000-0000-000000000002',
 'in_progress', 'Starlink Installation', 'Starlink Installation',
 'Chioma Eze', 'chioma.eze@email.com', '+234 806 234 5678', '+234 806 234 5678',
 'Abuja', 'Wuse 2', '22 Aminu Kano Crescent, Wuse 2',
 'We need Starlink installed for our office. About 15 workstations will be using the internet. Please include WiFi setup.',
 '2026-08-20', '02:00 PM', '2026-08-26', '10:00 AM',
 'dd000000-0000-0000-0000-000000000003',
 250000, 0, 'unpaid'),

('ee000000-0000-0000-0000-000000000003', 'JT-2607-0188', null,
 'c0000000-0000-0000-0000-000000000003',
 'confirmed', 'Electrical Services', 'Electrical Services',
 'Ibrahim Danja', 'ibrahim.danja@email.com', '+234 807 345 6789', '+234 807 345 6789',
 'Kano', 'Kano Municipal', '78 Murtala Mohammed Way, Kano',
 'We need complete rewiring for our 3-bedroom flat. The existing wiring is over 20 years old and we have been experiencing frequent tripping.',
 '2026-09-10', '09:00 AM', '2026-09-15', '08:00 AM',
 null,
 0, 0, 'unpaid'),

('ee000000-0000-0000-0000-000000000004', 'JT-2608-0301', null,
 'c0000000-0000-0000-0000-000000000001',
 'pending', 'Solar Panel Installation', 'Solar Installation',
 'Fatima Abubakar', 'fatima@email.com', '+234 808 456 7890', '+234 808 456 7890',
 'Port Harcourt', 'GRA', '42 Forces Avenue, GRA Phase 3',
 'I want to install solar panels for my pharmacy. We need to power 2 deep freezers for medicines, lighting, and a computer. Please advise on the best system.',
 '2026-09-25', '11:00 AM', null, null,
 null,
 0, 0, 'unpaid'),

('ee000000-0000-0000-0000-000000000005', 'JT-2605-0099', null,
 'c0000000-0000-0000-0000-000000000004',
 'cancelled', 'Repairs & Maintenance', 'Repairs & Maintenance',
 'Emeka Okonkwo', 'emeka@email.com', '+234 809 567 8901', '+234 809 567 8901',
 'Enugu', 'Enugu North', '15 Ogui New Layout, Enugu',
 'My inverter is showing error code E05 and not charging the batteries. It is a 3.5kVA Growatt inverter that is about 2 years old.',
 '2026-06-05', '03:00 PM', null, null,
 null,
 25000, 0, 'unpaid');

-- ============================================
-- SAMPLE PAYMENTS (3)
-- ============================================
insert into public.payments (id, booking_id, customer_id, amount, currency, status, payment_method, transaction_reference, paystack_reference, metadata, paid_at) values

('ff000000-0000-0000-0000-000000000001',
 'ee000000-0000-0000-0000-000000000001', null,
 575000, 'NGN', 'success', 'paystack',
 'TXN-JT-2601-0001-DEP', 'PSK-ref-abc123def456',
 '{"type": "deposit", "description": "50% deposit for solar installation"}',
 '2026-02-12T14:30:00Z'),

('ff000000-0000-0000-0000-000000000002',
 'ee000000-0000-0000-0000-000000000001', null,
 575000, 'NGN', 'success', 'paystack',
 'TXN-JT-2601-0001-BAL', 'PSK-ref-xyz789ghi012',
 '{"type": "balance", "description": "Balance payment for solar installation"}',
 '2026-02-20T11:00:00Z'),

('ff000000-0000-0000-0000-000000000003',
 'ee000000-0000-0000-0000-000000000002', null,
 125000, 'NGN', 'pending', 'paystack',
 'TXN-JT-2603-0042-DEP', '',
 '{"type": "deposit", "description": "50% deposit for Starlink installation"}',
 null);

-- ============================================
-- SAMPLE INVOICES (2)
-- ============================================
insert into public.invoices (id, invoice_number, booking_id, customer_id, items, subtotal, tax, total, status, due_date, notes) values

('f1000000-0000-0000-0000-000000000001', 'JTI-2602-0015',
 'ee000000-0000-0000-0000-000000000001', null,
 '[{"description": "5kVA Solar System (Panels, Inverter, Batteries, Accessories)", "quantity": 1, "unit_price": 850000, "total": 850000}, {"description": "Professional Installation & Wiring", "quantity": 1, "unit_price": 150000, "total": 150000}, {"description": "Mounting Structure (Roof)", "quantity": 1, "unit_price": 100000, "total": 100000}, {"description": "DC/AC Protection Devices", "quantity": 1, "unit_price": 50000, "total": 50000}]',
 1150000, 172500, 1322500, 'paid', '2026-03-20',
 'Thank you for choosing JayTech! Your system includes a 25-year panel warranty and 5-year installation warranty.'),

('f1000000-0000-0000-0000-000000000002', 'JTI-2609-0088',
 'ee000000-0000-0000-0000-000000000002', null,
 '[{"description": "Starlink Business Kit (Procured)", "quantity": 1, "unit_price": 400000, "total": 400000}, {"description": "Professional Starlink Installation", "quantity": 1, "unit_price": 85000, "total": 85000}, {"description": "Enterprise WiFi Access Points (x2)", "quantity": 2, "unit_price": 35000, "total": 70000}, {"description": "Cable Management & Weatherproofing", "quantity": 1, "unit_price": 25000, "total": 25000}]',
 580000, 87000, 667000, 'unpaid', '2026-09-30',
 'Payment is due within 30 days of invoice date. Late payments attract 5% monthly interest.');

-- ============================================
-- SAMPLE CONTACT MESSAGES (3)
-- ============================================
insert into public.contact_messages (id, name, email, phone, subject, message, service_type, status) values
('aa100000-0000-0000-0000-000000000001',
 'Adewale Sanusi', 'adewale.sanusi@email.com', '+234 810 111 2222',
 'Solar Installation Inquiry',
 'Good day, I am interested in installing solar panels for my newly built 4-bedroom house in Ikeja, Lagos. The house has about 200 square meters of usable roof space. We currently spend about ₦80,000 monthly on electricity. Please advise on the best system for our needs and provide a quotation. Thank you.',
 'Solar Installation', 'unread'),

('aa100000-0000-0000-0000-000000000002',
 'Grace Obi', 'grace.obi@company.com', '+234 811 222 3333',
 'Starlink for Office Complex',
 'Hello JayTech team, I manage an office complex in Wuse, Abuja and we are considering Starlink as our primary internet solution. We have about 30 offices that need reliable internet. Could you provide information about Starlink Business packages, expected speeds, and your installation process? Also, what is the estimated cost for such a setup? Best regards.',
 'Starlink Installation', 'read'),

('aa100000-0000-0000-0000-000000000003',
 'Mohammed Bello', 'mohammed.bello@email.com', '+234 812 333 4444',
 'Emergency Electrical Issue',
 'Please I need urgent help. My house in Kubwa, Abuja has been experiencing very dangerous electrical issues. The lights keep flickering, I noticed burn marks on one of the socket outlets, and yesterday we smelled something burning from behind the distribution board. I am very worried about fire risk. Can you send an electrician as soon as possible? This is an emergency.',
 'Electrical Services', 'unread');
