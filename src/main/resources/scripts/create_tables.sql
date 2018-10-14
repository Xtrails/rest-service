/*
Источник  https://habr.com/post/333424/

dbf — файлы не только разделяются как таблицы, но и подразделяются по регионам. Окажется более приемлемым вариантом, если вам не нужны адреса необъятной Родины, а только одного региона (как в нашем конкретном случае).

Распаковали файлы. Видим следующий набор файлов:

ADDROBХХ.DBF, где ХХ — номер региона — содержит данные непосредственно о регионе, автономных округах, городах и прочих населенных пунктах, улицах.
HOUSEХХ.DBF, где ХХ — номер региона — содержит информацию о номерах домов.
NORDOCХХ.DBF, где ХХ — номер региона — содержит информацию о причинах изменений в различных записях.
ROOMХХ.DBF, где ХХ — номер региона — содержит информацию о помещениях.
STEADХХ.DBF, где ХХ — номер региона — содержит информацию о земельных участках.
SOCRBASE.DBF — содержит информацию о сокращениях.
STRSTAT.DBF — содержит информацию о типе строения.

Кроме данных таблиц существует еще ряд других — служебных таблиц, которые содержат информацию о сокращениях в других таблицах.

В большинстве случаев достаточно сформировать адрес вплоть до дома. Хотя, если кому надо, то можно углубиться и дальше.

Таким образом, создадим 2 таблицы в БД postgresql.*/

------------------------------------------------------------------------------------
--Таблица с адресами:
CREATE TABLE addrs
(
    "ACTSTATUS" integer,
    "AOGUID" character varying(36) COLLATE pg_catalog."default",
    "AOID" character varying(36) COLLATE pg_catalog."default",
    "AOLEVEL" integer,
    "AREACODE" integer,
	"AUTOCODE" integer,
    "CENTSTATUS" integer,
    "CITYCODE" integer,
	"CODE" character varying(20) COLLATE pg_catalog."default",
	"CURRSTATUS" integer,
	"ENDDATE" timestamp,
    "FORMALNAME" character varying(120) COLLATE pg_catalog."default",
	"IFNSFL" integer,
	"IFNSUL" integer,
	"NEXTID" character varying(36) COLLATE pg_catalog."default",
    "OFFNAME" character varying(120) COLLATE pg_catalog."default",
	"OKATO" VARCHAR(11),
	"OKTMO" VARCHAR(11),
	"OPERSTATUS" integer,
	"PARENTGUID" character varying(36) COLLATE pg_catalog."default",
	"PLACECODE" integer,
	"PLAINCODE" character varying(20) COLLATE pg_catalog."default",
    "POSTALCODE" integer,
	"PREVID" character varying(36) COLLATE pg_catalog."default",
	"REGIONCODE" integer,
    "SHORTNAME" character varying(15) COLLATE pg_catalog."default",
	"STARTDATE" timestamp,
	"STREETCODE" integer,
	"TERRIFNSFL" integer,
	"TERRIFNSUL" integer,
	"UPDATEDATE" timestamp,
	"CTARCODE" integer,
	"EXTRCODE" integer,
	"SEXTCODE" integer,
	"LIVESTATUS" integer,
    "NORMDOC" character varying(36) COLLATE pg_catalog."default",
	"PLANCODE" integer,
	"CADNUM" integer,
	"DIVTYPE" integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE addrs
    OWNER to postgres;

------------------------------------------------------------------------------------
--Таблица с номерами домов:

CREATE TABLE hous
(
    "AOGUID" character varying(36) COLLATE pg_catalog."default",
    "BUILDNUM" character varying(10) COLLATE pg_catalog."default",
	"ENDDATE" timestamp,
	"ESTSTATUS" integer,
    "HOUSEGUID" character varying(36) COLLATE pg_catalog."default",
    "HOUSEID" character varying(36) COLLATE pg_catalog."default",
    "HOUSENUM" character varying(15) COLLATE pg_catalog."default",
	"STATSTATUS" integer,
	"IFNSFL" integer,
	"IFNSUL" integer,
	"OKATO" VARCHAR(11),
	"OKTMO" VARCHAR(11),
	"POSTALCODE" integer,
	"STARTDATE" timestamp,
	"STRUCNUM" VARCHAR(15),
	"STRSTATUS" integer,
	"TERRIFNSFL" integer,
	"TERRIFNSUL" integer,
	"UPDATEDATE" timestamp,
	"NORMDOC" character varying(36) COLLATE pg_catalog."default",
	"COUNTER" integer,
	"CADNUM" VARCHAR(50),
	"DIVTYPE" integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
------------------------------------------------------------------------------------
/*
Импорт данных осуществляется простым способом. Открываем файлы в Excel и сохраняем их как csv.
Дополнительно рекомендуется изменить кодировку, так как в отличии от xml файлов, которые представлены
в кодировке utf-8, dbf файлы — в кодировке win-866. Открываем файлы в редакторе (для данной цели
подойдет notepad++) и преобразуем в utf-8.
*/

------------------------------------------------------------------------------------
--Импорт таблицы с адресами:
COPY addrs FROM 'PathToTheFile\ADDROB01.csv' DELIMITER ';' CSV;
------------------------------------------------------------------------------------

------------------------------------------------------------------------------------
--Импорт таблицы с домами:
COPY addrs FROM 'PathToTheFile\HOUSE30.csv' DELIMITER ';' CSV;
------------------------------------------------------------------------------------