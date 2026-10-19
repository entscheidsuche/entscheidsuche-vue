<?php
/*
 * _search_KI.php – Proxy für die KI-Suche von entscheidsuche.ch
 *
 * Leitet eine feste Liste von API-Pfaden an das Backend weiter und beantwortet
 * CORS-Preflight-Anfragen selbst. Der Pfad wird hinter dem Skriptnamen angegeben
 * (PATH_INFO), z. B.:
 *
 *   POST https://entscheidsuche.ch/_search_KI.php/embed/big/v1/embeddings
 *     -> POST https://entscheidsuche-beta.pansoft.de/api/embed/big/v1/embeddings
 *
 * Frontend (.env): VUE_APP_*_URL = https://entscheidsuche.ch/_search_KI.php/<pfad>
 */

// Backend, an das weitergeleitet wird (ohne abschliessenden Slash).
const UPSTREAM = 'https://entscheidsuche-beta.pansoft.de/api';

// Nur diese Pfade werden weitergeleitet (alle per POST mit JSON-Body).
const ALLOWED_PATHS = [
    '/elasticsearch/_search',
    '/elasticsearch/embeddings_qwen3-embedding-8b/_search',
    '/elasticsearch/embeddings_qwen3-embedding-0.6b_micro/_search',
    '/embed/big/v1/embeddings',
    '/embed/micro/v1/embeddings',
    '/indexMicroChunk',
];

const MAX_BODY_BYTES = 1048576; // 1 MB
const TIMEOUT_SECONDS = 130;    // indexMicroChunk darf bis zu 120 s dauern

// CORS-Header für alle Antworten, auch Fehler.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Max-Age: 86400');

function fail(int $status, string $message): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode(['error' => $message]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? '';
$path = $_SERVER['PATH_INFO'] ?? ($_SERVER['ORIG_PATH_INFO'] ?? '');

// Preflight: direkt beantworten, nicht weiterleiten.
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($method !== 'POST') {
    fail(405, 'Only POST is allowed');
}
if (!in_array($path, ALLOWED_PATHS, true)) {
    fail(404, 'Unknown path');
}

$body = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($body === false || strlen($body) > MAX_BODY_BYTES) {
    fail(413, 'Request body too large');
}

$ch = curl_init(UPSTREAM . $path);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => TIMEOUT_SECONDS,
]);
$response = curl_exec($ch);

if ($response === false) {
    $error = curl_error($ch);
    curl_close($ch);
    fail(502, 'Upstream request failed: ' . $error);
}

$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE) ?: 'application/json';
curl_close($ch);

http_response_code($status);
header('Content-Type: ' . $contentType);
echo $response;
