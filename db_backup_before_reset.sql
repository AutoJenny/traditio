--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Badge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Badge" (
    id integer NOT NULL,
    label text NOT NULL,
    "productId" integer NOT NULL
);


ALTER TABLE public."Badge" OWNER TO postgres;

--
-- Name: Badge_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Badge_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Badge_id_seq" OWNER TO postgres;

--
-- Name: Badge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Badge_id_seq" OWNED BY public."Badge".id;


--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    description text,
    "parentId" integer,
    "order" integer
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Category_id_seq" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: Image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Image" (
    id integer NOT NULL,
    url text NOT NULL,
    alt text,
    "productId" integer,
    "order" integer
);


ALTER TABLE public."Image" OWNER TO postgres;

--
-- Name: Image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Image_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Image_id_seq" OWNER TO postgres;

--
-- Name: Image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Image_id_seq" OWNED BY public."Image".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    currency text DEFAULT 'GBP'::text NOT NULL,
    status text DEFAULT 'available'::text NOT NULL,
    "mainImageId" integer,
    dimensions text,
    condition text,
    origin text,
    period text,
    featured boolean DEFAULT false NOT NULL,
    "created" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: ProductCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductCategory" (
    "productId" integer NOT NULL,
    "categoryId" integer NOT NULL
);


ALTER TABLE public."ProductCategory" OWNER TO postgres;

--
-- Name: ProductTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductTag" (
    "productId" integer NOT NULL,
    "tagId" integer NOT NULL
);


ALTER TABLE public."ProductTag" OWNER TO postgres;

--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Product_id_seq" OWNER TO postgres;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: Tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tag" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Tag" OWNER TO postgres;

--
-- Name: Tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Tag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tag_id_seq" OWNER TO postgres;

--
-- Name: Tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Tag_id_seq" OWNED BY public."Tag".id;


--
-- Name: Badge id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Badge" ALTER COLUMN id SET DEFAULT nextval('public."Badge_id_seq"'::regclass);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: Image id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Image" ALTER COLUMN id SET DEFAULT nextval('public."Image_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: Tag id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag" ALTER COLUMN id SET DEFAULT nextval('public."Tag_id_seq"'::regclass);


--
-- Data for Name: Badge; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Badge" (id, label, "productId") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, slug, name, description, "parentId", "order") FROM stdin;
25	decorative	Decorative	\N	\N	\N
26	garden	Garden	\N	\N	\N
27	lighting	Lighting	\N	\N	\N
28	mirrors	Mirrors	\N	\N	\N
29	rugs	Rugs	\N	\N	\N
30	seating	Seating	\N	\N	\N
31	storage	Storage	\N	\N	\N
32	tables	Tables	\N	\N	\N
\.


--
-- Data for Name: Image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Image" (id, url, alt, "productId", "order") FROM stdin;
1	/images/products/test/IMG_1603.jpeg	Rare Buddha angle 1	\N	\N
2	/images/products/test/IMG_1604.jpeg	Rare Buddha angle 2	\N	\N
3	/images/products/test/IMG_1606.jpeg	Rare Buddha angle 3	\N	\N
4	/images/products/test/IMG_1607.jpeg	Rare Buddha angle 4	\N	\N
5	/images/products/rare-buddha_101/rare-buddha_101_1.jpeg	Rare Buddha angle 1	101	0
7	/images/products/rare-buddha_101/rare-buddha_101_2.jpeg	Rare Buddha angle 3	101	1
6	/images/products/rare-buddha_101/rare-buddha_101_3.jpeg	Rare Buddha angle 2	101	2
8	/images/products/rare-buddha_101/rare-buddha_101_4.jpeg	Rare Buddha angle 4	101	3
10	/images/products/art-nouveau-mirror_109/art-nouveau-mirror_109_2.jpeg	\N	109	0
9	/images/products/art-nouveau-mirror_109/art-nouveau-mirror_109_1.jpeg	\N	109	1
11	/images/products/large-terracotta-pot_104/large-terracotta-pot_104_1.jpeg	\N	104	0
12	/images/products/louis-xvi-chair_114/louis-xvi-chair_114_1.jpeg	\N	114	0
13	/images/products/louis-xvi-chair_114/louis-xvi-chair_114_2.jpeg	\N	114	1
14	/images/products/marble-console-table_120/marble-console-table_120_1.jpeg	\N	120	0
15	/images/products/marble-console-table_120/marble-console-table_120_2.jpeg	\N	120	1
16	/images/products/draft-1747000717807-3966/draft-1747000717807-3966_1.jpeg	\N	131	0
17	/images/products/butler-s-tray-table-133/butler-s-tray-table-133_1.jpeg	\N	133	0
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, slug, title, description, price, currency, status, "mainImageId", dimensions, condition, origin, period, featured, "created", "updated") FROM stdin;
115	paris-bistro-stool_115	Paris Bistro Stool	Classic French bistro stool.	130	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.024
116	velvet-sofa_116	Velvet Sofa	Plush velvet 3-seater.	1500	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.025
118	vintage-steamer-trunk_118	Vintage Steamer Trunk	Leather and brass trunk.	390	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.025
119	carved-bookcase_119	Carved Bookcase	Tall carved bookcase.	800	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.026
110	trumeau-mirror_110	Trumeau Mirror	Antique French trumeau.	480	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.016
111	persian-rug_111	Persian Rug	Hand-knotted wool rug.	900	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.017
112	kilim-runner_112	Kilim Runner	Colorful kilim runner.	320	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.018
113	aubusson-tapestry_113	Aubusson Tapestry	French tapestry panel.	1100	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.019
99	bronze-art-deco-statue_99	Bronze Art Deco Statue	Elegant 1920s bronze statue.	340	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.019
100	gilded-frame_100	Gilded Frame	Ornate 19th-century frame.	95	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.02
102	stone-birdbath_102	Stone Birdbath	Classic garden birdbath.	210	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.021
103	iron-garden-bench_103	Iron Garden Bench	Victorian-style bench.	450	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.022
106	brass-table-lamp_106	Brass Table Lamp	Classic brass lamp.	180	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.023
107	industrial-wall-sconce_107	Industrial Wall Sconce	Vintage industrial sconce.	75	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.023
122	round-side-table_122	Round Side Table	Small round side table.	220	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.027
124	cast-iron-garden-urn_124	Cast Iron Garden Urn	Heavy cast iron urn.	320	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.029
125	opaline-glass-lamp_125	Opaline Glass Lamp	French opaline lamp.	260	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.029
126	triptych-mirror_126	Triptych Mirror	Three-panel mirror.	410	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.03
127	moroccan-rug_127	Moroccan Rug	Handwoven Moroccan rug.	780	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.03
128	leather-club-chair_128	Leather Club Chair	Classic leather club chair.	950	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.031
129	wine-cabinet_129	Wine Cabinet	French wine storage.	1200	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.032
130	nesting-tables_130	Nesting Tables	Set of three tables.	330	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:26:00.032
108	ornate-gold-mirror_108	Ornate Gold Mirror	Large gilded mirror.	350	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 20:13:25.375
98	vintage-french-vase_98	Vintage French Vase	A beautiful hand-painted vase.	120	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 20:13:32.828
105	crystal-chandelier_105	Crystal Chandelier	Sparkling French chandelier.	1200	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-11 19:38:56.372
109	art-nouveau-mirror_109	Art Nouveau Mirror	Curved wood frame.	202000	GBP	sold	\N	\N	\N	\N	\N	t	2025-05-11 17:54:04.39	2025-05-11 20:14:27.529
104	large-terracotta-pot_104	Large Terracotta Pot	Handmade terracotta.	60	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 17:54:04.39	2025-05-11 20:22:00.613
101	rare-buddha_101	Rare Buddha	A unique and rare Buddha statue for testing porpoises.	15500	GBP	sold	\N	6" high	As new	Tibet	c. 11th century	t	2025-05-11 17:54:04.39	2025-05-11 20:09:29.287
131	draft-1747000717807-3966	Butler's Tray Table 1	Draft	250	GBP	deleted	\N					f	2025-05-11 21:58:37.809	2025-05-11 22:14:08.31
133	butler-s-tray-table-133	Butler's Tray Table	Draft	250	GBP	draft	\N					t	2025-05-11 22:07:06.142	2025-05-11 22:14:31.064
114	louis-xvi-chair_114	Louis XVI Chair	Carved wood, upholstered.	600	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 17:54:04.39	2025-05-11 20:23:30.257
123	bamboo-plant-stand_123	Bamboo Plant Stand	Art Deco plant stand.	140	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 17:54:04.39	2025-05-11 21:08:14.856
121	farmhouse-dining-table_121	Farmhouse Dining Table	Rustic oak table.	1800	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 17:54:04.39	2025-05-11 21:08:19.378
117	french-armoire_117	French Armoire	19th-century oak armoire.	2100	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 17:54:04.39	2025-05-11 21:08:27.041
120	marble-console-table_120	Marble Console Table	Louis XV style console.	950	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 17:54:04.39	2025-05-11 21:14:56.955
132	draft-1747001086450-4247	Draft	Draft	0	GBP	draft	\N					f	2025-05-11 22:04:46.451	2025-05-11 22:04:46.451
134	draft-1747002719068-5025	Draft	Draft	0	GBP	draft	\N					f	2025-05-11 22:31:59.07	2025-05-11 22:31:59.07
\.


