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
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "sourceId" integer,
    "acquisitionDate" timestamp without time zone,
    "acquisitionPrice" double precision,
    "acquisitionCurrency" text,
    "acquisitionNotes" text,
    "acquisitionReceipt" text,
    provenance text
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
-- Name: ProductDocument; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductDocument" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    url text NOT NULL,
    type text,
    "uploadedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    notes text
);


ALTER TABLE public."ProductDocument" OWNER TO postgres;

--
-- Name: ProductDocument_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ProductDocument_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ProductDocument_id_seq" OWNER TO postgres;

--
-- Name: ProductDocument_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ProductDocument_id_seq" OWNED BY public."ProductDocument".id;


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
-- Name: Source; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Source" (
    id integer NOT NULL,
    name text NOT NULL,
    address text,
    postcode text,
    notes text
);


ALTER TABLE public."Source" OWNER TO postgres;

--
-- Name: Source_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Source_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Source_id_seq" OWNER TO postgres;

--
-- Name: Source_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Source_id_seq" OWNED BY public."Source".id;


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
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

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
-- Name: ProductDocument id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductDocument" ALTER COLUMN id SET DEFAULT nextval('public."ProductDocument_id_seq"'::regclass);


--
-- Name: Source id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Source" ALTER COLUMN id SET DEFAULT nextval('public."Source_id_seq"'::regclass);


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
9	decorative	Decorative	\N	\N	\N
10	garden	Garden	\N	\N	\N
11	lighting	Lighting	\N	\N	\N
12	mirrors	Mirrors	\N	\N	\N
13	rugs	Rugs	\N	\N	\N
14	seating	Seating	\N	\N	\N
15	storage	Storage	\N	\N	\N
16	tables	Tables	\N	\N	\N
\.


