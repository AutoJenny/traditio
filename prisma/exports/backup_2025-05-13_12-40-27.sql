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

--
-- Name: update_updated_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ BEGIN NEW.updated = NOW(); RETURN NEW; END; $$;


ALTER FUNCTION public.update_updated_column() OWNER TO postgres;

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
-- Name: Customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Customer" (
    id integer NOT NULL,
    name text,
    email text NOT NULL,
    phone text,
    newsletter boolean DEFAULT false NOT NULL,
    created timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Customer" OWNER TO postgres;

--
-- Name: Customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Customer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Customer_id_seq" OWNER TO postgres;

--
-- Name: Customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Customer_id_seq" OWNED BY public."Customer".id;


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
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    "customerId" integer NOT NULL,
    content text NOT NULL,
    created timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "productSlug" text,
    "pageUrl" text,
    status text DEFAULT 'unread'::text NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Message_id_seq" OWNER TO postgres;

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


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
    "updatedAt" timestamp(3) without time zone NOT NULL
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
    "uploadedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
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
-- Name: Customer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer" ALTER COLUMN id SET DEFAULT nextval('public."Customer_id_seq"'::regclass);


--
-- Name: Image id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Image" ALTER COLUMN id SET DEFAULT nextval('public."Image_id_seq"'::regclass);


--
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


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
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Customer" (id, name, email, phone, newsletter, created, updated) FROM stdin;
1	asdfsdf	dify@nickfiddes.com	45345	f	2025-05-13 10:55:56.126	2025-05-13 10:57:23.126
2	Bob	bob@bobster.com	3945ewtrt	f	2025-05-13 11:42:43.875	2025-05-13 11:42:43.875
3	Megan	lsjf@lsjdflj.com	94359875	f	2025-05-13 11:58:30.034	2025-05-13 11:58:30.034
4	Dan Rose	difdy@nickfiddes.com	33333333	f	2025-05-13 12:16:12.993	2025-05-13 12:16:12.993
5	asdffa	quivr@nickfiddes.com	23423	f	2025-05-13 12:34:35.747	2025-05-13 12:35:50.821
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
11	/images/products/large-terracotta-pot_104/large-terracotta-pot_104_1.jpeg	\N	104	0
12	/images/products/louis-xvi-chair_114/louis-xvi-chair_114_1.jpeg	\N	114	0
13	/images/products/louis-xvi-chair_114/louis-xvi-chair_114_2.jpeg	\N	114	1
14	/images/products/marble-console-table_120/marble-console-table_120_1.jpeg	\N	120	0
15	/images/products/marble-console-table_120/marble-console-table_120_2.jpeg	\N	120	1
16	/images/products/draft-1747000717807-3966/draft-1747000717807-3966_1.jpeg	\N	131	0
17	/images/products/butler-s-tray-table-133/butler-s-tray-table-133_1.jpeg	\N	133	0
46	/images/products/art-nouveau-mirror_109/art-nouveau-mirror_109_3.jpeg	\N	109	0
44	/images/products/art-nouveau-mirror_109/art-nouveau-mirror_109_1.jpeg	\N	109	1
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, "customerId", content, created, updated, "productSlug", "pageUrl", status) FROM stdin;
1	1	asdfs a	2025-05-13 11:01:30.907	2025-05-13 11:49:32.547	\N	/contact	deleted
2	2	Hello ! This is a message. Hello ! This is a message. Hello ! This is a message. Hello ! This is a message. Hello ! This is a message. Hello ! This is a message. Hello ! This is a message. Hello ! This is a message. Hello ! This is a message. Hello ! This is a message. 	2025-05-13 11:42:43.877	2025-05-13 11:53:32.716	\N	/contact	read
3	3	Wowser Wowser Wowser Wowser Wowser Wowser Wowser Wowser Wowser Wowser Wowser Wowser Wowser Wowser Wowser 	2025-05-13 11:58:30.035	2025-05-13 11:58:30.035	\N	/contact	unread
4	4	asdfasdf	2025-05-13 12:16:12.994	2025-05-13 12:16:12.994	\N	/contact	unread
5	5	asfsdaf	2025-05-13 12:35:50.83	2025-05-13 12:35:50.83	art-nouveau-mirror_109	/showroom/art-nouveau-mirror_109	unread
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, slug, title, description, price, currency, status, "mainImageId", dimensions, condition, origin, period, featured, "createdAt", "updatedAt") FROM stdin;
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
104	large-terracotta-pot_104	Large Terracotta Pot	Handmade terracotta.	60	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 17:54:04.39	2025-05-11 20:22:00.613
101	rare-buddha_101	Rare Buddha	A unique and rare Buddha statue for testing porpoises.	15500	GBP	sold	\N	6" high	As new	Tibet	c. 11th century	t	2025-05-11 17:54:04.39	2025-05-11 20:09:29.287
131	draft-1747000717807-3966	Butler's Tray Table 1	Draft	250	GBP	deleted	\N					f	2025-05-11 21:58:37.809	2025-05-11 22:14:08.31
133	butler-s-tray-table-133	Butler's Tray Table	Draft	250	GBP	draft	\N					t	2025-05-11 22:07:06.142	2025-05-11 22:14:31.064
114	louis-xvi-chair_114	Louis XVI Chair	Carved wood, upholstered.	600	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 17:54:04.39	2025-05-11 20:23:30.257
121	farmhouse-dining-table_121	Farmhouse Dining Table	Rustic oak table.	1800	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 17:54:04.39	2025-05-11 21:08:19.378
117	french-armoire_117	French Armoire	19th-century oak armoire.	2100	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 17:54:04.39	2025-05-11 21:08:27.041
120	marble-console-table_120	Marble Console Table	Louis XV style console.	950	GBP	available	\N	\N	\N	\N	\N	t	2025-05-11 17:54:04.39	2025-05-11 21:14:56.955
2	draft-1747032832772-4562	Draft	Draft	0	GBP	deleted	\N					f	2025-05-12 06:53:52.774	2025-05-13 10:25:12.42
123	bamboo-plant-stand_123	Bamboo Plant Stand	Art Deco plant stand.	140	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-12 23:11:09.522
132	draft-1747001086450-4247	Draft	Draft	0	GBP	deleted	\N					f	2025-05-11 22:04:46.451	2025-05-13 10:34:10.195
134	draft-1747002719068-5025	Draft	Draft	0	GBP	deleted	\N					f	2025-05-11 22:31:59.07	2025-05-13 10:34:19.495
1	draft-1747032025271-4727	Draft	Draft	0	GBP	deleted	\N					f	2025-05-12 06:40:25.272	2025-05-13 10:35:53.524
106	brass-table-lamp_106	Brass Table Lamp	Classic brass lamp.	180	GBP	available	\N	\N	\N	\N	\N	f	2025-05-11 17:54:04.39	2025-05-13 10:38:32.947
109	art-nouveau-mirror_109	Art Nouveau Mirror	Curved gold frame.	202000	GBP	sold	\N	\N	\N	\N	\N	t	2025-05-11 17:54:04.39	2025-05-12 23:32:35.948
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
104	26
114	30
109	25
109	27
109	28
106	27
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
95eeab03-71f7-4cbf-92fc-829684de16ff	b316510062254293bda47c17d8f3a033190d66acd15db85b6273d9ec6949fbce	2025-05-12 22:05:42.868758+01	20250512152816_init	\N	\N	2025-05-12 22:05:42.853019+01	1
12f0f684-acd1-4cce-b3b4-f9dc808612a3	1fea95eed9aa692f339fbfb286c4a3d6797dad370669c2cf6d6867016c42076d	2025-05-12 22:05:42.871436+01	20250512153614_bob	\N	\N	2025-05-12 22:05:42.869056+01	1
2db28263-f8d6-4521-90b1-f36940bb8f4a	d1f9b607dcf117f89d089740a165d6e6baf0dda4a8c2eb2f8ecbe662d83d6b76	2025-05-12 07:31:36.717925+01	20250511145459_init	\N	\N	2025-05-12 07:31:36.708445+01	1
83952cb3-0969-4d45-b8ba-84000b20b068	ba97a7530c94287c4889a96bac7047404febfeea98b21eca7ea1b2b9c34fe5cf	2025-05-12 07:31:36.720749+01	20250511171929_product_multicategory	\N	\N	2025-05-12 07:31:36.718219+01	1
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
-- Name: Customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Customer_id_seq"', 5, true);


