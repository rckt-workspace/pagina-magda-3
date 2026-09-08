-- 1. Tabla + RLS
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'llm_usage';


-- 2. Columnas
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'llm_usage'
ORDER BY ordinal_position;


-- 3. Políticas RLS
SELECT
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'llm_usage';


-- 4. Índices
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'llm_usage'
ORDER BY indexname;


-- 5. CHECK constraints
SELECT
    conname,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.llm_usage'::regclass
  AND contype = 'c'
ORDER BY conname;


-- 6. Verificar que NO tenga foreign keys
SELECT
    conname,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.llm_usage'::regclass
  AND contype = 'f';


-- 7. Verificar que NO tenga triggers
SELECT
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table = 'llm_usage';