--
-- Data for Name: Image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Image" (id, url, alt, "productId", "order") FROM stdin;
1	/images/products/butler-s-tray-table-133/butler-s-tray-table-133_1.jpeg	\N	35	0
2	/images/products/draft-1747000717807-3966/draft-1747000717807-3966_1.jpeg	\N	36	0
3	/images/products/large-terracotta-pot_104/large-terracotta-pot_104_1.jpeg	\N	37	0
4	/images/products/louis-xvi-chair_114/louis-xvi-chair_114_1.jpeg	\N	38	0
5	/images/products/louis-xvi-chair_114/louis-xvi-chair_114_2.jpeg	\N	38	1
6	/images/products/marble-console-table_120/marble-console-table_120_1.jpeg	\N	39	0
7	/images/products/marble-console-table_120/marble-console-table_120_2.jpeg	\N	39	1
8	/images/products/rare-buddha_101/rare-buddha_101_1.jpeg	\N	40	0
9	/images/products/rare-buddha_101/rare-buddha_101_2.jpeg	\N	40	1
10	/images/products/rare-buddha_101/rare-buddha_101_3.jpeg	\N	40	2
11	/images/products/rare-buddha_101/rare-buddha_101_4.jpeg	\N	40	3
12	/images/products/art-nouveau-mirror_109/art-nouveau-mirror_109_2.jpeg	\N	34	0
13	/images/products/art-nouveau-mirror_109/art-nouveau-mirror_109_1.jpeg	\N	34	1
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, slug, title, description, price, currency, status, "mainImageId", dimensions, condition, origin, period, featured, "createdAt", "updatedAt", "sourceId", "acquisitionDate", "acquisitionPrice", "acquisitionCurrency", "acquisitionNotes", "acquisitionReceipt", provenance) FROM stdin;
2	draft-1747032025271-4727	Draft	Draft	0	GBP	draft	\N					f	2025-05-12 05:40:25.272	2025-05-12 05:40:25.272	\N	\N	\N	GBP	\N	\N	\N
3	draft-1747032832772-4562	Draft	Draft	0	GBP	draft	\N					f	2025-05-12 05:53:52.774	2025-05-12 05:53:52.774	\N	\N	\N	GBP	\N	\N	\N
4	paris-bistro-stool_115	Paris Bistro Stool	Classic French bistro stool.	130	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.024	\N	\N	\N	GBP	\N	\N	\N
5	velvet-sofa_116	Velvet Sofa	Plush velvet 3-seater.	1500	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.025	\N	\N	\N	GBP	\N	\N	\N
6	vintage-steamer-trunk_118	Vintage Steamer Trunk	Leather and brass trunk.	390	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.025	\N	\N	\N	GBP	\N	\N	\N
7	carved-bookcase_119	Carved Bookcase	Tall carved bookcase.	800	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.026	\N	\N	\N	GBP	\N	\N	\N
8	trumeau-mirror_110	Trumeau Mirror	Antique French trumeau.	480	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.016	\N	\N	\N	GBP	\N	\N	\N
9	persian-rug_111	Persian Rug	Hand-knotted wool rug.	900	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.017	\N	\N	\N	GBP	\N	\N	\N
10	kilim-runner_112	Kilim Runner	Colorful kilim runner.	320	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.018	\N	\N	\N	GBP	\N	\N	\N
11	aubusson-tapestry_113	Aubusson Tapestry	French tapestry panel.	1100	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.019	\N	\N	\N	GBP	\N	\N	\N
12	bronze-art-deco-statue_99	Bronze Art Deco Statue	Elegant 1920s bronze statue.	340	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.019	\N	\N	\N	GBP	\N	\N	\N
13	gilded-frame_100	Gilded Frame	Ornate 19th-century frame.	95	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.02	\N	\N	\N	GBP	\N	\N	\N
14	stone-birdbath_102	Stone Birdbath	Classic garden birdbath.	210	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.021	\N	\N	\N	GBP	\N	\N	\N
15	iron-garden-bench_103	Iron Garden Bench	Victorian-style bench.	450	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.022	\N	\N	\N	GBP	\N	\N	\N
16	brass-table-lamp_106	Brass Table Lamp	Classic brass lamp.	180	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.023	\N	\N	\N	GBP	\N	\N	\N
17	industrial-wall-sconce_107	Industrial Wall Sconce	Vintage industrial sconce.	75	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.023	\N	\N	\N	GBP	\N	\N	\N
18	round-side-table_122	Round Side Table	Small round side table.	220	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.027	\N	\N	\N	GBP	\N	\N	\N
19	cast-iron-garden-urn_124	Cast Iron Garden Urn	Heavy cast iron urn.	320	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.029	\N	\N	\N	GBP	\N	\N	\N
20	opaline-glass-lamp_125	Opaline Glass Lamp	French opaline lamp.	260	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.029	\N	\N	\N	GBP	\N	\N	\N
21	triptych-mirror_126	Triptych Mirror	Three-panel mirror.	410	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.03	\N	\N	\N	GBP	\N	\N	\N
22	moroccan-rug_127	Moroccan Rug	Handwoven Moroccan rug.	780	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.03	\N	\N	\N	GBP	\N	\N	\N
23	leather-club-chair_128	Leather Club Chair	Classic leather club chair.	950	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.031	\N	\N	\N	GBP	\N	\N	\N
24	wine-cabinet_129	Wine Cabinet	French wine storage.	1200	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.032	\N	\N	\N	GBP	\N	\N	\N
25	nesting-tables_130	Nesting Tables	Set of three tables.	330	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:26:00.032	\N	\N	\N	GBP	\N	\N	\N
26	ornate-gold-mirror_108	Ornate Gold Mirror	Large gilded mirror.	350	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 19:13:25.375	\N	\N	\N	GBP	\N	\N	\N
27	vintage-french-vase_98	Vintage French Vase	A beautiful hand-painted vase.	120	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 19:13:32.828	\N	\N	\N	GBP	\N	\N	\N
28	crystal-chandelier_105	Crystal Chandelier	Sparkling French chandelier.	1200	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 16:54:04.39	2025-05-11 18:38:56.372	\N	\N	\N	GBP	\N	\N	\N
29	bamboo-plant-stand_123	Bamboo Plant Stand	Art Deco plant stand.	140	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 16:54:04.39	2025-05-11 20:08:14.856	\N	\N	\N	GBP	\N	\N	\N
30	farmhouse-dining-table_121	Farmhouse Dining Table	Rustic oak table.	1800	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 16:54:04.39	2025-05-11 20:08:19.378	\N	\N	\N	GBP	\N	\N	\N
31	french-armoire_117	French Armoire	19th-century oak armoire.	2100	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 16:54:04.39	2025-05-11 20:08:27.041	\N	\N	\N	GBP	\N	\N	\N
32	draft-1747001086450-4247	Draft	Draft	0	GBP	draft	\N					f	2025-05-11 21:04:46.451	2025-05-11 21:04:46.451	\N	\N	\N	GBP	\N	\N	\N
33	draft-1747002719068-5025	Draft	Draft	0	GBP	draft	\N					f	2025-05-11 21:31:59.07	2025-05-11 21:31:59.07	\N	\N	\N	GBP	\N	\N	\N
34	art-nouveau-mirror_109	Art Nouveau Mirror	Curved wood frame.	202000	GBP	sold	13	\N	\N	\N	\N	t	2025-05-11 16:54:04.39	2025-05-12 15:53:57.017	\N	\N	\N	GBP	\N	\N	\N
35	butler-s-tray-table-133	Butler's Tray Table	Draft	250	GBP	draft	1					t	2025-05-11 21:07:06.142	2025-05-12 15:53:57.019	\N	\N	\N	GBP	\N	\N	\N
36	draft-1747000717807-3966	Butler's Tray Table 1	Draft	250	GBP	deleted	2					f	2025-05-11 20:58:37.809	2025-05-12 15:53:57.02	\N	\N	\N	GBP	\N	\N	\N
37	large-terracotta-pot_104	Large Terracotta Pot	Handmade terracotta.	60	GBP	available	3	\N	\N	\N	\N	t	2025-05-11 16:54:04.39	2025-05-12 15:53:57.021	\N	\N	\N	GBP	\N	\N	\N
38	louis-xvi-chair_114	Louis XVI Chair	Carved wood, upholstered.	600	GBP	available	4	\N	\N	\N	\N	t	2025-05-11 16:54:04.39	2025-05-12 15:53:57.022	\N	\N	\N	GBP	\N	\N	\N
39	marble-console-table_120	Marble Console Table	Louis XV style console.	950	GBP	available	6	\N	\N	\N	\N	t	2025-05-11 16:54:04.39	2025-05-12 15:53:57.023	\N	\N	\N	GBP	\N	\N	\N
40	rare-buddha_101	Rare Buddha	A unique and rare Buddha statue for testing porpoises.	15500	GBP	sold	8	6" high	As new	Tibet	c. 11th century	t	2025-05-11 16:54:04.39	2025-05-12 15:55:44.57	\N	\N	\N	GBP	\N	\N	\N
\.