--
-- Name: Image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Image_id_seq"', 46, true);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Message_id_seq"', 5, true);


--
-- Name: ProductDocument_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ProductDocument_id_seq"', 1, false);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_id_seq"', 134, true);


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
-- Name: Customer Customer_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_email_unique" UNIQUE (email);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: Image Image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "Image_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


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
-- Name: Customer_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Customer_createdAt_idx" ON public."Customer" USING btree (created);


--
-- Name: Customer_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Customer_email_idx" ON public."Customer" USING btree (email);


--
-- Name: Message_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Message_createdAt_idx" ON public."Message" USING btree (created);


--
-- Name: Product_mainImageId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_mainImageId_key" ON public."Product" USING btree ("mainImageId");


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: Source_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Source_name_key" ON public."Source" USING btree (name);


--
-- Name: Tag_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_name_key" ON public."Tag" USING btree (name);


--
-- Name: Customer customer_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER customer_updated BEFORE UPDATE ON public."Customer" FOR EACH ROW EXECUTE FUNCTION public.update_updated_column();


--
-- Name: Message message_updated; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER message_updated BEFORE UPDATE ON public."Message" FOR EACH ROW EXECUTE FUNCTION public.update_updated_column();


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
-- Name: Message Message_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON DELETE CASCADE;


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
-- PostgreSQL database dump complete
--