--
-- Data for Name: ProductCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductCategory" ("productId", "categoryId") FROM stdin;
99	25
100	25
102	26
103	26
124	26
106	27
107	27
125	27
110	28
126	28
111	29
112	29
113	29
127	29
115	30
116	30
128	30
118	31
119	31
129	31
122	32
130	32
101	25
101	26
109	27
109	28
104	26
114	30
\.


--
-- Data for Name: ProductTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductTag" ("productId", "tagId") FROM stdin;
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tag" (id, name) FROM stdin;
\.


--
-- Name: Badge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Badge_id_seq"', 1, false);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 32, true);


--
-- Name: Image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Image_id_seq"', 17, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_id_seq"', 134, true);


--
-- Name: Tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Tag_id_seq"', 1, false);


--
-- Name: Badge Badge_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Badge"
    ADD CONSTRAINT "Badge_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Image Image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "Image_pkey" PRIMARY KEY (id);


--
-- Name: ProductCategory ProductCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductCategory"
    ADD CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("productId", "categoryId");


--
-- Name: ProductTag ProductTag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductTag"
    ADD CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("productId", "tagId");


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: Product_mainImageId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_mainImageId_key" ON public."Product" USING btree ("mainImageId");


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: Tag_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_name_key" ON public."Tag" USING btree (name);


--
-- Name: Badge Badge_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Badge"
    ADD CONSTRAINT "Badge_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Category Category_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Image Image_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProductCategory ProductCategory_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductCategory"
    ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductCategory ProductCategory_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductCategory"
    ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductTag ProductTag_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductTag"
    ADD CONSTRAINT "ProductTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductTag ProductTag_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductTag"
    ADD CONSTRAINT "ProductTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Product Product_mainImageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_mainImageId_fkey" FOREIGN KEY ("mainImageId") REFERENCES public."Image"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