--
-- Data for Name: ProductCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductCategory" ("productId", "categoryId") FROM stdin;
40	9
\.


--
-- Data for Name: ProductDocument; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductDocument" (id, "productId", url, type, "uploadedAt", notes) FROM stdin;
\.


--
-- Data for Name: ProductTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductTag" ("productId", "tagId") FROM stdin;
\.


--
-- Data for Name: Source; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Source" (id, name, address, postcode, notes) FROM stdin;
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tag" (id, name) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3d8dfce8-b33d-4b46-8788-ff870b26f669	b316510062254293bda47c17d8f3a033190d66acd15db85b6273d9ec6949fbce	2025-05-12 16:45:21.262769+01	20250512152816_init	\N	\N	2025-05-12 16:45:21.25008+01	1
af70b19f-3c6a-4a2f-98c5-aed481db233f	1fea95eed9aa692f339fbfb286c4a3d6797dad370669c2cf6d6867016c42076d	2025-05-12 16:45:21.265481+01	20250512153614_bob	\N	\N	2025-05-12 16:45:21.26307+01	1
\.


--
-- Name: Badge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Badge_id_seq"', 1, false);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 16, true);


--
-- Name: Image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Image_id_seq"', 13, true);


--
-- Name: ProductDocument_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProductDocument_id_seq"', 1, false);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_id_seq"', 40, true);


--
-- Name: Source_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Source_id_seq"', 1, false);


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
-- Name: ProductDocument ProductDocument_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductDocument"
    ADD CONSTRAINT "ProductDocument_pkey" PRIMARY KEY (id);


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
-- Name: Source Source_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Source"
    ADD CONSTRAINT "Source_name_key" UNIQUE (name);


--
-- Name: Source Source_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Source"
    ADD CONSTRAINT "Source_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


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
-- Name: ProductDocument ProductDocument_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductDocument"
    ADD CONSTRAINT "ProductDocument_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


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
-- Name: Product Product_sourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES public."Source"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

